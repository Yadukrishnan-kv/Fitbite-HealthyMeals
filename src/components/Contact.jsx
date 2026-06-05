import { motion } from "framer-motion";
import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";
import "../styles/sections.css";

const contactItems = [
  { icon: <HiPhone />, label: "Phone", val: "+91 80898 39740" },
  { icon: <HiMail />, label: "Email", val: "hello@fitbite.in" },
  { icon: <HiLocationMarker />, label: "Location", val: "Kozhikode, Kerala, India" },
];

export default function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div>
            <motion.span
              className="section-tag"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Contact Us
            </motion.span>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Let&apos;s Get You <em>Started</em>
            </motion.h2>
            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Have questions or ready to order? Reach out and our team will get back to you within minutes.
            </motion.p>

            <div className="contact-info">
              {contactItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="contact-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-detail">
                    <div className="label">{item.label}</div>
                    <div className="val">{item.val}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            className="contact-form"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" placeholder="john@example.com" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="+91 98765 43210" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" rows={4} placeholder="Tell us about your requirements..." />
              </div>
              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
