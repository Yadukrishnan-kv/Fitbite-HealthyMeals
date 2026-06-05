import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import "../styles/cta.css";

const particles = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 5 + Math.random() * 6,
  delay: Math.random() * 5,
  duration: 5 + Math.random() * 5,
}));

export default function CTA() {
  return (
    <section className="cta-section" id="cta">
      <div className="cta-glow" />

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
              y: [0, -30 - Math.random() * 20, 0],
              opacity: [0.1, 0.3, 0.1],
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
            className="cta-btns"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <a href="#contact" className="btn-primary cta-btn-glow">
              Get Started Today <HiArrowRight />
            </a>
            <a href="tel:8089839740" className="btn-outline">
              Call Us Now
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
