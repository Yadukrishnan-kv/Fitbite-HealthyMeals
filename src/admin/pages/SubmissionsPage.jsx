import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LuSearch, LuFilter } from 'react-icons/lu';
import { api, qs } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Button, Spinner, EmptyState, PageHeader, Badge, Field, Input, SkeletonTable } from '../components/ui';

const STATUS_TONE = { new: 'green', read: 'gray', archived: 'amber' };
const STATUSES = ['', 'new', 'read', 'archived'];

export function SubmissionsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/submissions${qs({ q, status, page, limit: 20 })}`);
      setItems(data.items || []);
      setTotal(data.total ?? 0);
      setPages(data.pages || 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [q, status, page, toast]);

  useEffect(() => {
    load();
  }, [load]);

  const del = async (row) => {
    const ok = await confirm({ title: 'Delete this submission?', danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    try {
      await api.del(`/admin/submissions/${row._id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <PageHeader title="Form Submissions" subtitle={`${total} total`} />

      <div className="admin-toolbar">
        <div className="admin-input-icon">
          <LuSearch />
          <input
            className="admin-input admin-search"
            placeholder="Search name, email, message…"
            value={q}
            onChange={(e) => { setPage(1); setQ(e.target.value); }}
          />
        </div>
        <div className="admin-input-icon" style={{ maxWidth: 190, flex: 'none' }}>
          <LuFilter />
          <select
            className="admin-input"
            value={status}
            onChange={(e) => { setPage(1); setStatus(e.target.value); }}
          >
            {STATUSES.map((s) => (
              <option key={s || 'all'} value={s}>{s ? s[0].toUpperCase() + s.slice(1) : 'All statuses'}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} cols={5} />
      ) : items.length === 0 ? (
        <EmptyState icon="📥" title="No submissions found" />
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Message</th><th>Received</th><th>Status</th><th className="admin-th-actions">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email || s.phone || '—'}</td>
                  <td className="admin-truncate">{s.message}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td><Badge tone={STATUS_TONE[s.status] || 'gray'}>{s.status}</Badge></td>
                  <td className="admin-row-actions">
                    <Link to={`/admin/submissions/${s._id}`} className="admin-btn admin-btn--ghost admin-btn--sm">View</Link>
                    <Button variant="danger" size="sm" onClick={() => del(s)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="admin-pagination">
          <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Prev</Button>
          <span className="admin-page-indicator">Page {page} of {pages}</span>
          <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Next →</Button>
        </div>
      )}
    </div>
  );
}

export function SubmissionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get(`/admin/submissions/${id}`)
      .then((data) => active && setItem(data.item))
      .catch((e) => toast.error(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id, toast]);

  const setStatus = async (status) => {
    try {
      const data = await api.patch(`/admin/submissions/${id}`, { status });
      setItem(data.item);
      toast.success(`Marked ${status}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const del = async () => {
    const ok = await confirm({ title: 'Delete this submission?', danger: true, confirmLabel: 'Delete' });
    if (!ok) return;
    try {
      await api.del(`/admin/submissions/${id}`);
      toast.success('Deleted');
      navigate('/admin/submissions');
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="admin-loading"><Spinner /></div>;
  if (!item) return null;

  return (
    <div>
      <PageHeader
        title="Submission"
        subtitle={new Date(item.createdAt).toLocaleString()}
        actions={<Link to="/admin/submissions" className="admin-btn admin-btn--ghost">← Back</Link>}
      />

      <div className="admin-form">
        <div className="admin-form-grid">
          <Field label="Name"><Input value={item.name} readOnly /></Field>
          <Field label="Status"><Input value={item.status} readOnly /></Field>
          <Field label="Email"><Input value={item.email || '—'} readOnly /></Field>
          <Field label="Phone"><Input value={item.phone || '—'} readOnly /></Field>
        </div>
        <div style={{ marginTop: 16 }}>
          <Field label="Message">
            <div className="admin-input" style={{ minHeight: 100, whiteSpace: 'pre-wrap', background: '#f8faf8' }}>
              {item.message}
            </div>
          </Field>
        </div>
        {(item.ip || item.userAgent) && (
          <p className="admin-muted" style={{ marginTop: 12 }}>
            {item.ip && <>IP: <span className="admin-code">{item.ip}</span> </>}
            {item.userAgent && <>· UA: <span className="admin-code">{item.userAgent}</span></>}
          </p>
        )}

        <div className="admin-form-actions" style={{ justifyContent: 'space-between' }}>
          <Button variant="danger" onClick={del}>Delete</Button>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" onClick={() => setStatus('read')} disabled={item.status === 'read'}>Mark read</Button>
            <Button variant="ghost" onClick={() => setStatus('archived')} disabled={item.status === 'archived'}>Archive</Button>
            <Button onClick={() => setStatus('new')} disabled={item.status === 'new'}>Mark new</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
