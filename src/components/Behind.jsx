import { motion } from "framer-motion";
import "../styles/sections.css";

export default function Behind() {
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
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
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
            <span className="section-tag">Our Philosophy</span>
            <div className="behind-quote">
              &ldquo;Food is not just fuel — it&apos;s <em>medicine, performance, and joy</em> all in one bowl.&rdquo;
            </div>
            <p className="behind-text">
              At Fitbite, we started with one belief: healthy food should taste exceptional. We got tired of bland diet
              meals and cardboard protein bars. So we built something different — a meal service where every bite delivers
              both nutrition and satisfaction.
            </p>
            <p className="behind-text">
              We work with local suppliers, use zero artificial additives, and design every menu item around real
              nutritional science. This isn&apos;t just a food business — it&apos;s a lifestyle mission.
            </p>
            <div>
              <div className="founder-sig">Fitbite Team</div>
              <div className="founder-role">Founders & Nutrition Team — Perumpavur, Kerala</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
