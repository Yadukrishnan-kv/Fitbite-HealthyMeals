import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Field, Input, Textarea, Button, Spinner, PageHeader } from '../components/ui';
import ImagePicker from '../components/ImagePicker';

const GROUP_LABELS = {
  general: 'General',
  branding: 'Branding',
  contact: 'Contact',
  seo: 'SEO',
};

/** Render the right control for a setting based on its declared `type`. */
function SettingControl({ setting, value, onChange }) {
  const common = { id: setting.key, value: value ?? '', onChange: (e) => onChange(e.target.value) };
  switch (setting.type) {
    case 'textarea':
      return <Textarea rows={3} {...common} />;
    case 'image':
      return <ImagePicker value={value} onChange={onChange} />;
    case 'email':
      return <Input type="email" {...common} />;
    case 'phone':
      return <Input type="tel" {...common} />;
    default:
      return <Input type="text" {...common} />;
  }
}

export default function SettingsPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get('/admin/settings')
      .then((data) => {
        if (!active) return;
        setItems(data.items || []);
        const map = {};
        (data.items || []).forEach((s) => (map[s.key] = s.value));
        setValues(map);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [toast]);

  // Group settings for a tidy, sectioned form.
  const groups = useMemo(() => {
    const by = {};
    items.forEach((s) => {
      const g = s.group || 'general';
      (by[g] = by[g] || []).push(s);
    });
    return by;
  }, [items]);

  const set = (key, val) => setValues((v) => ({ ...v, [key]: val }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { settings: items.map((s) => ({ key: s.key, value: values[s.key] ?? '' })) };
      const data = await api.patch('/admin/settings', payload);
      setItems(data.items || []);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Global content used across the public site" />
      <form className="admin-form" onSubmit={save}>
        {Object.entries(groups).map(([group, groupItems]) => (
          <div key={group} className="admin-settings-group">
            <div className="admin-settings-group-title">{GROUP_LABELS[group] || group}</div>
            <div className="admin-form-grid">
              {groupItems.map((s) => (
                <div key={s.key} className={s.type === 'textarea' || s.type === 'image' ? 'admin-form-full' : ''}>
                  <Field label={s.label || s.key} hint={s.type === 'image' ? undefined : `key: ${s.key}`}>
                    <SettingControl setting={s} value={values[s.key]} onChange={(v) => set(s.key, v)} />
                  </Field>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="admin-form-actions">
          <Button type="submit" loading={saving}>Save settings</Button>
        </div>
      </form>
    </div>
  );
}
