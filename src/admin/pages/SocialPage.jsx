import ResourceList from '../components/ResourceList';
import ResourceForm from '../components/ResourceForm';
import InlineToggle from '../components/InlineToggle';

const ENDPOINT = '/admin/social-links';
const BACK = '/admin/social';

export function SocialPage() {
  const columns = [
    { key: 'platform', header: 'Platform', render: (r) => <strong>{r.platform}</strong> },
    { key: 'url', header: 'URL', render: (r) => <span className="admin-truncate">{r.url}</span> },
    {
      key: 'isEnabled',
      header: 'Enabled',
      render: (r) => <InlineToggle endpoint={ENDPOINT} id={r._id} field="isEnabled" value={r.isEnabled} />,
    },
  ];
  return (
    <ResourceList
      title="Social Links"
      endpoint={ENDPOINT}
      columns={columns}
      editPath={(r) => `/admin/social/${r._id}`}
      createPath="/admin/social/new"
      createLabel="New Link"
      reorderable
      searchable={false}
      emptyIcon="🔗"
    />
  );
}

export function SocialEdit() {
  const fields = [
    {
      name: 'platform',
      label: 'Platform',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select…' },
        { value: 'instagram', label: 'Instagram' },
        { value: 'whatsapp', label: 'WhatsApp' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'x', label: 'X / Twitter' },
        { value: 'linkedin', label: 'LinkedIn' },
      ],
    },
    { name: 'icon', label: 'Icon key', type: 'text', hint: 'e.g. instagram, whatsapp (matches frontend icon set)' },
    { name: 'url', label: 'URL', type: 'text', required: true, full: true, placeholder: 'https://…' },
    { name: 'isEnabled', label: 'Enabled', type: 'checkbox', toggleLabel: 'Show on site' },
  ];
  return (
    <ResourceForm
      title="Social Link"
      endpoint={ENDPOINT}
      backPath={BACK}
      fields={fields}
      defaults={{ isEnabled: true }}
      toApi={(v) => ({ ...v, icon: v.icon || v.platform })}
    />
  );
}
