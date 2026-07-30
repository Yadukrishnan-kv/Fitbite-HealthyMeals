import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Field, Input, Textarea, Select, Toggle, Button, Spinner, PageHeader } from './ui';
import ImagePicker from './ImagePicker';
import RichTextEditor from './RichTextEditor';

/**
 * Generic create/edit form driven by a `fields` schema.
 *
 * field: { name, label, type, required, hint, options, placeholder, full }
 *   types: text | textarea | number | checkbox | select | tags | image | richtext
 */
export default function ResourceForm({
  title,
  endpoint,
  backPath,
  fields,
  defaults = {},
  toApi, // optional (values) => payload transform before submit
  fromApi, // optional (item) => values transform after load
}) {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const toast = useToast();

  const [values, setValues] = useState(defaults);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let active = true;
    api
      .get(`${endpoint}/${id}`)
      .then((data) => {
        if (!active) return;
        const item = data.item;
        setValues({ ...defaults, ...(fromApi ? fromApi(item) : item) });
      })
      .catch((e) => toast.error(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (name, val) => {
    setValues((v) => ({ ...v, [name]: val }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = toApi ? toApi(values) : values;
    try {
      if (isNew) {
        await api.post(endpoint, payload);
        toast.success('Created');
      } else {
        await api.patch(`${endpoint}/${id}`, payload);
        toast.success('Saved');
      }
      navigate(backPath);
    } catch (err) {
      if (err.details) {
        const map = {};
        err.details.forEach((d) => {
          map[d.field] = d.message;
        });
        setErrors(map);
        toast.error('Please fix the highlighted fields');
      } else {
        toast.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><Spinner /></div>;

  return (
    <div>
      <PageHeader title={isNew ? `New ${title}` : `Edit ${title}`} />
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-grid">
          {fields.map((f) => (
            <div key={f.name} className={f.full ? 'admin-form-full' : ''}>
              <FieldControl field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} />
            </div>
          ))}
        </div>
        <div className="admin-form-actions">
          <Link to={backPath} className="admin-btn admin-btn--ghost">Cancel</Link>
          <Button type="submit" loading={saving}>{isNew ? 'Create' : 'Save changes'}</Button>
        </div>
      </form>
    </div>
  );
}

function FieldControl({ field, value, error, onChange }) {
  const common = { id: field.name, placeholder: field.placeholder };

  switch (field.type) {
    case 'textarea':
      return (
        <Field label={field.label} hint={field.hint} error={error} required={field.required}>
          <Textarea {...common} rows={field.rows || 4} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case 'richtext':
      return (
        <Field label={field.label} hint={field.hint} error={error} required={field.required}>
          <RichTextEditor value={value ?? ''} onChange={onChange} />
        </Field>
      );
    case 'number':
      return (
        <Field label={field.label} hint={field.hint} error={error} required={field.required}>
          <Input type="number" step={field.step || 'any'} {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
        </Field>
      );
    case 'checkbox':
      return (
        <Field label={field.label} hint={field.hint} error={error}>
          <Toggle checked={value} onChange={onChange} label={field.toggleLabel} />
        </Field>
      );
    case 'select':
      return (
        <Field label={field.label} hint={field.hint} error={error} required={field.required}>
          <Select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
      );
    case 'tags':
      return (
        <Field label={field.label} hint={field.hint || 'Comma-separated'} error={error}>
          <Input
            {...common}
            value={Array.isArray(value) ? value.join(', ') : value ?? ''}
            onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
          />
        </Field>
      );
    case 'image':
      return (
        <Field label={field.label} hint={field.hint} error={error}>
          <ImagePicker value={value} onChange={onChange} />
        </Field>
      );
    default:
      return (
        <Field label={field.label} hint={field.hint} error={error} required={field.required}>
          <Input type="text" {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
  }
}
