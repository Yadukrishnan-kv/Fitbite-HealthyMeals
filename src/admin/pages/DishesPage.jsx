import ResourceList from '../components/ResourceList';
import ResourceForm from '../components/ResourceForm';
import InlineToggle from '../components/InlineToggle';
import { Badge } from '../components/ui';

const ENDPOINT = '/admin/dishes';
const BACK = '/admin/dishes';

export function DishesPage() {
  const columns = [
    {
      key: 'image',
      header: '',
      width: '64px',
      render: (r) => (r.image ? <img className="admin-thumb" src={r.image} alt="" /> : <div className="admin-thumb admin-thumb--empty" />),
    },
    { key: 'name', header: 'Name', render: (r) => <strong>{r.name}</strong> },
    { key: 'price', header: 'Price', render: (r) => `₹${r.price}` },
    {
      key: 'categories',
      header: 'Categories',
      render: (r) => (r.categories || []).map((c) => <Badge key={c}>{c}</Badge>),
    },
    {
      key: 'isAvailable',
      header: 'Available',
      render: (r) => <InlineToggle endpoint={ENDPOINT} id={r._id} field="isAvailable" value={r.isAvailable} />,
    },
  ];

  return (
    <ResourceList
      title="Dishes"
      subtitle="Menu items shown on the site"
      endpoint={ENDPOINT}
      columns={columns}
      editPath={(r) => `/admin/dishes/${r._id}`}
      createPath="/admin/dishes/new"
      createLabel="New Dish"
      reorderable
      emptyIcon="🥗"
    />
  );
}

export function DishEdit() {
  const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true, full: true },
    { name: 'desc', label: 'Description', type: 'textarea', full: true },
    { name: 'price', label: 'Price (₹)', type: 'number', required: true },
    { name: 'categories', label: 'Categories', type: 'tags', hint: 'e.g. high-protein, veg, weight-loss' },
    { name: 'calories', label: 'Calories', type: 'number' },
    { name: 'protein', label: 'Protein', type: 'text', placeholder: '38g' },
    { name: 'carbs', label: 'Carbs', type: 'text', placeholder: '12g' },
    { name: 'rating', label: 'Rating (0–5)', type: 'number', step: '0.1' },
    { name: 'reviews', label: 'Reviews count', type: 'number' },
    { name: 'image', label: 'Image', type: 'image', full: true },
    { name: 'isAvailable', label: 'Availability', type: 'checkbox', toggleLabel: 'Available on site' },
  ];

  return (
    <ResourceForm
      title="Dish"
      endpoint={ENDPOINT}
      backPath={BACK}
      fields={fields}
      defaults={{ isAvailable: true, categories: [], price: 0, rating: 0, reviews: 0, calories: 0 }}
    />
  );
}
