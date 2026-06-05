import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { testimonials } from "../data/testimonials";
import "../styles/testimonials.css";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section testimonials-section" id="testimonials" ref={ref}>
      <div className="container">
        <div className="testimonials-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Testimonials
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real People, <em>Real Results</em>
          </motion.h2>
        </div>
      </div>

      <div className="testimonials-track-wrap">
        <div className="testimonials-fade-left" />
        <div className="testimonials-fade-right" />

        <motion.div
          className="testimonials-track"
          animate={isInView ? { x: [0, -720 * 2 - 48 * 2] } : {}}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ display: "flex" }}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <motion.div
              key={`${t.id}-${i}`}
              className="testi-card"
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">&ldquo;{t.text}&rdquo;</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-tag">{t.tag}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
