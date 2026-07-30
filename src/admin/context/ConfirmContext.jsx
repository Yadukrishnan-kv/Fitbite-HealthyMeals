import { createContext, useContext, useState, useCallback, useRef } from 'react';

const ConfirmContext = createContext(null);

/**
 * Promise-based confirmation dialog for destructive actions.
 *   const confirm = useConfirm();
 *   if (await confirm({ title: 'Delete?', message: '...', danger: true })) { ... }
 */
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);
  const resolver = useRef(null);

  const confirm = useCallback((opts) => {
    setState({
      title: opts.title || 'Are you sure?',
      message: opts.message || '',
      confirmLabel: opts.confirmLabel || 'Confirm',
      cancelLabel: opts.cancelLabel || 'Cancel',
      danger: opts.danger || false,
    });
    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const close = (result) => {
    setState(null);
    if (resolver.current) resolver.current(result);
    resolver.current = null;
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {state && (
        <div className="admin-modal-overlay" onClick={() => close(false)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h3 className="admin-modal-title">{state.title}</h3>
            {state.message && <p className="admin-modal-body">{state.message}</p>}
            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn--ghost" onClick={() => close(false)}>
                {state.cancelLabel}
              </button>
              <button
                className={`admin-btn ${state.danger ? 'admin-btn--danger' : 'admin-btn--primary'}`}
                onClick={() => close(true)}
                autoFocus
              >
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
}
