import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import { dishes } from "../data/dishes";
import "../styles/dishes.css";

const filters = [
  { key: "all", label: "All" },
  { key: "high-protein", label: "High Protein" },
  { key: "veg", label: "Veg" },
  { key: "weight-loss", label: "Weight Loss" },
];

export default function DishesPage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? dishes
      : dishes.filter((d) => d.category.includes(activeFilter));

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Menu
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Chef-Crafted <em>Power Bowls</em>
          </motion.h2>
          <motion.p
            className="section-sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Every bowl is a carefully balanced meal designed to fuel your performance and satisfy your cravings.
          </motion.p>
        </div>

        <motion.div
          className="dishes-filters"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ justifyContent: "flex-start" }}
        >
          {filters.map((f) => (
            <button
              key={f.key}
              className={`filter-btn${activeFilter === f.key ? " active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <div className="dishes-grid">
          <AnimatePresence mode="popLayout">
            {filtered.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "60px 0", fontSize: 16 }}>
            No dishes found for this category.
          </p>
        )}
      </div>
    </section>
  );
}

function DishCard({ dish, index }) {
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
        <span className="dish-cat-badge">
          {dish.category.includes("veg") ? "Veg" : dish.category.includes("high-protein") ? "High Protein" : "Weight Loss"}
        </span>
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
            href={`https://wa.me/919645672899?text=Hi%20Fitbite!%20I'd%20like%20to%20order%20the%20${encodeURIComponent(dish.name)}`}
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
