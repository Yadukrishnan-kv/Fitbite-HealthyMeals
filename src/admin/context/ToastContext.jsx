import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleCheck, LuTriangleAlert, LuInfo } from 'react-icons/lu';

const ToastContext = createContext(null);

const TOAST_ICON = { success: LuCircleCheck, error: LuTriangleAlert, info: LuInfo };

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'success', timeout = 4000) => {
      const id = ++idSeq;
      setToasts((t) => [...t, { id, message, type }]);
      if (timeout) setTimeout(() => remove(id), timeout);
      return id;
    },
    [remove]
  );

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error', 6000),
    info: (m) => push(m, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="admin-toasts" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = TOAST_ICON[t.type] || LuInfo;
            return (
              <motion.div
                key={t.id}
                layout
                className={`admin-toast admin-toast--${t.type}`}
                onClick={() => remove(t.id)}
                initial={{ opacity: 0, x: 40, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              >
                <span className="admin-toast-icon"><Icon /></span>
                <span>{t.message}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
