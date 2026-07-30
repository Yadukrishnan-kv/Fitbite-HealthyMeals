import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Spinner, PageHeader, Badge } from '../components/ui';

const CARDS = [
  { key: 'pages', label: 'Pages', to: '/admin/pages', icon: '📄', get: (c) => `${c.pages.published}/${c.pages.total}`, sub: 'published' },
  { key: 'dishes', label: 'Dishes', to: '/admin/dishes', icon: '🥗', get: (c) => c.dishes },
  { key: 'testimonials', label: 'Testimonials', to: '/admin/testimonials', icon: '💬', get: (c) => c.testimonials },
  { key: 'faqs', label: 'FAQs', to: '/admin/faqs', icon: '❓', get: (c) => c.faqs },
  { key: 'media', label: 'Media', to: '/admin/media', icon: '🖼️', get: (c) => c.media },
  { key: 'menuItems', label: 'Menu Items', to: '/admin/menus', icon: '🧭', get: (c) => c.menuItems },
];

export default function DashboardPage() {
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/overview')
      .then(setData)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <div className="admin-loading"><Spinner /></div>;
  if (!data) return null;

  const { counts, recentSubmissions } = data;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your website content" />

      <div className="admin-stat-grid">
        {CARDS.map((c) => (
          <Link key={c.key} to={c.to} className="admin-stat-card">
            <span className="admin-stat-icon">{c.icon}</span>
            <span className="admin-stat-value">{c.get(counts)}</span>
            <span className="admin-stat-label">{c.label}{c.sub ? ` ${c.sub}` : ''}</span>
          </Link>
        ))}
        <Link to="/admin/submissions" className="admin-stat-card admin-stat-card--accent">
          <span className="admin-stat-icon">📥</span>
          <span className="admin-stat-value">
            {counts.submissions.total}
            {counts.submissions.new > 0 && <Badge tone="green">{counts.submissions.new} new</Badge>}
          </span>
          <span className="admin-stat-label">Submissions</span>
        </Link>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Recent Enquiries</h2>
          <Link to="/admin/submissions" className="admin-link">View all →</Link>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="admin-muted">No submissions yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Message</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentSubmissions.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email || s.phone}</td>
                  <td className="admin-truncate">{s.message}</td>
                  <td><Badge tone={s.status === 'new' ? 'green' : 'gray'}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
