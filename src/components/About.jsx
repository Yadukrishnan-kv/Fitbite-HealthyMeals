import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "../styles/sections.css";

const counters = [
  { num: "5K+", label: "Meals Delivered" },
  { num: "1K+", label: "Happy Customers" },
  { num: "15+", label: "Menu Items" },
  { num: "100%", label: "Clean Ingredients" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section about-section" id="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <div>
            <motion.span
              className="section-tag"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              Our Story
            </motion.span>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              We Believe <em>Eating Healthy</em> Should Be Effortless
            </motion.h2>
            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Fitbite was born from a simple idea: healthy eating shouldn&apos;t require hours of meal prep or sacrificing taste.
              We bring chef-crafted, nutritionist-approved meals directly to your doorstep.
            </motion.p>
            <motion.p
              style={{
                fontSize: 15,
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginTop: 16,
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Every bowl we craft tells a story of carefully selected ingredients, balanced macros, and flavors that make
              clean eating something to look forward to.
            </motion.p>

            <div className="about-counters">
              {counters.map((c, i) => (
                <motion.div
                  key={c.label}
                  className="counter-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                >
                  <div className="counter-num">{c.num}</div>
                  <div className="counter-label">{c.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="about-img-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=85"
              alt="Fresh healthy food preparation"
              className="about-img"
            />
            <motion.div
              className="about-badge-float"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            >
              <div className="num">⭐ 4.9</div>
              <div className="lbl">Customer Rating</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
