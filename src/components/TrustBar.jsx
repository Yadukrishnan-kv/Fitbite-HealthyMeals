import { motion } from "framer-motion";
import { useSection } from "../context/SiteContext";
import "../styles/sections.css";

const FALLBACK = {
  items: [
    { icon: "🥬", title: "Fresh Ingredients", desc: "Sourced fresh every morning" },
    { icon: "🏆", title: "Nutrition Approved", desc: "Certified dietitian-designed" },
    { icon: "🚀", title: "Daily Delivery", desc: "Fresh to your door daily" },
    { icon: "💪", title: "High Protein", desc: "30+ grams per serving" },
  ],
};

export default function TrustBar() {
  const s = useSection("trustbar", FALLBACK);
  const items = s.items?.length ? s.items : FALLBACK.items;

  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-grid">
          {items.map((item, i) => (
            <motion.div
              key={item.title || i}
              className="trust-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="trust-icon">{item.icon}</span>
              <div className="trust-title">{item.title}</div>
              <div className="trust-desc">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
