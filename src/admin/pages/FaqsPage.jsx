import ResourceList from '../components/ResourceList';
import ResourceForm from '../components/ResourceForm';
import InlineToggle from '../components/InlineToggle';

const ENDPOINT = '/admin/faqs';
const BACK = '/admin/faqs';

export function FaqsPage() {
  const columns = [
    { key: 'question', header: 'Question', render: (r) => <strong>{r.question}</strong> },
    { key: 'answer', header: 'Answer', render: (r) => <span className="admin-truncate">{r.answer}</span> },
    {
      key: 'isVisible',
      header: 'Visible',
      render: (r) => <InlineToggle endpoint={ENDPOINT} id={r._id} field="isVisible" value={r.isVisible} />,
    },
  ];
  return (
    <ResourceList
      title="FAQs"
      endpoint={ENDPOINT}
      columns={columns}
      editPath={(r) => `/admin/faqs/${r._id}`}
      createPath="/admin/faqs/new"
      createLabel="New FAQ"
      reorderable
      emptyIcon="❓"
    />
  );
}

export function FaqEdit() {
  const fields = [
    { name: 'question', label: 'Question', type: 'text', required: true, full: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true, rows: 6, full: true },
    { name: 'isVisible', label: 'Visibility', type: 'checkbox', toggleLabel: 'Show on site' },
  ];
  return (
    <ResourceForm
      title="FAQ"
      endpoint={ENDPOINT}
      backPath={BACK}
      fields={fields}
      defaults={{ isVisible: true }}
    />
  );
}
