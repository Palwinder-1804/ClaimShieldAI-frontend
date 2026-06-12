import React from "react";
import { Link } from "react-router-dom";
import NavLink from "./NavLink";
import { Shield, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-insurance-navy text-white relative z-10 mt-auto">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 border-b border-white/10 pb-10 md:pb-12 mb-8 md:mb-10">
          <div className="sm:col-span-2 space-y-4">
            <NavLink to="/" className="flex items-center gap-2.5 w-fit">
              <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-insurance-gold" />
              </div>
              <span className="text-lg font-bold tracking-tight">
                ClaimShield<span className="text-insurance-gold font-normal">AI</span>
              </span>
            </NavLink>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Trusted insurance fraud detection and claim intelligence — protecting policyholders with AI-powered auditing.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Company</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/about" className="hover:text-insurance-gold transition">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-insurance-gold transition">FAQ</Link></li>
              <li><NavLink to="/#workflow" className="hover:text-insurance-gold transition">How It Works</NavLink></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Product</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/dashboard" className="hover:text-insurance-gold transition">Dashboard</Link></li>
              <li><Link to="/policy-chat" className="hover:text-insurance-gold transition">Policy Chat</Link></li>
              <li><NavLink to="/#features" className="hover:text-insurance-gold transition">Features</NavLink></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white">Get Started</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link to="/register" className="hover:text-insurance-gold transition">Start Free Trial</Link></li>
              <li><Link to="/login" className="hover:text-insurance-gold transition">Sign In</Link></li>
              <li><NavLink to="/" className="hover:text-insurance-gold transition">Back to Home</NavLink></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-10">
          {["SOC2 Ready", "GDPR Compliant", "ISO 27001", "HIPAA Compatible"].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 border border-white/15 px-4 py-2 rounded-lg bg-white/5"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-insurance-gold" />
              {badge}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400 pt-2">
          <span>&copy; {new Date().getFullYear()} ClaimShield AI Inc. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-insurance-gold transition">Twitter</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-insurance-gold transition">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-insurance-gold transition">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
