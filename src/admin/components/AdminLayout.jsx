import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/pages', label: 'Pages', icon: '📄' },
  { to: '/admin/sections', label: 'Homepage Sections', icon: '🧩' },
  { to: '/admin/menus', label: 'Menus', icon: '🧭' },
  { to: '/admin/dishes', label: 'Dishes', icon: '🥗' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { to: '/admin/faqs', label: 'FAQs', icon: '❓' },
  { to: '/admin/media', label: 'Media', icon: '🖼️' },
  { to: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  { to: '/admin/social', label: 'Social Links', icon: '🔗' },
  { to: '/admin/submissions', label: 'Submissions', icon: '📥' },
  { to: '/admin/profile', label: 'My Profile', icon: '👤' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.info('Signed out');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className={`admin-shell${open ? ' admin-shell--open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src="/logo.png" alt="Fitbite" />
          <span>Admin</span>
        </div>
        <nav className="admin-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="admin-nav-icon" aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">
          ↗ View public site
        </a>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-hamburger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            ☰
          </button>
          <div className="admin-topbar-spacer" />
          <div className="admin-user">
            <span className="admin-user-name">{user?.name}</span>
            <button className="admin-btn admin-btn--ghost admin-btn--sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      {open && <div className="admin-backdrop" onClick={() => setOpen(false)} />}
    </div>
  );
}
