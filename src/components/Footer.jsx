import { motion } from "framer-motion";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp, FaFacebookF, FaXTwitter, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import { useSite, useSetting } from "../context/SiteContext";
import "../styles/sections.css";

// Map a social platform/icon key to an icon component. Unknown platforms fall
// back to Instagram so an admin-added link still renders something sensible.
const SOCIAL_ICONS = {
  instagram: FiInstagram,
  whatsapp: FaWhatsapp,
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  x: FaXTwitter,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
};

// Fallbacks mirror the seed so the footer never renders empty.
const FALLBACK_FOOTER = [
  { label: "Company", children: [
    { label: "About Us", url: "#about", linkType: "anchor" },
    { label: "Our Menu", url: "#menu", linkType: "anchor" },
  ] },
  { label: "Support", children: [
    { label: "FAQ", url: "#faq", linkType: "anchor" },
    { label: "Contact", url: "#contact", linkType: "anchor" },
  ] },
];

const FALLBACK_SOCIALS = [
  { platform: "instagram", icon: "instagram", url: "https://www.instagram.com/fit_bite1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
  { platform: "whatsapp", icon: "whatsapp", url: "https://wa.me/918089839740" },
];

function linkHref(link) {
  return link.url || "#";
}

export default function Footer() {
  const { menus, socialLinks } = useSite();

  const logo = useSetting("logo", "/logo.png");
  const tagline = useSetting(
    "tagline",
    "Chef-crafted nutrition delivered daily. Fuel your performance, support your wellness, simplify your life."
  );
  const phoneDisplay = useSetting("phoneDisplay", "+91 80898 39740");
  const phoneRaw = useSetting("phoneRaw", "918089839740");
  const email = useSetting("email", "hello@fitbite.in");
  const locationShort = useSetting("locationShort", "Kozhikode, Kerala");

  const columns = menus.footer && menus.footer.length ? menus.footer : FALLBACK_FOOTER;
  const socials = socialLinks && socialLinks.length ? socialLinks : FALLBACK_SOCIALS;

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
                <img src={logo} alt="Fitbite" className="nav-logo-img" />
              </a>
            </motion.div>
            <p className="footer-tagline">{tagline}</p>
            <div className="footer-social">
              {socials.map((s, i) => {
                const Icon = SOCIAL_ICONS[s.icon] || SOCIAL_ICONS[s.platform] || FiInstagram;
                const label = s.platform || s.icon || "Social";
                return (
                  <motion.a
                    key={s._id || s.id || `${label}-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                    whileHover={{ y: -2 }}
                    aria-label={label}
                  >
                    <Icon />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {columns.map((col, ci) => (
            <div className="footer-col" key={col._id || col.id || `${col.label}-${ci}`}>
              <h4>{col.label}</h4>
              <ul>
                {(col.children || []).map((link, li) => (
                  <li key={link._id || link.id || `${link.label}-${li}`}>
                    {link.linkType === "external" ? (
                      <a href={linkHref(link)} target={link.target || "_blank"} rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <a href={linkHref(link)}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:+${phoneRaw}`}>{phoneDisplay}</a></li>
              <li><a href={`mailto:${email}`}>{email}</a></li>
              <li><span style={{ color: "var(--text-muted)", fontSize: 14 }}>{locationShort}</span></li>
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
