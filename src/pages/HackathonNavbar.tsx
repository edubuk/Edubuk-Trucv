import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "Why TruCV", href: "#why-trucv" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For teams", href: "#use-cases" },
];

const HackathonNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`hack-nav ${scrolled ? "hack-nav--scrolled" : ""}`}
    >
      <div className="hack-container hack-nav__inner">
        <Link to="/hackathon-home" className="hack-brand" aria-label="TruCV home">
          <span className="hack-brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="hack-brand__wordmark">Tru<span>CV</span></span>
          <span className="hack-brand__tag">ONCHAIN</span>
        </Link>

        <nav className="hack-nav__links" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className="hack-nav__actions">
          <Link to="/login" className="hack-nav__login">Sign in</Link>
          <Link to="/create-cv" className="hack-btn hack-btn--small">
            Create your TruCV <ArrowUpRight size={16} />
          </Link>
        </div>

        <button
          type="button"
          className="hack-nav__menu"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="hack-nav__mobile"
          >
            <div className="hack-container">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>
              ))}
              <Link to="/login" onClick={closeMenu}>Sign in</Link>
              <Link to="/create-cv" className="hack-btn" onClick={closeMenu}>
                Create your TruCV <ArrowUpRight size={17} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default HackathonNavbar;
