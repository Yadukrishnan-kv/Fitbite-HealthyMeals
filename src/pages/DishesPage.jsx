import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { useResource } from "../hooks/useResource";
import { qs } from "../api/publicClient";
import { useSetting, useDocumentMeta } from "../context/SiteContext";
import "../styles/dishes.css";

// Top-level menu types. Each maps to the Dish model's `type` field.
const MENU_TYPES = [
  { key: "salad", label: "Salad", tag: "Our Menu", title: "Chef-Crafted Power Bowls" },
  { key: "lunch", label: "Lunch", tag: "Midday Meals", title: "Fresh & Filling Lunch" },
  { key: "wrap", label: "Wrap", tag: "On The Go", title: "Hand-Rolled Wraps" },
];

// Fixed sub-filters for the Salads menu (kept as-is so existing behaviour doesn't change).
const DISH_FILTERS = [
  { key: "all", label: "All" },
  { key: "high-protein", label: "High Protein" },
  { key: "veg", label: "Veg" },
  { key: "weight-loss", label: "Weight Loss" },
];

function catList(dish) {
  if (Array.isArray(dish.categories)) return dish.categories;
  if (typeof dish.category === "string") return dish.category.split(/\s+/);
  return [];
}

function labelize(key) {
  return key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function badgeFor(dish) {
  const cats = catList(dish);
  if (cats.includes("veg")) return "Veg";
  if (cats.includes("high-protein")) return "High Protein";
  if (cats.length) return labelize(cats[0]);
  return "";
}

const TYPE_KEYS = MENU_TYPES.map((m) => m.key);

export default function DishesPage() {
  const [searchParams] = useSearchParams();
  const initialType = TYPE_KEYS.includes(searchParams.get("type")) ? searchParams.get("type") : "salad";
  const [activeType, setActiveType] = useState(initialType);
  const [activeFilter, setActiveFilter] = useState("all");
  const { items: dishes, loading } = useResource(`/dishes${qs({ type: activeType })}`, { deps: [activeType] });
  const phoneRaw = useSetting("phoneRaw", "918089839740");

  const meta = MENU_TYPES.find((m) => m.key === activeType);

  // Dishes keep their fixed filter set; Lunch/Wraps derive filters from whatever
  // categories the admin has tagged their items with, so no extra config is needed.
  const subFilters = useMemo(() => {
    if (activeType === "salad") return DISH_FILTERS;
    const cats = new Set();
    dishes.forEach((d) => catList(d).forEach((c) => cats.add(c)));
    return [{ key: "all", label: "All" }, ...[...cats].sort().map((c) => ({ key: c, label: labelize(c) }))];
  }, [activeType, dishes]);

  useDocumentMeta({
    title: useSetting("siteTitle", "Our Menu — Fitbite"),
    description: useSetting("metaDescription", ""),
    keywords: useSetting("metaKeywords", ""),
  });

  const handleTypeChange = (type) => {
    setActiveType(type);
    setActiveFilter("all");
  };

  const filtered =
    activeFilter === "all"
      ? dishes
      : dishes.filter((d) => catList(d).includes(activeFilter));

  return (
    <section className="section dishes-section" style={{ paddingTop: "105px" }}>
      <div className="container">
        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "var(--text-muted)",
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 24,
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--premium-green)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <HiArrowLeft /> Back to Home
        </Link>

        <div className="dishes-header" style={{ textAlign: "left" }}>
          <motion.span
            className="section-tag"
            key={`tag-${activeType}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {meta.tag}
          </motion.span>
          <motion.h2
            className="section-title"
            key={`title-${activeType}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {meta.title}
          </motion.h2>
        </div>

        <motion.div
          className="menu-type-tabs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {MENU_TYPES.map((m) => (
            <button
              key={m.key}
              className={`menu-type-tab${activeType === m.key ? " active" : ""}`}
              onClick={() => handleTypeChange(m.key)}
            >
              {m.label}
            </button>
          ))}
        </motion.div>

        {subFilters.length > 1 && (
          <motion.div
            className="dishes-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ justifyContent: "flex-start" }}
          >
            {subFilters.map((f) => (
              <button
                key={f.key}
                className={`filter-btn${activeFilter === f.key ? " active" : ""}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        )}

        <div className="dishes-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((dish, i) => (
              <DishCard key={dish._id || dish.id} dish={dish} index={i} phoneRaw={phoneRaw} />
            ))}
          </AnimatePresence>
        </div>

        {loading && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "60px 0", fontSize: 16 }}>
            Loading menu…
          </p>
        )}

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "60px 0", fontSize: 16 }}>
            No items found for this category.
          </p>
        )}
      </div>
    </section>
  );
}

function DishCard({ dish, index, phoneRaw }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const stars = "★".repeat(Math.floor(dish.rating)) + (dish.rating % 1 >= 0.5 ? "★" : "");

  return (
    <motion.div
      className="dish-card"
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: "transform 0.1s ease",
      }}
    >
      <div className="dish-img-wrap">
        <img src={dish.image} alt={dish.name} className="dish-img" loading="lazy" />
        {badgeFor(dish) && <span className="dish-cat-badge">{badgeFor(dish)}</span>}
      </div>
      <div className="dish-body">
        <h3 className="dish-name">{dish.name}</h3>
        <p className="dish-desc">{dish.desc}</p>
        <div className="dish-meta">
          <span>{dish.calories} kcal</span>
          <span>{dish.protein} protein</span>
          <span>{dish.carbs} carbs</span>
        </div>
        <div className="dish-rating">
          <span className="stars">{stars}</span>
          {dish.rating} ({dish.reviews})
        </div>
          <div className="dish-footer">
          <div className="dish-price">₹{dish.price}</div>
          <a
            href={`https://wa.me/${phoneRaw}?text=Hi%20Fitbite!%20I'd%20like%20to%20order%20the%20${encodeURIComponent(dish.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="dish-order-btn"
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            Order <HiArrowRight />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
