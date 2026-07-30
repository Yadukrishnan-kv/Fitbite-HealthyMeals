import { useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Toggle } from './ui';

/**
 * Toggle a boolean field on a row via PATCH, with optimistic UI.
 * Used for availability / visibility flags directly in list tables.
 */
export default function InlineToggle({ endpoint, id, field, value, label }) {
  const toast = useToast();
  const [checked, setChecked] = useState(value);
  const [busy, setBusy] = useState(false);

  const change = async (next) => {
    setChecked(next);
    setBusy(true);
    try {
      await api.patch(`${endpoint}/${id}`, { [field]: next });
    } catch (e) {
      setChecked(!next);
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return <Toggle checked={checked} onChange={change} label={busy ? '…' : label} />;
}
