import { motion } from "framer-motion";
import "../styles/sections.css";

const steps = [
  { num: "1", title: "Choose Your Plan", desc: "Select from our weight loss, high protein, or custom plan options based on your goals." },
  { num: "2", title: "Select Meals", desc: "Pick from our chef-curated menu of 15+ power bowls and salads tailored to your needs." },
  { num: "3", title: "We Prepare Fresh", desc: "Our chefs freshly prepare every meal the same morning using only clean, whole ingredients." },
  { num: "4", title: "Delivered Fresh", desc: "Your meals arrive at your door — hot, fresh and ready to power your day." },
];

export default function Process() {
  return (
    <section className="section process-section" id="process">
      <div className="container">
        <div className="process-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.span>
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Journey to <em>Eating Better</em>
          </motion.h2>
          <motion.p
            className="section-sub"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ margin: "0 auto" }}
          >
            Four simple steps stand between you and the healthiest meals of your life.
          </motion.p>
        </div>

        <div className="process-steps">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              className="step-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <motion.div
                className="step-num"
                whileHover={{ scale: 1.08, boxShadow: "0 0 50px rgba(70,132,50,0.3)" }}
              >
                {s.num}
              </motion.div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
