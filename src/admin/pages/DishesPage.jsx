import ResourceList from '../components/ResourceList';
import ResourceForm from '../components/ResourceForm';
import InlineToggle from '../components/InlineToggle';
import { Badge, Stars } from '../components/ui';

const ENDPOINT = '/admin/dishes';
const BACK = '/admin/dishes';

export function DishesPage() {
  const columns = [
    {
      key: 'image',
      header: '',
      width: '72px',
      render: (r) =>
        r.image ? (
          <img className="admin-thumb" src={r.image} alt="" style={{ width: 56, height: 56, borderRadius: 12 }} />
        ) : (
          <div className="admin-thumb admin-thumb--empty" style={{ width: 56, height: 56, borderRadius: 12 }}>🥗</div>
        ),
    },
    {
      key: 'name',
      header: 'Dish',
      render: (r) => (
        <div>
          <strong style={{ fontSize: 14 }}>{r.name}</strong>
          {(r.calories || r.protein) && (
            <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {r.calories ? <Badge tone="gray">{r.calories} kcal</Badge> : null}
              {r.protein ? <Badge tone="green">{r.protein} protein</Badge> : null}
              {r.carbs ? <Badge tone="amber">{r.carbs} carbs</Badge> : null}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (r) => <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--a-primary-600)' }}>₹{r.price}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r) =>
        r.rating ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Stars value={r.rating} />
            <span className="admin-muted" style={{ fontSize: 12 }}>{r.rating}{r.reviews ? ` (${r.reviews})` : ''}</span>
          </span>
        ) : (
          <span className="admin-muted">—</span>
        ),
    },
    {
      key: 'categories',
      header: 'Categories',
      render: (r) => (
        <span style={{ display: 'inline-flex', gap: 5, flexWrap: 'wrap' }}>
          {(r.categories || []).map((c) => <Badge key={c} tone="primary">{c}</Badge>)}
        </span>
      ),
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
