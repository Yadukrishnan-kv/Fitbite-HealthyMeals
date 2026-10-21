import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { publicApi } from "../api/publicClient";
import { useDocumentMeta } from "../context/SiteContext";
import "../styles/cms-page.css";

export default function CmsPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setNotFound(false);
    publicApi
      .get(`/pages/${slug}`)
      .then((res) => {
        if (alive) setPage(res.item);
      })
      .catch(() => {
        if (alive) setNotFound(true);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  useDocumentMeta({
    title: page?.seoTitle || page?.title,
    description: page?.metaDescription,
    keywords: page?.metaKeywords,
  });

  if (loading) return null;
  if (notFound || !page) return <Navigate to="/" replace />;

  return (
    <section className="section cms-page">
      <div className="container">
        {page.featuredImage && (
          <img className="cms-page-img" src={page.featuredImage} alt={page.heading || page.title} />
        )}
        <h1 className="section-title">{page.heading || page.title}</h1>
        <div className="cms-page-body" dangerouslySetInnerHTML={{ __html: page.bodyHtml || "" }} />
      </div>
    </section>
  );
}
