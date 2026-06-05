import { motion } from "framer-motion";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/sections.css";

const footerLinks = {
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Our Menu", href: "#menu" },
  ],
  Support: [
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
};

const socialLinks = [
  { Icon: FiInstagram, href: "https://www.instagram.com/fit_bite1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
  { Icon: FaWhatsapp, href: "https://wa.me/918089839740", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <a href="#" className="nav-logo">
                <img src="/logo.png" alt="Fitbite" className="nav-logo-img" />
              </a>
            </motion.div>
            <p className="footer-tagline">
              Chef-crafted nutrition delivered daily. Fuel your performance, support your wellness, simplify your life.
            </p>
            <div className="footer-social">
              {socialLinks.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ y: -2 }}
                  aria-label={label}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div className="footer-col" key={title}>
              <h4>{title}</h4>
              <ul>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="tel:+918089839740">+91 80898 39740</a></li>
              <li><a href="mailto:hello@fitbite.in">hello@fitbite.in</a></li>
              <li><span style={{ color: "var(--text-muted)", fontSize: 14 }}>Kozhikode, Kerala</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Fitbite. All rights reserved.</span>
          <span className="footer-copy">Crafted with care in Kerala</span>
        </div>
      </div>
    </footer>
  );
}
