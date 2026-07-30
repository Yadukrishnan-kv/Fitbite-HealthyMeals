import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, qs } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Button, Spinner, EmptyState, PageHeader } from './ui';

/**
 * Generic list screen: search, pagination, optional up/down reorder, and a
 * standard Edit/Delete action column. `columns` render cells; each render gets
 * (row, { refresh }).
 */
export default function ResourceList({
  title,
  subtitle,
  endpoint,
  columns,
  editPath,
  createPath,
  createLabel = 'New',
  searchable = true,
  reorderable = false,
  deletable = true,
  emptyIcon = '📭',
}) {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const limit = reorderable ? 100 : 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`${endpoint}${qs({ q, page, limit })}`);
      setItems(data.items || []);
      setTotal(data.total ?? (data.items || []).length);
      setPages(data.pages || 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, q, page, limit, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (row) => {
    const ok = await confirm({
      title: 'Delete this item?',
      message: 'This action cannot be undone from the list.',
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.del(`${endpoint}/${row._id}`);
      toast.success('Deleted');
      // Step back a page if we just removed the last row on it.
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const reordered = [...items];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setItems(reordered); // optimistic
    try {
      await api.post(`${endpoint}/reorder`, { ids: reordered.map((i) => i._id) });
    } catch (e) {
      toast.error(e.message);
      load();
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          createPath && (
            <Link to={createPath} className="admin-btn admin-btn--primary">
              + {createLabel}
            </Link>
          )
        }
      />

      {searchable && (
        <div className="admin-toolbar">
          <input
            className="admin-input admin-search"
            placeholder="Search…"
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
          />
          <span className="admin-count">{total} total</span>
        </div>
      )}

      {loading ? (
        <div className="admin-loading"><Spinner /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={emptyIcon} title="Nothing here yet">
          {createPath && (
            <Link to={createPath} className="admin-btn admin-btn--primary">
              + {createLabel}
            </Link>
          )}
        </EmptyState>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {reorderable && <th className="admin-th-order">Order</th>}
                {columns.map((c) => (
                  <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                    {c.header}
                  </th>
                ))}
                <th className="admin-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, i) => (
                <tr key={row._id}>
                  {reorderable && (
                    <td className="admin-reorder">
                      <button className="admin-icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">▲</button>
                      <button className="admin-icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">▼</button>
                    </td>
                  )}
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(row, { refresh: load }) : row[c.key]}</td>
                  ))}
                  <td className="admin-row-actions">
                    {editPath && (
                      <Link to={editPath(row)} className="admin-btn admin-btn--ghost admin-btn--sm">
                        Edit
                      </Link>
                    )}
                    {deletable && (
                      <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>
                        Delete
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!reorderable && pages > 1 && (
        <div className="admin-pagination">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </Button>
          <span className="admin-page-indicator">Page {page} of {pages}</span>
          <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}
