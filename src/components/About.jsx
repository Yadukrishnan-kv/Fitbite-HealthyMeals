import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useSection } from "../context/SiteContext";
import EmTitle from "./EmTitle";
import "../styles/sections.css";

const FALLBACK = {
  tag: "Our Story",
  title: "We Believe Eating Healthy Should Be Effortless",
  titleEm: "Eating Healthy",
  subtitle:
    "Fitbite was born from a simple idea: healthy eating shouldn't require hours of meal prep or sacrificing taste. We bring chef-crafted, nutritionist-approved meals directly to your doorstep.",
  paragraph2:
    "Every bowl we craft tells a story of carefully selected ingredients, balanced macros, and flavors that make clean eating something to look forward to.",
  counters: [
    { num: "5K+", label: "Meals Delivered" },
    { num: "1K+", label: "Happy Customers" },
    { num: "15+", label: "Menu Items" },
    { num: "100%", label: "Clean Ingredients" },
  ],
  image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=85",
  ratingBadge: { num: "⭐ 4.9", label: "Customer Rating" },
};

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const a = useSection("about", FALLBACK);
  const counters = a.counters?.length ? a.counters : FALLBACK.counters;
  const ratingBadge = a.ratingBadge || FALLBACK.ratingBadge;

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
              {a.tag}
            </motion.span>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <EmTitle title={a.title} em={a.titleEm} />
            </motion.h2>
            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {a.subtitle}
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
              {a.paragraph2}
            </motion.p>

            <div className="about-counters">
              {counters.map((c, i) => (
                <motion.div
                  key={c.label || i}
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
              src={a.image}
              alt="Fresh healthy food preparation"
              className="about-img"
            />
            <motion.div
              className="about-badge-float"
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.6 }}
            >
              <div className="num">{ratingBadge.num}</div>
              <div className="lbl">{ratingBadge.label}</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
