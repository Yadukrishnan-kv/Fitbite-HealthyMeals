import { motion } from "framer-motion";
import { HiPhone, HiMail, HiLocationMarker } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { useSetting, useSection } from "../context/SiteContext";
import EmTitle from "./EmTitle";
import "../styles/sections.css";

const FALLBACK = {
  tag: "Contact Us",
  title: "Let's Get You Started",
  titleEm: "Started",
  subtitle: "Have questions or ready to order? Reach out and our team will get back to you within minutes.",
  whatsappHeading: "Chat With Us on WhatsApp",
  whatsappText: "Tap the button below to start a conversation. We typically respond within minutes.",
  whatsappBtnLabel: "Message Us on WhatsApp",
};

export default function Contact() {
  const c = useSection("contact", FALLBACK);

  const phoneDisplay = useSetting("phoneDisplay", "+91 80898 39740");
  const phoneRaw = useSetting("phoneRaw", "918089839740");
  const email = useSetting("email", "hello@fitbite.in");
  const locationFull = useSetting("locationFull", "Kozhikode, Kerala, India");

  const contactItems = [
    { icon: <HiPhone />, label: "Phone", val: phoneDisplay },
    { icon: <HiMail />, label: "Email", val: email },
    { icon: <HiLocationMarker />, label: "Location", val: locationFull },
  ];

  // Split the WhatsApp heading so the "WhatsApp" word keeps its brand color.
  const waHeading = c.whatsappHeading || FALLBACK.whatsappHeading;
  const waIdx = waHeading.toLowerCase().lastIndexOf("whatsapp");

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
              {c.tag}
            </motion.span>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <EmTitle title={c.title} em={c.titleEm} />
            </motion.h2>
            <motion.p
              className="section-sub"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {c.subtitle}
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
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{
              background: "linear-gradient(135deg, rgba(37, 211, 102, 0.06) 0%, rgba(37, 211, 102, 0.12) 50%, rgba(37, 211, 102, 0.06) 100%)",
              border: "1.5px solid rgba(37, 211, 102, 0.2)",
              borderRadius: "var(--radius-lg)",
              padding: "48px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 360,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37, 211, 102, 0.08) 0%, transparent 70%)",
                top: "-10%",
                right: "-10%",
                pointerEvents: "none",
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              style={{
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(37, 211, 102, 0.06) 0%, transparent 70%)",
                bottom: "-8%",
                left: "-8%",
                pointerEvents: "none",
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 34,
                color: "#fff",
                marginBottom: 24,
                position: "relative",
                zIndex: 1,
                boxShadow: "0 8px 32px rgba(37, 211, 102, 0.3)",
              }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaWhatsapp />
            </motion.div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, marginBottom: 12, position: "relative", zIndex: 1, color: "var(--dark-text)" }}>
              {waIdx === -1 ? (
                waHeading
              ) : (
                <>
                  {waHeading.slice(0, waIdx)}
                  <span style={{ color: "#25D366" }}>{waHeading.slice(waIdx, waIdx + 8)}</span>
                  {waHeading.slice(waIdx + 8)}
                </>
              )}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 32, maxWidth: 320, lineHeight: 1.7, position: "relative", zIndex: 1 }}>
              {c.whatsappText}
            </p>
            <motion.a
              href={`https://wa.me/${phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
                fontWeight: 600,
                padding: "18px 40px",
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                color: "#fff",
                textDecoration: "none",
                position: "relative",
                zIndex: 1,
                boxShadow: "0 8px 32px rgba(37, 211, 102, 0.3)",
                transition: "all 0.3s ease",
              }}
              whileHover={{ scale: 1.04, boxShadow: "0 12px 40px rgba(37, 211, 102, 0.4)" }}
              whileTap={{ scale: 0.97 }}
            >
              <FaWhatsapp size={20} /> {c.whatsappBtnLabel}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
