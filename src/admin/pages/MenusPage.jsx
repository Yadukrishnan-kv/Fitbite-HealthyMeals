import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { LuListTree, LuLink, LuArrowRight, LuChevronUp, LuChevronDown } from 'react-icons/lu';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { Button, Spinner, EmptyState, PageHeader, Badge, Field, Input, Select, Toggle } from '../components/ui';

/* ============================ Menus list ============================ */

export function MenusPage() {
  const toast = useToast();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/admin/menus')
      .then((data) => active && setMenus(data.items || []))
      .catch((e) => toast.error(e.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [toast]);

  if (loading) return <div className="admin-loading"><Spinner /></div>;

  return (
    <div>
      <PageHeader title="Menus" subtitle="Manage the header and footer navigation" />
      {menus.length === 0 ? (
        <EmptyState icon="🧭" title="No menus found" />
      ) : (
        <div className="admin-stat-grid">
          {menus.map((m) => (
            <Link key={m._id} to={`/admin/menus/${m._id}`} className="admin-kpi">
              <div className="admin-kpi-top">
                <span className="admin-kpi-icon">{m.location === 'footer' ? <LuLink /> : <LuListTree />}</span>
                <LuArrowRight style={{ color: 'var(--a-muted)' }} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 750, letterSpacing: '-0.01em' }}>{m.name}</div>
              <div className="admin-kpi-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge tone="primary">{m.location}</Badge>
                <span>{m.description}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================ Menu item manager ============================ */

const emptyItem = { label: '', url: '', linkType: 'internal', target: '_self', isEnabled: true };

export function MenuManager() {
  const { id } = useParams();
  const toast = useToast();
  const confirm = useConfirm();

  const [menu, setMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState(null); // { mode, parent, item }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get(`/admin/menus/${id}`);
      setMenu(data.item);
      setItems(data.menuItems || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    load();
  }, [load]);

  // Build a one-level tree: roots (parent === null) each with their children.
  const tree = useMemo(() => {
    const roots = items.filter((i) => !i.parent).sort((a, b) => a.sortOrder - b.sortOrder);
    const childrenOf = (pid) =>
      items.filter((i) => String(i.parent) === String(pid)).sort((a, b) => a.sortOrder - b.sortOrder);
    return roots.map((r) => ({ ...r, children: childrenOf(r._id) }));
  }, [items]);

  const move = async (group, index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= group.length) return;
    const reordered = [...group];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    // Optimistic: reflect new order immediately.
    const orderMap = new Map(reordered.map((it, i) => [String(it._id), i]));
    setItems((prev) =>
      prev.map((it) => (orderMap.has(String(it._id)) ? { ...it, sortOrder: orderMap.get(String(it._id)) } : it))
    );
    try {
      await api.post('/admin/menu-items/reorder', { ids: reordered.map((i) => i._id) });
    } catch (e) {
      toast.error(e.message);
      load();
    }
  };

  const toggleEnabled = async (item) => {
    try {
      const data = await api.patch(`/admin/menu-items/${item._id}`, { isEnabled: !item.isEnabled });
      setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, isEnabled: data.item.isEnabled } : i)));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const del = async (item) => {
    const hasChildren = items.some((i) => String(i.parent) === String(item._id));
    const ok = await confirm({
      title: 'Delete this menu item?',
      message: hasChildren ? 'Its sub-items will be deleted too.' : undefined,
      danger: true,
      confirmLabel: 'Delete',
    });
    if (!ok) return;
    try {
      await api.del(`/admin/menu-items/${item._id}`);
      toast.success('Deleted');
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const saveItem = async (values) => {
    try {
      if (editor.mode === 'create') {
        await api.post('/admin/menu-items', {
          ...values,
          menu: id,
          parent: editor.parent || null,
        });
        toast.success('Item added');
      } else {
        await api.patch(`/admin/menu-items/${editor.item._id}`, values);
        toast.success('Item saved');
      }
      setEditor(null);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="admin-loading"><Spinner /></div>;
  if (!menu) return null;

  return (
    <div>
      <PageHeader
        title={menu.name}
        subtitle={<>Location: <Badge tone="gray">{menu.location}</Badge></>}
        actions={
          <>
            <Link to="/admin/menus" className="admin-btn admin-btn--ghost">← Menus</Link>
            <Button onClick={() => setEditor({ mode: 'create', parent: null, item: emptyItem })}>+ Add item</Button>
          </>
        }
      />

      {tree.length === 0 ? (
        <EmptyState icon="🧭" title="No items yet">
          <Button onClick={() => setEditor({ mode: 'create', parent: null, item: emptyItem })}>+ Add item</Button>
        </EmptyState>
      ) : (
        <div className="admin-panel">
          {tree.map((root, ri) => (
            <div key={root._id}>
              <MenuRow
                item={root}
                onUp={() => move(tree, ri, -1)}
                onDown={() => move(tree, ri, 1)}
                isFirst={ri === 0}
                isLast={ri === tree.length - 1}
                onToggle={() => toggleEnabled(root)}
                onEdit={() => setEditor({ mode: 'edit', item: root })}
                onDelete={() => del(root)}
                onAddChild={() => setEditor({ mode: 'create', parent: root._id, item: emptyItem })}
              />
              {root.children.map((child, ci) => (
                <MenuRow
                  key={child._id}
                  item={child}
                  child
                  isFirst={ci === 0}
                  isLast={ci === root.children.length - 1}
                  onUp={() => move(root.children, ci, -1)}
                  onDown={() => move(root.children, ci, 1)}
                  onToggle={() => toggleEnabled(child)}
                  onEdit={() => setEditor({ mode: 'edit', item: child })}
                  onDelete={() => del(child)}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {editor && (
        <MenuItemEditor
          mode={editor.mode}
          initial={editor.item}
          isChild={editor.mode === 'create' ? !!editor.parent : !!editor.item.parent}
          onCancel={() => setEditor(null)}
          onSave={saveItem}
        />
      )}
    </div>
  );
}

function MenuRow({ item, child, isFirst, isLast, onUp, onDown, onToggle, onEdit, onDelete, onAddChild }) {
  return (
    <div className={`admin-menu-item-row${child ? ' admin-menu-item-row--child' : ''}`}>
      <div className="admin-reorder">
        <button className="admin-icon-btn" disabled={isFirst} onClick={onUp} aria-label="Move up"><LuChevronUp /></button>
        <button className="admin-icon-btn" disabled={isLast} onClick={onDown} aria-label="Move down"><LuChevronDown /></button>
      </div>
      <div className="admin-menu-item-main">
        <div className="admin-menu-item-label">
          {item.label} {!item.isEnabled && <Badge tone="gray">hidden</Badge>}
        </div>
        <div className="admin-menu-item-url">
          <span className="admin-code">{item.url}</span> · {item.linkType}
          {item.target === '_blank' ? ' · new tab' : ''}
        </div>
      </div>
      <Toggle checked={item.isEnabled} onChange={onToggle} />
      {onAddChild && (
        <Button variant="ghost" size="sm" onClick={onAddChild}>+ Sub-item</Button>
      )}
      <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
      <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
    </div>
  );
}

function MenuItemEditor({ mode, initial, isChild, onCancel, onSave }) {
  const [v, setV] = useState({
    label: initial.label || '',
    url: initial.url || '',
    linkType: initial.linkType || 'internal',
    target: initial.target || '_self',
    isEnabled: initial.isEnabled ?? true,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(v);
    setSaving(false);
  };

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <form className="admin-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit} role="dialog" aria-modal="true">
        <h3 className="admin-modal-title">
          {mode === 'create' ? (isChild ? 'New sub-item' : 'New menu item') : 'Edit menu item'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
          <Field label="Label" required>
            <Input value={v.label} onChange={(e) => set('label', e.target.value)} required autoFocus />
          </Field>
          <Field label="URL" required hint="Internal: /dishes · Anchor: #contact · External: https://…">
            <Input value={v.url} onChange={(e) => set('url', e.target.value)} required />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Link type">
              <Select value={v.linkType} onChange={(e) => set('linkType', e.target.value)}>
                <option value="internal">Internal (router)</option>
                <option value="anchor">Anchor (scroll)</option>
                <option value="external">External</option>
              </Select>
            </Field>
            <Field label="Opens in">
              <Select value={v.target} onChange={(e) => set('target', e.target.value)}>
                <option value="_self">Same tab</option>
                <option value="_blank">New tab</option>
              </Select>
            </Field>
          </div>
          <Field label="Enabled">
            <Toggle checked={v.isEnabled} onChange={(val) => set('isEnabled', val)} label="Show on site" />
          </Field>
        </div>

        <div className="admin-modal-actions">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" loading={saving}>{mode === 'create' ? 'Add item' : 'Save'}</Button>
        </div>
      </form>
    </div>
  );
}
