import { useCallback, useEffect, useState } from 'react';
import { api, qs } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Button, Spinner, EmptyState, PageHeader, Field, Input } from '../components/ui';

export default function MediaPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/media${qs({ q, limit: 100 })}`);
      setItems(data.items || []);
      setTotal(data.total ?? (data.items || []).length);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [q, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setUploading(true);
    try {
      const data = await api.upload('/admin/media', fd);
      toast.success('Uploaded');
      setItems((prev) => [data.item, ...prev]);
      setTotal((t) => t + 1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const saveAlt = async (item, alt) => {
    try {
      const data = await api.patch(`/admin/media/${item._id}`, { alt });
      setItems((prev) => prev.map((m) => (m._id === item._id ? data.item : m)));
      setSelected(data.item);
      toast.success('Saved');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const del = async (item) => {
    const ok = await confirm({
      title: 'Delete this image?',
      message: 'The file will be removed from disk. Images used on the site are protected.',
      danger: true,
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    try {
      await api.del(`/admin/media/${item._id}`);
      removeFromState(item);
      toast.success('Deleted');
    } catch (e) {
      // Server blocks in-use media (409) unless forced — offer an explicit override.
      if (e.status === 409) {
        const force = await confirm({
          title: 'Image is in use',
          message: `${e.message} Delete it anyway?`,
          danger: true,
          confirmLabel: 'Delete anyway',
        });
        if (!force) return;
        try {
          await api.del(`/admin/media/${item._id}?force=true`);
          removeFromState(item);
          toast.success('Deleted');
        } catch (err) {
          toast.error(err.message);
        }
      } else {
        toast.error(e.message);
      }
    }
  };

  const removeFromState = (item) => {
    setItems((prev) => prev.filter((m) => m._id !== item._id));
    setTotal((t) => Math.max(0, t - 1));
    if (selected?._id === item._id) setSelected(null);
  };

  return (
    <div>
      <PageHeader
        title="Media Library"
        subtitle={`${total} file(s)`}
        actions={
          <label className="admin-btn admin-btn--primary">
            {uploading ? 'Uploading…' : '+ Upload image'}
            <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        }
      />

      <div className="admin-toolbar">
        <input
          className="admin-input admin-search"
          placeholder="Search by name or alt text…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="admin-loading"><Spinner /></div>
      ) : items.length === 0 ? (
        <EmptyState icon="🖼️" title="No media yet">
          <label className="admin-btn admin-btn--primary">
            + Upload image
            <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </EmptyState>
      ) : (
        <div className="admin-media-grid" style={{ maxHeight: 'none' }}>
          {items.map((m) => (
            <div key={m._id}>
              <button
                type="button"
                className={`admin-media-tile${selected?._id === m._id ? ' admin-media-tile--selected' : ''}`}
                onClick={() => setSelected(m)}
                title={m.originalName}
              >
                <img src={m.url} alt={m.alt || m.originalName} />
              </button>
              <div className="admin-media-caption admin-truncate">{m.originalName}</div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <MediaDetail
          item={selected}
          onClose={() => setSelected(null)}
          onSaveAlt={saveAlt}
          onDelete={del}
        />
      )}
    </div>
  );
}

function MediaDetail({ item, onClose, onSaveAlt, onDelete }) {
  const [alt, setAlt] = useState(item.alt || '');
  useEffect(() => setAlt(item.alt || ''), [item]);

  const kb = item.sizeBytes ? Math.round(item.sizeBytes / 1024) : null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-modal-header">
          <h3 className="admin-modal-title admin-truncate">{item.originalName}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--a-border)', background: '#eef2ee' }}>
            <img src={item.url} alt={item.alt || item.originalName} style={{ width: '100%', display: 'block' }} />
          </div>
          <div>
            <Field label="Alt text" hint="Describes the image for accessibility & SEO">
              <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Grilled chicken power bowl" />
            </Field>
            <p className="admin-muted" style={{ marginTop: 12 }}>
              URL: <span className="admin-code">{item.url}</span><br />
              {item.mimeType}{kb != null ? ` · ${kb} KB` : ''}
            </p>
          </div>
        </div>

        <div className="admin-modal-actions" style={{ justifyContent: 'space-between' }}>
          <Button variant="danger" onClick={() => onDelete(item)}>Delete</Button>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button onClick={() => onSaveAlt(item, alt)}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
