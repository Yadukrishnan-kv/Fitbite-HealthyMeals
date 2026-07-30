import { Routes, Route, Navigate } from 'react-router-dom';
import './admin.css';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ConfirmProvider } from './context/ConfirmContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { PagesPage } from './pages/PagesPage';
import PageEdit from './pages/PageEdit';
import { SectionsPage, SectionEdit } from './pages/SectionsPage';
import { MenusPage, MenuManager } from './pages/MenusPage';
import { DishesPage, DishEdit } from './pages/DishesPage';
import { TestimonialsPage, TestimonialEdit } from './pages/TestimonialsPage';
import { FaqsPage, FaqEdit } from './pages/FaqsPage';
import { SocialPage, SocialEdit } from './pages/SocialPage';
import MediaPage from './pages/MediaPage';
import SettingsPage from './pages/SettingsPage';
import { SubmissionsPage, SubmissionView } from './pages/SubmissionsPage';
import ProfilePage from './pages/ProfilePage';

/**
 * The entire admin panel, mounted by the public app at `/admin/*`. It owns its
 * own providers (auth, toasts, confirm dialogs) and stylesheet so nothing leaks
 * into the public site. Route paths are relative to `/admin`.
 */
export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />

              <Route path="pages" element={<PagesPage />} />
              <Route path="pages/new" element={<PageEdit />} />
              <Route path="pages/:id" element={<PageEdit />} />

              <Route path="sections" element={<SectionsPage />} />
              <Route path="sections/:id" element={<SectionEdit />} />

              <Route path="menus" element={<MenusPage />} />
              <Route path="menus/:id" element={<MenuManager />} />

              <Route path="dishes" element={<DishesPage />} />
              <Route path="dishes/new" element={<DishEdit />} />
              <Route path="dishes/:id" element={<DishEdit />} />

              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="testimonials/new" element={<TestimonialEdit />} />
              <Route path="testimonials/:id" element={<TestimonialEdit />} />

              <Route path="faqs" element={<FaqsPage />} />
              <Route path="faqs/new" element={<FaqEdit />} />
              <Route path="faqs/:id" element={<FaqEdit />} />

              <Route path="social" element={<SocialPage />} />
              <Route path="social/new" element={<SocialEdit />} />
              <Route path="social/:id" element={<SocialEdit />} />

              <Route path="media" element={<MediaPage />} />
              <Route path="settings" element={<SettingsPage />} />

              <Route path="submissions" element={<SubmissionsPage />} />
              <Route path="submissions/:id" element={<SubmissionView />} />

              <Route path="profile" element={<ProfilePage />} />
            </Route>

            {/* Unknown admin path → dashboard (or login if unauthenticated). */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
