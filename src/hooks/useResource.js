import { useEffect, useState } from 'react';
import { publicApi } from '../api/publicClient';

/**
 * Generic fetch hook for public list endpoints (dishes, testimonials, faqs).
 * Returns { items, loading, error }. `pick` extracts the array from the
 * response envelope (defaults to res.items).
 *
 * Components use this so a slow/absent backend never crashes the page — they
 * render loading/empty states instead.
 */
export function useResource(path, { pick = (res) => res?.items ?? [], deps = [] } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    publicApi
      .get(path)
      .then((res) => {
        if (!alive) return;
        setItems(pick(res) || []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err);
        setItems([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);

  return { items, loading, error };
}

export default useResource;
