/** Shared form/UI primitives for the admin panel. */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LuCircleAlert } from 'react-icons/lu';

export function Field({ label, hint, error, required, counter, children }) {
  return (
    <label className="admin-field">
      {label && (
        <span className="admin-field-label">
          {label} {required && <em className="admin-req">*</em>}
          {counter != null && <span className="admin-field-counter">{counter}</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="admin-field-hint">{hint}</span>}
      {error && (
        <span className="admin-field-error"><LuCircleAlert size={13} /> {error}</span>
      )}
    </label>
  );
}

export function Input({ error, className = '', ...props }) {
  return <input className={`admin-input${error ? ' admin-input--error' : ''} ${className}`.trim()} {...props} />;
}

export function Textarea({ error, className = '', ...props }) {
  return <textarea className={`admin-input admin-textarea${error ? ' admin-input--error' : ''} ${className}`.trim()} {...props} />;
}

export function Select({ children, error, className = '', ...props }) {
  return (
    <select className={`admin-input${error ? ' admin-input--error' : ''} ${className}`.trim()} {...props}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-toggle-track"><span className="admin-toggle-thumb" /></span>
      {label && <span className="admin-toggle-label">{label}</span>}
    </label>
  );
}

export function Button({ variant = 'primary', size, loading, className = '', children, disabled, ...props }) {
  const cls = [
    'admin-btn',
    `admin-btn--${variant}`,
    size ? `admin-btn--${size}` : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <motion.button
      className={cls}
      disabled={loading || disabled}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.12 }}
      {...props}
    >
      {loading && <span className="admin-btn-spinner" aria-hidden />}
      {children}
    </motion.button>
  );
}

export function Spinner() {
  return <div className="admin-spinner" />;
}

export function EmptyState({ icon = '📭', title, children }) {
  return (
    <motion.div
      className="admin-empty"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="admin-empty-icon">{icon}</div>
      {title && <h3>{title}</h3>}
      {children}
    </motion.div>
  );
}

export function Badge({ tone = 'gray', dot, children }) {
  return <span className={`admin-badge admin-badge--${tone}${dot ? ' admin-badge--dot' : ''}`}>{children}</span>;
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="admin-page-actions">{actions}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------- Skeletons */

export function Skeleton({ w, h = 12, radius, className = '', style }) {
  return (
    <span
      className={`admin-skeleton ${className}`.trim()}
      style={{ display: 'block', width: w, height: h, borderRadius: radius, ...style }}
    />
  );
}

/** Table-shaped loading placeholder. */
export function SkeletonTable({ rows = 6, cols = 4 }) {
  return (
    <div className="admin-skeleton-rows">
      {Array.from({ length: rows }).map((_, r) => (
        <div className="admin-skeleton-row" key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} h={12} style={{ flex: c === 0 ? 2 : 1, maxWidth: c === 0 ? 200 : 120 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------ Animated primitives */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Count up from 0 → value on mount. Purely visual; renders the final value immediately if reduced-motion. */
export function CountUp({ value = 0, duration = 900, decimals = 0 }) {
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(prefersReducedMotion() ? target : 0);
  const ref = useRef();

  useEffect(() => {
    if (prefersReducedMotion()) { setDisplay(target); return; }
    let raf;
    const start = performance.now();
    const from = 0;
    const tick = (nowTs) => {
      const t = Math.min(1, (nowTs - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    ref.current = raf;
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{display.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}</>;
}

/** Lightweight inline sparkline built from a numeric series. */
export function Sparkline({ data = [], stroke = 'var(--a-primary)', fill = 'rgba(99,102,241,0.14)', width = 120, height = 34 }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / (data.length - 1 || 1);
  const pts = data.map((d, i) => [i * step, height - ((d - min) / range) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={area} fill={fill} stroke="none" />
      <motion.path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </svg>
  );
}

/** Star rating (supports halves). */
export function Stars({ value = 0, size = 14 }) {
  const full = Math.round(value);
  return (
    <span className="admin-stars" style={{ fontSize: size }} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= full ? '' : 'off'}>★</span>
      ))}
    </span>
  );
}
