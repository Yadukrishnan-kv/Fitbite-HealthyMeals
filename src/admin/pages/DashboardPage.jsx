import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LuFileText, LuUtensilsCrossed, LuMessageSquareQuote, LuCircleHelp, LuImages,
  LuListTree, LuInbox, LuPlus, LuUpload, LuSettings, LuArrowRight,
  LuActivity, LuServer, LuDatabase, LuShieldCheck, LuHardDrive, LuSparkles,
} from 'react-icons/lu';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge, CountUp, Sparkline, Skeleton } from '../components/ui';

/* Deterministic little activity curve so each sparkline looks distinct without
   inventing analytics — it's ambient decoration, not a data claim. */
function sparkSeries(seed, n = 12) {
  return Array.from({ length: n }, (_, i) =>
    50 + Math.sin(i * 0.7 + seed) * 22 + Math.sin(i * 0.29 + seed * 2) * 12 + i * 1.5
  );
}

const SEGMENT_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#0ea5e9', '#f43f5e'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
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

  if (loading) return <DashboardSkeleton />;
  if (!data) return null;

  const { counts, recentSubmissions } = data;

  const publishedPct = counts.pages.total ? Math.round((counts.pages.published / counts.pages.total) * 100) : 0;

  const kpis = [
    {
      key: 'pages', label: 'Total Pages', to: '/admin/pages', icon: LuFileText, tone: 'primary',
      value: counts.pages.total, sub: `${counts.pages.published} published`,
      chip: `${publishedPct}% live`,
    },
    { key: 'dishes', label: 'Dishes', to: '/admin/dishes', icon: LuUtensilsCrossed, tone: 'success', value: counts.dishes, sub: 'on the menu' },
    { key: 'testimonials', label: 'Testimonials', to: '/admin/testimonials', icon: LuMessageSquareQuote, tone: 'info', value: counts.testimonials, sub: 'customer reviews' },
    { key: 'faqs', label: 'FAQs', to: '/admin/faqs', icon: LuCircleHelp, tone: 'warning', value: counts.faqs, sub: 'answers published' },
    { key: 'media', label: 'Media Files', to: '/admin/media', icon: LuImages, tone: 'primary', value: counts.media, sub: 'in the library' },
    { key: 'menu', label: 'Menu Items', to: '/admin/menus', icon: LuListTree, tone: 'info', value: counts.menuItems, sub: 'navigation links' },
    {
      key: 'sub', label: 'Submissions', to: '/admin/submissions', icon: LuInbox, tone: counts.submissions.new > 0 ? 'danger' : 'success',
      value: counts.submissions.total, sub: 'total enquiries', chip: counts.submissions.new > 0 ? `${counts.submissions.new} new` : null,
    },
  ];

  const distribution = [
    { label: 'Dishes', value: counts.dishes },
    { label: 'Testimonials', value: counts.testimonials },
    { label: 'FAQs', value: counts.faqs },
    { label: 'Media', value: counts.media },
    { label: 'Menu Items', value: counts.menuItems },
    { label: 'Pages', value: counts.pages.total },
  ];
  const distTotal = distribution.reduce((s, d) => s + d.value, 0);

  const quickActions = [
    { to: '/admin/pages/new', label: 'New Page', icon: LuFileText },
    { to: '/admin/dishes/new', label: 'New Dish', icon: LuUtensilsCrossed },
    { to: '/admin/testimonials/new', label: 'Testimonial', icon: LuMessageSquareQuote },
    { to: '/admin/media', label: 'Upload Media', icon: LuUpload },
    { to: '/admin/faqs/new', label: 'New FAQ', icon: LuCircleHelp },
    { to: '/admin/settings', label: 'Settings', icon: LuSettings },
  ];

  return (
    <div>
      {/* Welcome hero */}
      <motion.div
        className="admin-welcome"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="admin-welcome-eyebrow">{greeting()}</div>
        <h1>{user?.name ? user.name.split(' ')[0] : 'Welcome'} 👋</h1>
        <p>Here's what's happening across your Fitbite website today. Manage content, review enquiries, and keep everything fresh.</p>
        <div className="admin-welcome-actions">
          <Link to="/admin/pages/new" className="admin-btn admin-btn--light"><LuPlus /> Create Page</Link>
          <Link to="/admin/submissions" className="admin-btn admin-btn--ghost"><LuInbox /> View Submissions</Link>
        </div>
      </motion.div>

      {/* KPI grid */}
      <motion.div
        className="admin-stat-grid"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
      >
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.key}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <Link to={k.to} className="admin-kpi">
                <div className="admin-kpi-top">
                  <span className={`admin-kpi-icon admin-kpi-icon--${k.tone}`}><Icon /></span>
                  {k.chip && (
                    <span className={`admin-kpi-trend ${k.tone === 'danger' ? 'admin-kpi-trend--down' : 'admin-kpi-trend--up'}`}>
                      {k.chip}
                    </span>
                  )}
                </div>
                <div className="admin-kpi-value"><CountUp value={k.value} /></div>
                <div className="admin-kpi-label">{k.label} · {k.sub}</div>
                <div className="admin-kpi-spark">
                  <Sparkline
                    data={sparkSeries(i + 1)}
                    stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    fill="transparent"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Analytics row */}
      <div className="admin-grid-2">
        <div className="admin-panel" style={{ marginTop: 0 }}>
          <div className="admin-panel-header">
            <div className="admin-panel-title-row">
              <span className="admin-panel-icon"><LuActivity /></span>
              <h2>Content Distribution</h2>
            </div>
            <Badge tone="primary">{distTotal} items</Badge>
          </div>

          <div className="admin-donut-wrap">
            <Donut segments={distribution} total={distTotal} />
            <div className="admin-chart-legend" style={{ flex: 1, minWidth: 200 }}>
              {distribution.map((d, i) => (
                <div className="admin-legend-row" key={d.label}>
                  <span className="admin-legend-dot" style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }} />
                  <span className="admin-legend-label">{d.label}</span>
                  <span className="admin-legend-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="admin-section-divider" />

          <div className="admin-bars">
            {distribution.map((d, i) => (
              <div className="admin-bar-row" key={d.label}>
                <span className="admin-bar-label">{d.label}</span>
                <span className="admin-bar-track">
                  <motion.span
                    className="admin-bar-fill"
                    style={{ background: SEGMENT_COLORS[i % SEGMENT_COLORS.length] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${distTotal ? (d.value / Math.max(...distribution.map((x) => x.value), 1)) * 100 : 0}%` }}
                    transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
                  />
                </span>
                <span className="admin-bar-val">{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Quick actions */}
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <div className="admin-panel-header"><h2>Quick Actions</h2></div>
            <div className="admin-quick-grid">
              {quickActions.map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.label} to={a.to} className="admin-quick">
                    <span className="admin-quick-icon"><Icon /></span>
                    <span className="admin-quick-label">{a.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* System status */}
          <div className="admin-panel" style={{ marginTop: 0 }}>
            <div className="admin-panel-header"><h2>System Status</h2></div>
            <div className="admin-status-row">
              <span className="admin-status-dot admin-status-dot--ok" />
              <LuServer size={16} style={{ color: 'var(--a-muted)' }} /> API Service
              <span className="admin-status-val">Operational</span>
            </div>
            <div className="admin-status-row">
              <span className="admin-status-dot admin-status-dot--ok" />
              <LuDatabase size={16} style={{ color: 'var(--a-muted)' }} /> Database
              <span className="admin-status-val">Connected</span>
            </div>
            <div className="admin-status-row">
              <span className="admin-status-dot admin-status-dot--ok" />
              <LuShieldCheck size={16} style={{ color: 'var(--a-muted)' }} /> Secure Session
              <span className="admin-status-val">Active</span>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="admin-flex-between" style={{ fontSize: 13, marginBottom: 8 }}>
                <span className="admin-flex" style={{ gap: 7, color: 'var(--a-text-2)' }}><LuHardDrive size={15} /> Media Library</span>
                <span style={{ fontWeight: 700 }}>{counts.media} files</span>
              </div>
              <div className="admin-progress">
                <motion.div
                  className="admin-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, counts.media * 4)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent enquiries */}
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div className="admin-panel-title-row">
            <span className="admin-panel-icon"><LuInbox /></span>
            <h2>Recent Enquiries</h2>
          </div>
          <Link to="/admin/submissions" className="admin-link">View all <LuArrowRight size={15} /></Link>
        </div>

        {recentSubmissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '28px 0', color: 'var(--a-muted)' }}>
            <LuSparkles size={26} style={{ opacity: 0.6 }} />
            <p className="admin-muted" style={{ marginTop: 8 }}>No submissions yet — you're all caught up.</p>
          </div>
        ) : (
          <div className="admin-timeline">
            {recentSubmissions.map((s) => (
              <div className="admin-tl-item" key={s._id}>
                <span className="admin-tl-dot"><LuInbox size={15} /></span>
                <div className="admin-tl-body" style={{ flex: 1 }}>
                  <div className="admin-flex-between">
                    <span className="admin-tl-title">
                      {s.name} <span style={{ fontWeight: 400, color: 'var(--a-muted)' }}>sent an enquiry</span>
                    </span>
                    <Badge tone={s.status === 'new' ? 'green' : s.status === 'archived' ? 'amber' : 'gray'}>{s.status}</Badge>
                  </div>
                  <div className="admin-tl-meta">
                    {(s.email || s.phone || '—')} · {timeAgo(s.createdAt)}
                    {s.message ? ` · “${s.message.slice(0, 60)}${s.message.length > 60 ? '…' : ''}”` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** SVG donut chart from segment values. */
function Donut({ segments, total }) {
  const size = 156;
  const stroke = 20;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="admin-donut">
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--a-surface-3)" strokeWidth={stroke} />
        {total > 0 && segments.map((s, i) => {
          const frac = s.value / total;
          const dash = frac * c;
          const el = (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
              strokeWidth={stroke}
              strokeLinecap="butt"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="admin-donut-center">
        <span className="v"><CountUp value={total} /></span>
        <span className="l">Items</span>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <Skeleton h={128} radius={18} style={{ marginBottom: 22 }} />
      <div className="admin-stat-grid">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="admin-skeleton--kpi" h={128} radius={18} />
        ))}
      </div>
      <div className="admin-grid-2">
        <Skeleton h={360} radius={18} style={{ marginTop: 0 }} />
        <Skeleton h={360} radius={18} style={{ marginTop: 0 }} />
      </div>
    </div>
  );
}
