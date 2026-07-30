/** Small shared form/UI primitives for the admin panel. */

export function Field({ label, hint, error, required, children }) {
  return (
    <label className="admin-field">
      {label && (
        <span className="admin-field-label">
          {label} {required && <em className="admin-req">*</em>}
        </span>
      )}
      {children}
      {hint && !error && <span className="admin-field-hint">{hint}</span>}
      {error && <span className="admin-field-error">{error}</span>}
    </label>
  );
}

export function Input(props) {
  return <input className="admin-input" {...props} />;
}

export function Textarea(props) {
  return <textarea className="admin-input admin-textarea" {...props} />;
}

export function Select({ children, ...props }) {
  return (
    <select className="admin-input" {...props}>
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

export function Button({ variant = 'primary', size, loading, children, ...props }) {
  const cls = [
    'admin-btn',
    `admin-btn--${variant}`,
    size ? `admin-btn--${size}` : '',
  ].join(' ');
  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? '…' : children}
    </button>
  );
}

export function Spinner() {
  return <div className="admin-spinner" />;
}

export function EmptyState({ icon = '📭', title, children }) {
  return (
    <div className="admin-empty">
      <div className="admin-empty-icon">{icon}</div>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export function Badge({ tone = 'gray', children }) {
  return <span className={`admin-badge admin-badge--${tone}`}>{children}</span>;
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
