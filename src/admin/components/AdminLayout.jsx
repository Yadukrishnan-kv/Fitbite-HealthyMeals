import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LuLayoutDashboard, LuFileText, LuLayoutPanelTop, LuListTree, LuUtensilsCrossed,
  LuMessageSquareQuote, LuCircleHelp, LuImages, LuSettings, LuShare2, LuInbox,
  LuUser, LuLogOut, LuChevronsLeft, LuSearch, LuSun, LuMoon, LuExternalLink,
  LuChevronRight,
} from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

/** Grouped navigation with Lucide icons for a premium, scannable sidebar. */
const NAV_GROUPS = [
  {
    title: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LuLayoutDashboard, end: true }],
  },
  {
    title: 'Content',
    items: [
      { to: '/admin/pages', label: 'Pages', icon: LuFileText },
      { to: '/admin/sections', label: 'Homepage Sections', icon: LuLayoutPanelTop },
      { to: '/admin/menus', label: 'Menus', icon: LuListTree },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { to: '/admin/dishes', label: 'Dishes', icon: LuUtensilsCrossed },
      { to: '/admin/testimonials', label: 'Testimonials', icon: LuMessageSquareQuote },
      { to: '/admin/faqs', label: 'FAQs', icon: LuCircleHelp },
      { to: '/admin/media', label: 'Media Library', icon: LuImages },
    ],
  },
  {
    title: 'Engagement',
    items: [{ to: '/admin/submissions', label: 'Submissions', icon: LuInbox }],
  },
  {
    title: 'Configuration',
    items: [
      { to: '/admin/settings', label: 'Site Settings', icon: LuSettings },
      { to: '/admin/social', label: 'Social Links', icon: LuShare2 },
      { to: '/admin/profile', label: 'My Profile', icon: LuUser },
    ],
  },
];

/** Friendly title for the current route, used in breadcrumbs. */
const CRUMB_LABELS = {
  pages: 'Pages', sections: 'Homepage Sections', menus: 'Menus', dishes: 'Dishes',
  testimonials: 'Testimonials', faqs: 'FAQs', media: 'Media Library',
  submissions: 'Submissions', settings: 'Site Settings', social: 'Social Links',
  profile: 'My Profile', new: 'New',
};

function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'AD';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop rail
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [now, setNow] = useState(() => new Date());

  // Live clock in the topbar.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  // Close the profile menu on outside click.
  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out');
    navigate('/admin/login', { replace: true });
  };

  const segments = location.pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
  const crumbs = segments.map((seg, i) => ({
    label: CRUMB_LABELS[seg] || (/^[0-9a-f]{8,}$/i.test(seg) ? 'Edit' : seg),
    to: '/admin/' + segments.slice(0, i + 1).join('/'),
  }));

  const shellClass = [
    'admin-shell',
    open ? 'admin-shell--open' : '',
    collapsed ? 'admin-shell--collapsed' : '',
  ].join(' ').trim();

  return (
    <div className={shellClass}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark"><img src="/logo.png" alt="Fitbite" /></div>
          <div className="admin-brand-text">
            <span className="admin-brand-name">Fitbite</span>
            <span className="admin-brand-sub">Admin Panel</span>
          </div>
          <button
            className="admin-collapse-btn"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title="Collapse sidebar"
          >
            <motion.span animate={{ rotate: collapsed ? 180 : 0 }} style={{ display: 'grid' }}>
              <LuChevronsLeft />
            </motion.span>
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="admin-nav-group">
              <span className="admin-nav-group-title">{group.title}</span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
                    title={item.label}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="admin-nav-active"
                            className="admin-nav-indicator"
                            transition={{ type: 'spring', stiffness: 480, damping: 38 }}
                          />
                        )}
                        <span className="admin-nav-icon"><Icon /></span>
                        <span className="admin-nav-label">{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile-card">
            <span className="admin-avatar">{initials(user?.name)}</span>
            <div className="admin-profile-info">
              <span className="admin-profile-name">{user?.name || 'Admin'}</span>
              <span className="admin-profile-email">{user?.email}</span>
            </div>
            <button className="admin-profile-logout" onClick={handleLogout} aria-label="Sign out" title="Sign out">
              <LuLogOut />
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            <LuListTreeMenuIcon />
          </button>

          <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/admin" className="admin-crumb">Home</Link>
            {crumbs.map((c, i) => (
              <span key={c.to} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <LuChevronRight className="admin-crumb-sep" />
                {i === crumbs.length - 1 ? (
                  <span className="admin-crumb admin-crumb--current">{c.label}</span>
                ) : (
                  <Link to={c.to} className="admin-crumb">{c.label}</Link>
                )}
              </span>
            ))}
          </nav>

          <div className="admin-topbar-spacer" />

          <div className="admin-search-box">
            <LuSearch />
            <input placeholder="Search…" aria-label="Search" />
            <kbd>⌘K</kbd>
          </div>

          <span className="admin-topbar-clock">
            {now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>

          <button
            className="admin-icon-action"
            onClick={toggle}
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light' : 'Switch to dark'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'moon' : 'sun'}
                initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'grid' }}
              >
                {isDark ? <LuSun /> : <LuMoon />}
              </motion.span>
            </AnimatePresence>
          </button>

          <a className="admin-icon-action" href="/" target="_blank" rel="noreferrer" aria-label="View public site" title="View public site">
            <LuExternalLink />
          </a>

          <div className="admin-topbar-profile" ref={menuRef}>
            <button className="admin-topbar-user" onClick={() => setMenuOpen((m) => !m)} aria-haspopup="menu" aria-expanded={menuOpen}>
              <span className="admin-avatar">{initials(user?.name)}</span>
              <span className="admin-topbar-user-name">{user?.name || 'Admin'}</span>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="admin-menu"
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                >
                  <div className="admin-menu-head">
                    <div className="n">{user?.name}</div>
                    <div className="e">{user?.email}</div>
                  </div>
                  <Link className="admin-menu-item" to="/admin/profile" role="menuitem" onClick={() => setMenuOpen(false)}>
                    <LuUser /> My Profile
                  </Link>
                  <Link className="admin-menu-item" to="/admin/settings" role="menuitem" onClick={() => setMenuOpen(false)}>
                    <LuSettings /> Site Settings
                  </Link>
                  <a className="admin-menu-item" href="/" target="_blank" rel="noreferrer" role="menuitem">
                    <LuExternalLink /> View public site
                  </a>
                  <button className="admin-menu-item admin-menu-item--danger" onClick={handleLogout} role="menuitem">
                    <LuLogOut /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {open && <div className="admin-backdrop" onClick={() => setOpen(false)} />}
    </div>
  );
}

/** Simple three-line menu glyph (avoids pulling another icon just for mobile). */
function LuListTreeMenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
