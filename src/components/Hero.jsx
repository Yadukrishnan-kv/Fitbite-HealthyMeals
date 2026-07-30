import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";
import { useSection } from "../context/SiteContext";
import "../styles/hero.css";

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 3 + Math.random() * 5,
  delay: Math.random() * 4,
  duration: 4 + Math.random() * 4,
}));

const FALLBACK = {
  badge: "100% Fresh Ingredients",
  headingLine1: "Chef Crafted Nutrition.",
  headingEm: "Delivered Daily.",
  subtitle:
    "Healthy meals designed to fuel performance, support wellness, and simplify your lifestyle.",
  primaryBtn: { label: "View Menu", href: "#menu" },
  secondaryBtn: { label: "Get Started", href: "#contact" },
  stats: [
    { num: "5K+", label: "Meals Delivered" },
    { num: "1K+", label: "Happy Clients" },
    { num: "100%", label: "Fresh Ingredients" },
  ],
  image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1200&q=85",
  floatCards: [
    { label: "Today's Special", val: "₹490", sub: "Harmony Bowl" },
    { label: "Avg. Protein", val: "35g", sub: "Per meal" },
  ],
};

export default function Hero() {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const h = useSection("hero", FALLBACK);
  const stats = h.stats?.length ? h.stats : FALLBACK.stats;
  const floatCards = h.floatCards?.length ? h.floatCards : FALLBACK.floatCards;
  const primaryBtn = h.primaryBtn || FALLBACK.primaryBtn;
  const secondaryBtn = h.secondaryBtn || FALLBACK.secondaryBtn;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const handleMouse = (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="hero-blob" />

      <div className="hero-particles">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              y: [0, -20 - Math.random() * 20, 0],
              opacity: [0.2, 0.5, 0.2],
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
        <div className="hero-inner">
          <motion.div className="hero-content" style={{ y: contentY, opacity }}>
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="hero-badge-dot" />
              {h.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {h.headingLine1}
              <br />
              <em>{h.headingEm}</em>
            </motion.h1>

            <motion.p
              className="hero-sub"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {h.subtitle}
            </motion.p>

            <motion.div
              className="hero-btns"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
            >
              <a href={primaryBtn.href} className="btn-primary">
                {primaryBtn.label} <HiArrowRight />
              </a>
              <a href={secondaryBtn.href} className="btn-outline">
                {secondaryBtn.label}
              </a>
            </motion.div>

            <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {stats.map((s, i) => (
                <div className="hero-stat" key={s.label || i}>
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="hero-visual" style={{ y: imgY }}>
            <div className="hero-img-wrap">
              <motion.div
                className="hero-img-ring"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />

              <motion.div
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1200,
                }}
                animate={{
                  rotateY: mousePos.x * 6,
                  rotateX: -mousePos.y * 6,
                }}
                transition={{ type: "spring", stiffness: 100, damping: 30 }}
              >
                <motion.img
                  src={h.image}
                  alt="Healthy meal bowl"
                  className="hero-main-img"
                  initial={{ opacity: 0, scale: 0.8, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </motion.div>

              <motion.div
                className="hero-float-card card1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                style={{
                  transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)`,
                }}
              >
                <div className="fc-label">{floatCards[0]?.label}</div>
                <div className="fc-val">{floatCards[0]?.val}</div>
                <div className="fc-sub">{floatCards[0]?.sub}</div>
              </motion.div>

              <motion.div
                className="hero-float-card card2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)`,
                }}
              >
                <div className="fc-label">{floatCards[1]?.label}</div>
                <div className="fc-val">{floatCards[1]?.val}</div>
                <div className="fc-sub">{floatCards[1]?.sub}</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
