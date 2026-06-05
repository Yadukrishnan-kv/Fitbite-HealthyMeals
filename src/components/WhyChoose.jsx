import { motion } from "framer-motion";
import "../styles/sections.css";

const reasons = [
  { icon: "🧑‍🍳", title: "Fresh Daily Preparation", desc: "Every bowl is made fresh each morning. No pre-made, no frozen — just pure, same-day freshness in every bite." },
  { icon: "🥗", title: "Expert Nutrition Planning", desc: "Macro-balanced meals crafted with certified nutrition expertise. Every dish hits your protein, carb, and fat targets." },
  { icon: "🚀", title: "Doorstep Delivery", desc: "We deliver directly to you — fresh, packaged perfectly, arriving on time every single time." },
  { icon: "📋", title: "Custom Meal Plans", desc: "Weight loss, muscle gain, maintenance — we build a plan around your specific goals and dietary needs." },
  { icon: "💰", title: "Affordable Packages", desc: "Premium quality that doesn't break the bank. Starting from just ₹149 per meal — cheaper than eating out unhealthy." },
  { icon: "✅", title: "Quality Ingredients", desc: "We source only the finest, cleanest ingredients — no preservatives, no hidden nasties, just honest whole food." },
];

export default function WhyChoose() {
  return (
    <section className="section why-section" id="why">
      <div className="container">
        <div className="why-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Why Fitbite
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You Need,<br /><em>Nothing You Don't</em>
          </motion.h2>
        </div>

        <div className="why-grid">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              className="why-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="why-icon">{r.icon}</span>
              <h3 className="why-title">{r.title}</h3>
              <p className="why-desc">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
