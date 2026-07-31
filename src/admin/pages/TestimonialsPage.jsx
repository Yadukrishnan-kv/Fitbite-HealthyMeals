import ResourceList from '../components/ResourceList';
import ResourceForm from '../components/ResourceForm';
import InlineToggle from '../components/InlineToggle';
import { Stars, Badge } from '../components/ui';

const ENDPOINT = '/admin/testimonials';
const BACK = '/admin/testimonials';

function tinitials(name = '') {
  const p = name.trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() || '★';
}

export function TestimonialsPage() {
  const columns = [
    {
      key: 'name',
      header: 'Customer',
      render: (r) => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 11 }}>
          <span className="admin-avatar" style={{ boxShadow: 'none' }}>{r.initials || tinitials(r.name)}</span>
          <span>
            <strong style={{ display: 'block' }}>{r.name}</strong>
            {r.tag && <span className="admin-muted" style={{ fontSize: 12 }}>{r.tag}</span>}
          </span>
        </span>
      ),
    },
    { key: 'rating', header: 'Rating', render: (r) => (r.rating ? <Stars value={r.rating} /> : <Badge tone="gray">—</Badge>) },
    { key: 'text', header: 'Review', render: (r) => <span className="admin-truncate">{r.text}</span> },
    {
      key: 'isVisible',
      header: 'Visible',
      render: (r) => <InlineToggle endpoint={ENDPOINT} id={r._id} field="isVisible" value={r.isVisible} />,
    },
  ];

  return (
    <ResourceList
      title="Testimonials"
      endpoint={ENDPOINT}
      columns={columns}
      editPath={(r) => `/admin/testimonials/${r._id}`}
      createPath="/admin/testimonials/new"
      createLabel="New Testimonial"
      reorderable
      emptyIcon="💬"
    />
  );
}

export function TestimonialEdit() {
  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'tag', label: 'Tag', type: 'text', placeholder: 'Regular Customer' },
    { name: 'initials', label: 'Initials', type: 'text', placeholder: 'VT' },
    { name: 'rating', label: 'Rating (0–5)', type: 'number', step: '0.1' },
    { name: 'text', label: 'Testimonial', type: 'textarea', required: true, full: true },
    { name: 'isVisible', label: 'Visibility', type: 'checkbox', toggleLabel: 'Show on site' },
  ];
  return (
    <ResourceForm
      title="Testimonial"
      endpoint={ENDPOINT}
      backPath={BACK}
      fields={fields}
      defaults={{ isVisible: true, rating: 5 }}
    />
  );
}
