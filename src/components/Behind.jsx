import { motion } from "framer-motion";
import { useSection } from "../context/SiteContext";
import EmTitle from "./EmTitle";
import "../styles/sections.css";

const FALLBACK = {
  tag: "Our Philosophy",
  quote: "Food is not just fuel — it's medicine, performance, and joy all in one bowl.",
  quoteEm: "medicine, performance, and joy",
  paragraphs: [
    "At Fitbite, we started with one belief: healthy food should taste exceptional. We got tired of bland diet meals and cardboard protein bars. So we built something different — a meal service where every bite delivers both nutrition and satisfaction.",
    "We work with local suppliers, use zero artificial additives, and design every menu item around real nutritional science. This isn't just a food business — it's a lifestyle mission.",
  ],
  signature: "Fitbite Team",
  role: "Founders & Nutrition Team — Kozhikode, Kerala",
  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
};

export default function Behind() {
  const s = useSection("behind", FALLBACK);
  const paragraphs = s.paragraphs?.length ? s.paragraphs : FALLBACK.paragraphs;

  return (
    <section className="section behind-section" id="behind">
      <div className="container">
        <div className="behind-inner">
          <motion.div
            className="behind-img-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={s.image}
              alt="Fitbite founder"
              className="behind-img"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="section-tag">{s.tag}</span>
            <div className="behind-quote">
              &ldquo;<EmTitle title={s.quote} em={s.quoteEm} />&rdquo;
            </div>
            {paragraphs.map((p, i) => (
              <p className="behind-text" key={i}>{p}</p>
            ))}
            <div>
              <div className="founder-sig">{s.signature}</div>
              <div className="founder-role">{s.role}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
