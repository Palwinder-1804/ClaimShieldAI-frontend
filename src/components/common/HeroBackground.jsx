import React from "react";
import { motion } from "framer-motion";
import { Shield, FileCheck, Lock } from "lucide-react";

const FloatingIcon = ({ icon: Icon, className, delay = 0, duration = 8 }) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    animate={{ y: [0, -18, 0], rotate: [0, 6, -6, 0], opacity: [0.15, 0.4, 0.15] }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <Icon className="h-8 w-8 md:h-10 md:w-10 text-aurora-cyan/40 drop-shadow-[0_0_10px_rgba(0,240,255,0.4)]" strokeWidth={1.25} />
  </motion.div>
);

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-aurora-cyan/10 via-aurora-bg to-aurora-bg" />

      {/* Animated grid */}
      <div className="absolute inset-0 bg-hero-pattern opacity-40" />
      <motion.div
        className="absolute inset-0 bg-hero-pattern opacity-20"
        style={{ backgroundSize: "48px 48px" }}
        animate={{ backgroundPosition: ["0px 0px", "48px 48px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-aurora-cyan/10 blur-3xl"
        animate={{ scale: [1, 1.12, 1], x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -left-32 w-[360px] h-[360px] rounded-full bg-aurora-purple/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[280px] h-[280px] rounded-full bg-aurora-blue/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Radial rings */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,700px)] h-[min(90vw,700px)] rounded-full border border-aurora-cyan/5"
        animate={{ scale: [0.85, 1.05, 0.85], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(70vw,520px)] h-[min(70vw,520px)] rounded-full border border-aurora-purple/10 shadow-[0_0_50px_rgba(138,43,226,0.1)_inset]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {/* Floating insurance icons */}
      <FloatingIcon icon={Shield} className="top-[18%] left-[8%] md:left-[12%]" delay={0} />
      <FloatingIcon icon={FileCheck} className="top-[28%] right-[10%] md:right-[14%]" delay={1.5} duration={9} />
      <FloatingIcon icon={Lock} className="bottom-[30%] left-[15%] md:left-[20%]" delay={3} duration={10} />
      <FloatingIcon icon={Shield} className="bottom-[22%] right-[12%] md:right-[18%]" delay={2} duration={11} />

      {/* Shimmer line */}
      <motion.div
        className="absolute top-[45%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-aurora-cyan/30 to-transparent"
        animate={{ opacity: [0.2, 0.6, 0.2], scaleX: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-aurora-bg to-transparent" />
    </div>
  );
};

export default HeroBackground;
