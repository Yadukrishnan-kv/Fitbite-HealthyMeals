import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Field, Input, Button, PageHeader } from '../components/ui';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [savingPw, setSavingPw] = useState(false);

  const mapErrors = (err, setter) => {
    if (err.details) {
      const m = {};
      err.details.forEach((d) => (m[d.field] = d.message));
      setter(m);
      toast.error('Please fix the highlighted fields');
    } else {
      toast.error(err.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileErrors({});
    try {
      const data = await api.patch('/auth/profile', { name: profile.name, email: profile.email });
      setUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      mapErrors(err, setProfileErrors);
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwErrors({});
    if (pw.newPassword !== pw.confirmPassword) {
      setPwErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    setSavingPw(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: pw.currentPassword,
        newPassword: pw.newPassword,
      });
      toast.success('Password changed');
      setPw({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      mapErrors(err, setPwErrors);
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Update your account details and password" />

      <form className="admin-form" onSubmit={saveProfile}>
        <h2 style={{ margin: '0 0 16px', fontSize: 17 }}>Account</h2>
        <div className="admin-form-grid">
          <Field label="Name" required error={profileErrors.name}>
            <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} required />
          </Field>
          <Field label="Email" required error={profileErrors.email}>
            <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} required />
          </Field>
        </div>
        <div className="admin-form-actions">
          <Button type="submit" loading={savingProfile}>Save profile</Button>
        </div>
      </form>

      <form className="admin-form" style={{ marginTop: 24 }} onSubmit={changePassword}>
        <h2 style={{ margin: '0 0 16px', fontSize: 17 }}>Change Password</h2>
        <div className="admin-form-grid">
          <Field label="Current password" required error={pwErrors.currentPassword}>
            <Input
              type="password"
              autoComplete="current-password"
              value={pw.currentPassword}
              onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
              required
            />
          </Field>
          <div />
          <Field label="New password" required hint="At least 8 characters" error={pwErrors.newPassword}>
            <Input
              type="password"
              autoComplete="new-password"
              value={pw.newPassword}
              onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
              required
            />
          </Field>
          <Field label="Confirm new password" required error={pwErrors.confirmPassword}>
            <Input
              type="password"
              autoComplete="new-password"
              value={pw.confirmPassword}
              onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
              required
            />
          </Field>
        </div>
        <div className="admin-form-actions">
          <Button type="submit" loading={savingPw}>Change password</Button>
        </div>
      </form>
    </div>
  );
}
