import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LuMail, LuLock, LuEye, LuEyeOff, LuTriangleAlert, LuArrowRight } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Field, Button } from '../components/ui';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from || '/admin';

  if (!loading && user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const container = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };
  const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="admin-login">
      <div className="admin-login-shapes" aria-hidden>
        <span className="admin-login-shape s1" />
        <span className="admin-login-shape s2" />
        <span className="admin-login-shape s3" />
      </div>

      <motion.form className="admin-login-card" onSubmit={submit} variants={container} initial="hidden" animate="show">
        <motion.div className="admin-login-brand" variants={item}>
          <motion.div
            className="admin-login-logo"
            initial={{ rotate: -12, scale: 0.7 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
          >
            <img src="/logo.png" alt="Fitbite" />
          </motion.div>
        </motion.div>

        <motion.h1 className="admin-login-title" variants={item}>Welcome back</motion.h1>
        <motion.p className="admin-login-sub" variants={item}>Sign in to your Fitbite admin dashboard</motion.p>

        {error && (
          <motion.div className="admin-alert admin-alert--error" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            <LuTriangleAlert /> {error}
          </motion.div>
        )}

        <motion.div variants={item}>
          <Field label="Email address">
            <div className="admin-input-icon" style={{ maxWidth: 'none', display: 'flex' }}>
              <LuMail />
              <input
                className="admin-input"
                type="email"
                autoComplete="username"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
          </Field>
        </motion.div>

        <motion.div variants={item}>
          <Field label="Password">
            <div className="admin-input-icon" style={{ maxWidth: 'none', display: 'flex' }}>
              <LuLock />
              <input
                className="admin-input"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: 10, background: 'none', border: 'none',
                  cursor: 'pointer', color: 'var(--a-muted)', display: 'grid', placeItems: 'center', fontSize: 17,
                }}
              >
                {showPw ? <LuEyeOff /> : <LuEye />}
              </button>
            </div>
          </Field>
        </motion.div>

        <motion.div className="admin-login-row" variants={item}>
          <label className="admin-toggle" style={{ gap: 8 }}>
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            <span className="admin-toggle-track" style={{ width: 38, height: 22 }}>
              <span className="admin-toggle-thumb" style={{ width: 16, height: 16 }} />
            </span>
            <span className="admin-toggle-label" style={{ fontSize: 13 }}>Remember me</span>
          </label>
          <button
            type="button"
            className="admin-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => toast.info('Please contact your system administrator to reset your password.')}
          >
            Forgot password?
          </button>
        </motion.div>

        <motion.div variants={item}>
          <Button type="submit" size="lg" loading={submitting} className="admin-btn--block" style={{ marginTop: 4 }}>
            Sign in <LuArrowRight />
          </Button>
        </motion.div>

        <motion.p className="admin-login-footer" variants={item}>
          Fitbite CMS · Secure admin access
        </motion.p>
      </motion.form>
    </div>
  );
}
