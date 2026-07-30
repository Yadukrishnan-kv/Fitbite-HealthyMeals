import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { useSection } from "../context/SiteContext";
import "../styles/cta.css";

const particles = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 6,
  delay: Math.random() * 6,
  duration: 4 + Math.random() * 5,
}));

const FALLBACK = {
  tag: "Get Started Today",
  title: "Ready To Transform Your Eating Habits?",
  titleEm: "Transform",
  subtitle:
    "Join 1,000+ people already eating smarter with Fitbite. Your first step toward a healthier you starts now.",
  stats: [
    { num: "1,000+", label: "Happy Customers" },
    { num: "15+", label: "Power Bowls" },
    { num: "Daily", label: "Fresh Delivery" },
  ],
  primaryBtn: { label: "Get Started Today", href: "#contact" },
  secondaryBtn: { label: "Call Us Now", href: "tel:8089839740" },
};

// Reproduce the original heading: "Ready To <em>Transform</em><br/>Your…".
function CtaHeading({ title, em }) {
  if (!em) return <>{title}</>;
  const idx = title.indexOf(em);
  if (idx === -1) return <>{title}</>;
  return (
    <>
      {title.slice(0, idx)}
      <em>{em}</em>
      <br />
      {title.slice(idx + em.length).replace(/^\s+/, "")}
    </>
  );
}

export default function CTA() {
  const s = useSection("cta", FALLBACK);
  const stats = s.stats?.length ? s.stats : FALLBACK.stats;
  const primaryBtn = s.primaryBtn || FALLBACK.primaryBtn;
  const secondaryBtn = s.secondaryBtn || FALLBACK.secondaryBtn;

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
            {s.tag}
          </motion.span>

          <motion.h2
            className="cta-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CtaHeading title={s.title} em={s.titleEm} />
          </motion.h2>

          <motion.p
            className="cta-sub"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {s.subtitle}
          </motion.p>

          <motion.div
            className="cta-stats"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label || i}
                className="cta-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              >
                <div className="cta-stat-num">{stat.num}</div>
                <div className="cta-stat-label">{stat.label}</div>
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
            <a href={primaryBtn.href} className="btn-primary cta-btn-glow">
              {primaryBtn.label} <HiArrowRight />
            </a>
            <a href={secondaryBtn.href} className="btn-outline">
              {secondaryBtn.label}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
