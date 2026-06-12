import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import { Shield, LogOut, MessageSquare, LayoutDashboard, Menu, X } from "lucide-react";

const AUTH_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/policy-chat", label: "Policy Chat", icon: MessageSquare },
];

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  if (!user) return null;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-aurora-bg/80 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "bg-aurora-bg/50 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
          <Link to="/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-aurora-purple to-aurora-cyan flex items-center justify-center shadow-glowCyan group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white tracking-tight hidden sm:block">
              ClaimShield<span className="text-aurora-cyan font-normal">AI</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {AUTH_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg transition ${
                  isActive(to)
                    ? "bg-white/10 text-white shadow-glass"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* User + logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-white leading-tight">{user.full_name}</p>
              <p className="text-xs text-slate-400 flex items-center justify-end gap-1">
                {user.role === "admin" && (
                  <span className="bg-aurora-cyan/20 text-aurora-cyan border border-aurora-cyan/30 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                    Admin
                  </span>
                )}
                {user.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl border border-white/10 text-slate-400 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition"
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
            className="md:hidden overflow-hidden border-t border-white/10 bg-aurora-bg/95 backdrop-blur-xl"
          >
            <div className="container-main py-4 space-y-3">
              {AUTH_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive(to) ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10">
                <p className="px-4 text-sm font-semibold text-white">{user.full_name}</p>
                <p className="px-4 text-xs text-slate-400 mb-3">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
