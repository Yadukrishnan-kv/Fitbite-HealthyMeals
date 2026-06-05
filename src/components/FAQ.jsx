import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqs } from "../data/faqs";
import "../styles/sections.css";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="faq-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            FAQ
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Everything You <em>Need to Know</em>
          </motion.h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <button
                className={`faq-q${openIndex === i ? " open" : ""}`}
                onClick={() => toggle(i)}
              >
                {faq.q}
                <span className="faq-arrow">+</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    className="faq-a open"
                    initial={{ maxHeight: 0, opacity: 0 }}
                    animate={{ maxHeight: 250, opacity: 1 }}
                    exit={{ maxHeight: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
