import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";
import "../styles/navbar.css";

const links = [
  { to: "/dishes", label: "Menu" },
  { href: "#why", label: "Why Us" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const id = href.replace("#", "");
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div className="container">
          <div className="nav-inner">
            <Link to="/" className="nav-logo" onClick={() => setMobileOpen(false)}>
              <motion.img
                src="/logo.jpeg"
                alt="Fitbite"
                className="nav-logo-img"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              />
            </Link>

            <ul className="nav-links">
              {links.map((link, i) =>
                link.to ? (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link to={link.to}>{link.label}</Link>
                  </motion.li>
                ) : (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <a href={link.href} onClick={(e) => handleNavClick(e, link.href)}>
                      {link.label}
                    </a>
                  </motion.li>
                )
              )}
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
              link.to ? (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="mobile-link"
                >
                  {link.label}
                </Link>
              ) : (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="mobile-link"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {link.label}
                </motion.a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
