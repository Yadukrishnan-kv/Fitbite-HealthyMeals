import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Button, Spinner } from './ui';

/**
 * Pick an image: paste/enter a URL, choose from the media library, or upload a
 * new file. Stores the resulting URL string via onChange.
 */
export default function ImagePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="admin-imagepicker">
      <div className="admin-imagepicker-row">
        <input
          className="admin-input"
          placeholder="Image URL or pick from library"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
          Library
        </Button>
        {value && (
          <Button type="button" variant="ghost" onClick={() => onChange('')}>
            Clear
          </Button>
        )}
      </div>
      {value && (
        <div className="admin-imagepicker-preview">
          <img src={value} alt="preview" onError={(e) => (e.currentTarget.style.opacity = 0.2)} />
        </div>
      )}
      {open && (
        <MediaLibraryModal
          onClose={() => setOpen(false)}
          onPick={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function MediaLibraryModal({ onClose, onPick }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/media?limit=100');
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

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
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Media Library</h3>
          <label className="admin-btn admin-btn--primary admin-btn--sm">
            {uploading ? 'Uploading…' : '+ Upload'}
            <input type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
        {loading ? (
          <div className="admin-loading"><Spinner /></div>
        ) : items.length === 0 ? (
          <p className="admin-modal-body">No media yet. Upload an image to get started.</p>
        ) : (
          <div className="admin-media-grid">
            {items.map((m) => (
              <button key={m._id} type="button" className="admin-media-tile" onClick={() => onPick(m.url)} title={m.originalName}>
                <img src={m.url} alt={m.alt || m.originalName} />
              </button>
            ))}
          </div>
        )}
        <div className="admin-modal-actions">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
