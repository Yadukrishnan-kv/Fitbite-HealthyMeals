import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { publicApi } from '../api/publicClient';

/**
 * SiteContext loads everything the public layout needs from the backend in a
 * single pass on mount:
 *   - GET /api/bootstrap  -> settings (map), socialLinks, menus { header, footer }
 *   - GET /api/sections   -> section content blocks keyed by `key`
 *
 * Content is the source of truth; every consumer merges it over a local
 * fallback so the design is preserved even before data arrives or if the API
 * is unreachable (graceful degradation, no layout shift).
 */

const SiteContext = createContext(null);

const EMPTY = {
  settings: {},
  socialLinks: [],
  menus: { header: [], footer: [] },
  sectionsByKey: {},
};

export function SiteProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [boot, sec] = await Promise.all([
          publicApi.get('/bootstrap'),
          publicApi.get('/sections'),
        ]);
        if (!alive) return;
        setData({
          settings: boot?.settings ?? {},
          socialLinks: boot?.socialLinks ?? [],
          menus: {
            header: boot?.menus?.header ?? [],
            footer: boot?.menus?.footer ?? [],
          },
          sectionsByKey: sec?.byKey ?? {},
        });
      } catch (err) {
        if (!alive) return;
        // Keep EMPTY data so components fall back to their defaults.
        setError(err);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => ({ ...data, loading, error }), [data, loading, error]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used within a <SiteProvider>');
  return ctx;
}

/** Read a single setting value with a fallback. */
export function useSetting(key, fallback = '') {
  const { settings } = useSite();
  const v = settings?.[key];
  return v === undefined || v === null || v === '' ? fallback : v;
}

/**
 * Merge a section's server content over a component-local fallback.
 * Returns a flat object: { tag, title, subtitle, ...content } with fallbacks
 * filling any missing field so the markup never renders blank.
 */
export function useSection(key, fallback = {}) {
  const { sectionsByKey } = useSite();
  const section = sectionsByKey?.[key];

  return useMemo(() => {
    if (!section) return { ...fallback };
    const { content = {}, ...top } = section;
    const merged = { ...fallback, ...content };
    // Top-level editable fields win over fallback when present.
    ['tag', 'title', 'subtitle', 'name', 'isVisible'].forEach((f) => {
      if (top[f] !== undefined && top[f] !== null && top[f] !== '') merged[f] = top[f];
    });
    return merged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);
}

/**
 * Imperatively set document <title> and SEO meta tags. Used per-route.
 * Restores nothing on unmount — the next route sets its own values.
 */
export function useDocumentMeta({ title, description, keywords } = {}) {
  useEffect(() => {
    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
  }, [title, description, keywords]);
}

function setMeta(attr, name, content) {
  if (content === undefined || content === null || content === '') return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default SiteContext;
