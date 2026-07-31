import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LuSearch, LuExternalLink } from 'react-icons/lu';
import { api, qs } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Button, Badge, PageHeader, EmptyState, SkeletonTable } from '../components/ui';

const ENDPOINT = '/admin/pages';

export function PagesPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`${ENDPOINT}${qs({ q, limit: 100 })}`);
      setItems(data.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [q, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const togglePublish = async (row) => {
    try {
      await api.post(`${ENDPOINT}/${row._id}/${row.status === 'published' ? 'unpublish' : 'publish'}`);
      toast.success(row.status === 'published' ? 'Unpublished' : 'Published');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (row) => {
    const ok = await confirm({
      title: `Delete "${row.title}"?`,
      message: 'This will remove the page from the site.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.del(`${ENDPOINT}/${row._id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader
        title="Pages"
        subtitle="Website pages and their SEO settings"
        actions={<Link to="/admin/pages/new" className="admin-btn admin-btn--primary">+ New Page</Link>}
      />

      <div className="admin-toolbar">
        <div className="admin-input-icon">
          <LuSearch />
          <input className="admin-input admin-search" placeholder="Search pages…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={5} cols={4} />
      ) : items.length === 0 ? (
        <EmptyState icon="📄" title="No pages found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Slug</th><th>Status</th><th className="admin-th-actions">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p._id}>
                  <td>
                    <strong>{p.title}</strong>{' '}
                    {p.isSystem && <Badge tone="blue">system</Badge>}
                  </td>
                  <td><code className="admin-code">/{p.slug}</code></td>
                  <td><Badge tone={p.status === 'published' ? 'green' : 'gray'} dot>{p.status}</Badge></td>
                  <td className="admin-row-actions">
                    <a
                      className="admin-btn admin-btn--ghost admin-btn--sm"
                      href={p.slug === 'home' ? '/' : `/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <LuExternalLink /> Preview
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(p)}>
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Link to={`/admin/pages/${p._id}`} className="admin-btn admin-btn--ghost admin-btn--sm">Edit</Link>
                    {!p.isSystem && (
                      <Button variant="danger" size="sm" onClick={() => remove(p)}>Delete</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
