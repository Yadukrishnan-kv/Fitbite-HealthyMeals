import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useResource } from "../hooks/useResource";
import "../styles/testimonials.css";

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const { items: testimonials, loading } = useResource("/testimonials");

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

      {testimonials.length > 0 && (
        <div className="testimonials-track-wrap">
          <div className="testimonials-fade-left" />
          <div className="testimonials-fade-right" />

          <motion.div
            className="testimonials-track"
            // Duplicate the list and translate by exactly one set (-50%) so the
            // marquee loops seamlessly for any number of testimonials.
            animate={isInView ? { x: ["0%", "-50%"] } : {}}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ display: "flex" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <motion.div
                key={`${t._id || t.id}-${i}`}
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
      )}

      {!loading && testimonials.length === 0 && (
        <div className="container">
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px 0" }}>
            No testimonials yet.
          </p>
        </div>
      )}
    </section>
  );
}
