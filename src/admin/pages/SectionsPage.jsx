import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Field, Input, Textarea, Button, Spinner, PageHeader, Badge } from '../components/ui';
import InlineToggle from '../components/InlineToggle';

const ENDPOINT = '/admin/sections';

export function SectionsPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(ENDPOINT);
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    try {
      await api.post(`${ENDPOINT}/reorder`, { ids: next.map((i) => i._id) });
    } catch (e) {
      toast.error(e.message);
      load();
    }
  };

  if (loading) return <div className="admin-loading"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Homepage Sections" subtitle="Reorder, show/hide, and edit the content blocks of the homepage" />
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th className="admin-th-order">Order</th><th>Section</th><th>Title</th><th>Visible</th><th className="admin-th-actions">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((s, i) => (
              <tr key={s._id}>
                <td className="admin-reorder">
                  <button className="admin-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Up">▲</button>
                  <button className="admin-icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Down">▼</button>
                </td>
                <td><strong>{s.name}</strong> <Badge>{s.key}</Badge></td>
                <td className="admin-truncate">{s.title || <span className="admin-muted">—</span>}</td>
                <td><InlineToggle endpoint={ENDPOINT} id={s._id} field="isVisible" value={s.isVisible} /></td>
                <td className="admin-row-actions">
                  <Link to={`/admin/sections/${s._id}`} className="admin-btn admin-btn--ghost admin-btn--sm">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SectionEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [item, setItem] = useState(null);
  const [contentText, setContentText] = useState('{}');
  const [jsonError, setJsonError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`${ENDPOINT}/${id}`)
      .then((data) => {
        setItem(data.item);
        setContentText(JSON.stringify(data.item.content || {}, null, 2));
      })
      .catch((e) => toast.error(e.message));
  }, [id, toast]);

  const set = (name, val) => setItem((s) => ({ ...s, [name]: val }));

  const submit = async (e) => {
    e.preventDefault();
    let content;
    try {
      content = JSON.parse(contentText);
      setJsonError('');
    } catch {
      setJsonError('Content is not valid JSON');
      return;
    }
    setSaving(true);
    try {
      await api.patch(`${ENDPOINT}/${id}`, {
        tag: item.tag,
        title: item.title,
        subtitle: item.subtitle,
        isVisible: item.isVisible,
        content,
      });
      toast.success('Section saved');
      navigate('/admin/sections');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!item) return <div className="admin-loading"><Spinner /></div>;

  return (
    <div>
      <PageHeader title={`Edit Section: ${item.name}`} />
      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-grid">
          <Field label="Tag (small label)"><Input value={item.tag || ''} onChange={(e) => set('tag', e.target.value)} /></Field>
          <Field label="Title"><Input value={item.title || ''} onChange={(e) => set('title', e.target.value)} /></Field>
          <div className="admin-form-full">
            <Field label="Subtitle"><Textarea rows={2} value={item.subtitle || ''} onChange={(e) => set('subtitle', e.target.value)} /></Field>
          </div>
          <div className="admin-form-full">
            <Field
              label="Structured Content (JSON)"
              hint="Advanced: stats, cards, steps, images for this section. Keep the keys intact."
              error={jsonError}
            >
              <Textarea
                className="admin-input admin-textarea admin-code"
                rows={16}
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                spellCheck={false}
              />
            </Field>
          </div>
        </div>
        <div className="admin-form-actions">
          <Link to="/admin/sections" className="admin-btn admin-btn--ghost">Cancel</Link>
          <Button type="submit" loading={saving}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}
