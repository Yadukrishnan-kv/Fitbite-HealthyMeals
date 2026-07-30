import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import { useSite, useSetting } from "../context/SiteContext";
import "../styles/navbar.css";

// Fallback header menu (mirrors the seed) so the bar renders instantly and
// still works if the API is unavailable. The DB is the source of truth.
const FALLBACK_LINKS = [
  { label: "Menu", url: "/dishes", linkType: "internal", target: "_self" },
  { label: "Why Us", url: "#why", linkType: "anchor", target: "_self" },
  { label: "Process", url: "#process", linkType: "anchor", target: "_self" },
  { label: "Reviews", url: "#testimonials", linkType: "anchor", target: "_self" },
  { label: "FAQ", url: "#faq", linkType: "anchor", target: "_self" },
  { label: "Contact", url: "#contact", linkType: "anchor", target: "_self" },
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { menus } = useSite();
  const logo = useSetting("logo", "/logo.png");
  const links = menus.header && menus.header.length ? menus.header : FALLBACK_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (e, url) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = url.replace("#", "");
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  // Render one menu entry honoring its linkType/target. Internal links use the
  // router; anchors smooth-scroll; external links open per their target.
  const renderLink = (link, className, extra = {}) => {
    if (link.linkType === "internal") {
      return (
        <Link to={link.url} className={className} onClick={() => setMobileOpen(false)} {...extra}>
          {link.label}
        </Link>
      );
    }
    if (link.linkType === "external") {
      return (
        <a
          href={link.url}
          className={className}
          target={link.target || "_self"}
          rel={link.target === "_blank" ? "noopener noreferrer" : undefined}
          onClick={() => setMobileOpen(false)}
          {...extra}
        >
          {link.label}
        </a>
      );
    }
    // anchor (same-page scroll)
    return (
      <a href={link.url} className={className} onClick={(e) => handleAnchorClick(e, link.url)} {...extra}>
        {link.label}
      </a>
    );
  };

  const keyFor = (link, i) => link._id || link.id || `${link.label}-${i}`;

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" onClick={() => { setMobileOpen(false); window.scrollTo(0, 0); }}>
              <motion.img
                src={logo}
                alt="Fitbite"
                className="nav-logo-img"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
            </Link>

            <ul className="nav-links">
              {links.map((link, i) => (
                <motion.li
                  key={keyFor(link, i)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {renderLink(link)}
                </motion.li>
              ))}
            </ul>

            <motion.button
              className="nav-cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");
                  setTimeout(() => scrollToSection("contact"), 100);
                } else {
                  scrollToSection("contact");
                }
              }}
            >
              Order Now
            </motion.button>

            <button
              className={`hamburger${mobileOpen ? " hidden" : ""}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <HiX />
            </button>
            {links.map((link, i) =>
              link.linkType === "internal" ? (
                <Link
                  key={keyFor(link, i)}
                  to={link.url}
                  onClick={() => setMobileOpen(false)}
                  className="mobile-link"
                >
                  {link.label}
                </Link>
              ) : (
                <motion.div
                  key={keyFor(link, i)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {renderLink(link, "mobile-link")}
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
