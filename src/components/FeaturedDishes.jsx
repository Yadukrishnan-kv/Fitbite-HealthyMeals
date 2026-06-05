import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { dishes } from "../data/dishes";
import "../styles/dishes.css";

const filters = [
  { key: "all", label: "All" },
  { key: "high-protein", label: "High Protein" },
  { key: "veg", label: "Veg" },
  { key: "weight-loss", label: "Weight Loss" },
];

export default function FeaturedDishes({ limit }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered =
    activeFilter === "all"
      ? dishes
      : dishes.filter((d) => d.category.includes(activeFilter));

  const displayed = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="section dishes-section" id="menu">
      <div className="container">
        <div className="dishes-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Menu
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Chef-Crafted <em>Power Bowls</em>
          </motion.h2>
          <motion.p
            className="section-sub"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Every bowl is a carefully balanced meal designed to fuel your performance and satisfy your cravings.
          </motion.p>
        </div>

        <motion.div
          className="dishes-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
            {displayed.map((dish, i) => (
              <DishCard key={dish.id} dish={dish} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {limit && dishes.length > limit && (
          <motion.div
            style={{ textAlign: "center", marginTop: 48 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/dishes" className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              View All Dishes <HiArrowRight />
            </Link>
          </motion.div>
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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
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
          {dish.category.includes("high-protein") ? "High Protein" : dish.category === "veg" ? "Veg" : "Weight Loss"}
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
          <button className="dish-order-btn">
            Order <HiArrowRight />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
