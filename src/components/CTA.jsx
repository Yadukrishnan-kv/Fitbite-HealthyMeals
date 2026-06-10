import { motion } from "framer-motion";
import { HiArrowRight, HiBadgeCheck, HiClock, HiHeart } from "react-icons/hi";
import "../styles/cta.css";

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 6,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 5,
}));

const ctaStats = [
  { num: "1,000+", label: "Happy Customers", icon: <HiBadgeCheck /> },
  { num: "15+", label: "Power Bowls", icon: <HiHeart /> },
  { num: "Daily", label: "Fresh Delivery", icon: <HiClock /> },
];

export default function CTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-glow-1" />
      <div className="cta-glow-2" />
      <div className="cta-glow-3" />

      <div className="cta-particles">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="cta-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -(20 + Math.random() * 20), 0],
              opacity: [0.08, 0.3, 0.08],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container">
        <div className="cta-content">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Get Started Today
          </motion.span>

          <motion.h2
            className="cta-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready To <em>Transform</em>
            <br />
            Your Eating Habits?
          </motion.h2>

          <motion.p
            className="cta-sub"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join 1,000+ people already eating smarter with Fitbite.
            <br />
            Your first step toward a healthier you starts now.
          </motion.p>

          <motion.div
            className="cta-stats"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {ctaStats.map((s, i) => (
              <motion.div
                key={s.label}
                className="cta-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <div className="cta-stat-num">{s.num}</div>
                <div className="cta-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="cta-btns"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <a href="#contact" className="btn-primary cta-btn-glow">
              Get Started Today <HiArrowRight />
            </a>
            <a href="tel:9645672899" className="btn-outline">
              Call Us Now
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
