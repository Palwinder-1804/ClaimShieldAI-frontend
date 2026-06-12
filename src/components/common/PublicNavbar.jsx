import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import NavLink from "./NavLink";
import { parseNavTarget } from "../../utils/scrollToSection";
import { Shield, Menu, X, ArrowRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Features", to: "/#features" },
  { label: "How It Works", to: "/#workflow" },
  { label: "About", to: "/about" },
  { label: "FAQ", to: "/faq" },
];

const PublicNavbar = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const isActive = (to) => {
    const { path, hash } = parseNavTarget(to);
    if (hash) {
      return location.pathname === path && location.hash === `#${hash}`;
    }
    if (path === "/") {
      return location.pathname === "/" && !location.hash;
    }
    return location.pathname === path;
  };

  const closeMobile = () => setMobileOpen(false);

  const linkClass = (to) =>
    isActive(to)
      ? "nav-link-active"
      : "text-slate-300 hover:text-white hover:bg-white/10";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-aurora-bg/80 shadow-glass backdrop-blur-xl border-b border-white/10"
          : "bg-transparent backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-[5rem]">
          <NavLink to="/" className="flex items-center gap-2.5 group shrink-0" onNavigate={closeMobile}>
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-glass group-hover:scale-105 group-hover:border-aurora-cyan/50 transition-all duration-300">
              <Shield className="h-6 w-6 text-aurora-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight drop-shadow-md">
              ClaimShield<span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-blue font-bold">AI</span>
            </span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={`px-4 py-2 text-sm rounded-xl transition-all duration-300 ${linkClass(link.to)}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2">
                Enter Platform
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2.5 px-6">
                  Start Free Trial
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-200 hover:bg-white/10 transition"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-aurora-bg/95 backdrop-blur-2xl"
          >
            <nav className="container-main py-6 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={link.to}
                    onNavigate={closeMobile}
                    className={`block px-5 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? "bg-aurora-cyan/10 text-aurora-cyan border border-aurora-cyan/20"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={closeMobile}
                    className="btn-primary text-sm py-3.5 px-4 text-center flex items-center justify-center gap-2"
                  >
                    Enter Platform <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMobile} className="btn-secondary text-sm py-3.5 px-4 text-center">
                      Sign In
                    </Link>
                    <Link to="/register" onClick={closeMobile} className="btn-primary text-sm py-3.5 px-4 text-center">
                      Start Free Trial
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default PublicNavbar;
