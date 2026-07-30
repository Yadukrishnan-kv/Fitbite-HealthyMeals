import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Field, Input, Textarea, Select, Button, Spinner, PageHeader, Badge } from '../components/ui';
import RichTextEditor from '../components/RichTextEditor';
import ImagePicker from '../components/ImagePicker';

const EMPTY = {
  title: '',
  slug: '',
  heading: '',
  bodyHtml: '',
  featuredImage: '',
  seoTitle: '',
  metaDescription: '',
  metaKeywords: '',
  status: 'draft',
};

export default function PageEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const toast = useToast();

  const [v, setV] = useState(EMPTY);
  const [isSystem, setIsSystem] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/pages/${id}`)
      .then((data) => {
        setV({ ...EMPTY, ...data.item });
        setIsSystem(data.item.isSystem);
        setSlugTouched(true);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id, isNew, toast]);

  const set = (name, val) => {
    setV((s) => ({ ...s, [name]: val }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  // Auto-suggest slug from title for new pages until the user edits it.
  const onTitle = (val) => {
    setV((s) => {
      const next = { ...s, title: val };
      if (isNew && !slugTouched) {
        next.slug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const payload = { ...v };
    if (isSystem) delete payload.slug; // server rejects slug changes on system pages
    try {
      if (isNew) {
        const data = await api.post('/admin/pages', payload);
        toast.success('Page created');
        navigate(`/admin/pages/${data.item._id}`);
      } else {
        await api.patch(`/admin/pages/${id}`, payload);
        toast.success('Page saved');
      }
    } catch (err) {
      if (err.details) {
        const map = {};
        err.details.forEach((d) => { map[d.field] = d.message; });
        setErrors(map);
        toast.error('Please fix the highlighted fields');
      } else {
        toast.error(err.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><Spinner /></div>;

  return (
    <div>
      <PageHeader
        title={isNew ? 'New Page' : `Edit: ${v.title}`}
        actions={
          !isNew && (
            <a className="admin-btn admin-btn--ghost" href={v.slug === 'home' ? '/' : `/${v.slug}`} target="_blank" rel="noreferrer">
              ↗ Preview
            </a>
          )
        }
      />

      <form className="admin-form" onSubmit={submit}>
        <div className="admin-form-grid">
          <div className="admin-form-full">
            <Field label="Title" required error={errors.title}>
              <Input value={v.title} onChange={(e) => onTitle(e.target.value)} required />
            </Field>
          </div>

          <Field label="Slug" error={errors.slug} hint={isSystem ? 'System page — slug is locked' : 'URL path, e.g. about-us'}>
            <Input value={v.slug} disabled={isSystem} onChange={(e) => { setSlugTouched(true); set('slug', e.target.value); }} />
          </Field>

          <Field label="Status" error={errors.status}>
            <Select value={v.status} onChange={(e) => set('status', e.target.value)}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </Field>

          <div className="admin-form-full">
            <Field label="Page Heading" error={errors.heading}>
              <Input value={v.heading} onChange={(e) => set('heading', e.target.value)} />
            </Field>
          </div>

          <div className="admin-form-full">
            <Field label="Body Content" error={errors.bodyHtml} hint="Formatting is sanitized on save.">
              <RichTextEditor value={v.bodyHtml} onChange={(val) => set('bodyHtml', val)} />
            </Field>
          </div>

          <div className="admin-form-full">
            <Field label="Featured Image">
              <ImagePicker value={v.featuredImage} onChange={(val) => set('featuredImage', val)} />
            </Field>
          </div>

          <div className="admin-form-full admin-section-divider">
            <Badge tone="blue">SEO</Badge>
          </div>

          <div className="admin-form-full">
            <Field label="SEO Title" error={errors.seoTitle}>
              <Input value={v.seoTitle} onChange={(e) => set('seoTitle', e.target.value)} />
            </Field>
          </div>
          <div className="admin-form-full">
            <Field label="Meta Description" error={errors.metaDescription} hint={`${(v.metaDescription || '').length}/320`}>
              <Textarea rows={3} maxLength={320} value={v.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} />
            </Field>
          </div>
          <div className="admin-form-full">
            <Field label="Meta Keywords" error={errors.metaKeywords} hint="Comma-separated">
              <Input value={v.metaKeywords} onChange={(e) => set('metaKeywords', e.target.value)} />
            </Field>
          </div>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/pages" className="admin-btn admin-btn--ghost">Cancel</Link>
          <Button type="submit" loading={saving}>{isNew ? 'Create Page' : 'Save changes'}</Button>
        </div>
      </form>
    </div>
  );
}
