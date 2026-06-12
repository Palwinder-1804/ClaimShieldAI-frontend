import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useHashScroll } from "../hooks/useHashScroll";
import PublicNavbar from "../components/common/PublicNavbar";
import Footer from "../components/common/Footer";
import HeroBackground from "../components/common/HeroBackground";
import NavLink from "../components/common/NavLink";
import {
  Shield, UploadCloud, FileSearch, ShieldCheck,
  Cpu, Activity, Database, AlertCircle, ArrowRight,
  CheckCircle2, Play, TrendingUp,
} from "lucide-react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const HeroFlowAnimation = () => {
  const nodes = [
    { label: "Document Ingestion", icon: UploadCloud, color: "text-aurora-cyan border-white/10 bg-white/5" },
    { label: "AI OCR Parsing", icon: FileSearch, color: "text-aurora-purple border-white/10 bg-white/5" },
    { label: "PII Masking & RAG", icon: Shield, color: "text-aurora-blue border-white/10 bg-white/5" },
    { label: "Fraud Analytics", icon: Activity, color: "text-rose-400 border-rose-400/20 bg-rose-400/5" },
    { label: "Decision Engine", icon: ShieldCheck, color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" },
  ];

  return (
    <div className="relative w-full max-w-5xl mx-auto py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">
      <div className="absolute top-[3rem] md:top-[4rem] left-[8%] right-[8%] h-0.5 bg-gradient-to-r from-aurora-cyan/20 via-aurora-purple/40 to-emerald-400/40 hidden md:block z-0 rounded-full overflow-hidden">
        <motion.div
          className="h-full w-1/4 bg-gradient-to-r from-aurora-cyan to-aurora-purple rounded-full shadow-glowCyan"
          animate={{ x: ["0%", "300%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
        />
      </div>

      {nodes.map((node, index) => {
        const IconComponent = node.icon;
        return (
          <motion.div
            key={index}
            className="relative flex flex-col items-center z-10 w-full md:w-44 text-center group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.7 }}
          >
            <div className={`h-16 w-16 md:h-20 md:w-20 rounded-3xl border flex items-center justify-center shadow-glass transition-all duration-300 group-hover:scale-110 group-hover:shadow-glowCyan ${node.color} backdrop-blur-xl`}>
              <IconComponent className="h-7 w-7 md:h-8 md:w-8" />
            </div>
            <div className="mt-4 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md group-hover:border-aurora-cyan/30 transition-colors">
              <h4 className="text-sm font-bold text-white tracking-wide">{node.label}</h4>
              <span className="text-[10px] font-semibold text-aurora-cyan uppercase mt-0.5 block">Step {index + 1}</span>
            </div>
            {index < nodes.length - 1 && (
              <div className="md:hidden mt-4 text-aurora-cyan/40 animate-bounce text-xl">↓</div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

const Landing = () => {
  const { isAuthenticated } = useAuthStore();
  const timelineRef = useRef(null);
  useHashScroll();

  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start end", "end start"] });
  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  const features = [
    { title: "Fraud Detection Engine", desc: "XGBoost and Isolation Forest models evaluate audit features in real-time.", icon: Activity, class: "glass-card" },
    { title: "OCR Document Intelligence", desc: "Digital extraction and GPT-4o Vision OCR parse scanned claims verbatim.", icon: FileSearch, class: "glass-card-purple" },
    { title: "Policy AI Assistant", desc: "Dossier-grounded RAG answers complex policy coverage and exclusion questions.", icon: Cpu, class: "glass-card" },
    { title: "Risk Assessment", desc: "Dynamic risk scoring based on historical clusters and statistical limits.", icon: Shield, class: "glass-card-purple" },
    { title: "Claim Analytics", desc: "Visualize audits, approval ratios, and claim trends in intuitive dashboards.", icon: Database, class: "glass-card" },
    { title: "Audit Trail Logging", desc: "Full logging of user submissions, pipeline status, and final decisions.", icon: ShieldCheck, class: "glass-card-purple" },
    { title: "Compliance Monitoring", desc: "PII masking scrubs personal identifiers automatically before LLM dispatch.", icon: AlertCircle, class: "glass-card" },
    { title: "Real-Time Alerts", desc: "Webhook alerts and immediate status updates keep administrators informed.", icon: CheckCircle2, class: "glass-card-purple" },
  ];

  const testimonials = [
    { quote: "ClaimShield reduced our claim audit times from 4 days to 5 minutes. The AI OCR accuracy is unmatched.", name: "Sarah Jenkins", role: "Auditing Director, Apex Mutual" },
    { quote: "The policy grounded chat has completely changed how our claims processors verify exclusion clauses.", name: "Marcus Thorne", role: "Principal Claims Analyst" },
    { quote: "Integrates perfectly with our document servers. The fraud scores are highly reliable.", name: "David Chen", role: "Lead Systems Engineer, ShieldCorp" },
  ];

  return (
    <motion.div 
      className="min-h-screen bg-aurora-bg font-sans flex flex-col relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Aurora Mesh Overlay for entire page */}
      <div className="absolute inset-0 bg-aurora-animated opacity-[0.03] pointer-events-none z-0" />
      
      <PublicNavbar />

      {/* Hero */}
      <section id="home" className="section-anchor relative overflow-hidden">
        <HeroBackground />
        <div className="container-main pt-24 pb-8 md:pt-32 md:pb-10 relative z-10 flex flex-col items-center text-center">
          <motion.div
            className="space-y-4 md:space-y-5 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-aurora-cyan px-4 py-2 rounded-full text-xs font-semibold shadow-glass backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              Trusted Enterprise Claim Auditing
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] text-white leading-[1.1] tracking-tight px-2 drop-shadow-lg">
              AI-Powered Insurance{" "}
              <span className="text-gradient-aurora italic">Fraud Detection</span>
            </h1>
            <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
              Reduce fraud, automate claim reviews, and accelerate insurance decisions with advanced AI and compliance auditing.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mt-6 md:mt-8 w-full sm:w-auto max-w-md sm:max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="btn-primary py-3.5 px-8 text-sm flex items-center justify-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <NavLink
              to="/#workflow"
              className="btn-secondary py-3.5 px-8 text-sm flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 text-aurora-cyan" />
              Watch Demo
            </NavLink>
          </motion.div>

          <motion.div
            className="w-full mt-8 md:mt-12 glass-card rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <HeroFlowAnimation />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section-anchor container-main section-padding">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <span className="text-xs font-bold text-aurora-cyan uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">Platform Capabilities</span>
          <h2 className="font-display text-3xl md:text-4xl text-white">Advanced Claims Intelligence</h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Multi-layered auditing that analyzes policies, masks identifiers, and evaluates anomalies concurrently.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                className={`${feat.class} p-6 md:p-8 rounded-3xl space-y-4`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-aurora-cyan border border-white/10 shadow-glass">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" ref={timelineRef} className="section-anchor relative">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl z-0" />
        <div className="container-main section-padding relative z-10">
          <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
            <span className="text-xs font-bold text-aurora-purple uppercase tracking-widest drop-shadow-[0_0_8px_rgba(138,43,226,0.5)]">Workflow Pipeline</span>
            <h2 className="font-display text-3xl md:text-4xl text-white">How ClaimShield AI Works</h2>
          </div>

          <div className="relative border-l-2 border-white/10 ml-3 sm:ml-6 md:ml-12 lg:ml-16 space-y-10 md:space-y-14 max-w-3xl">
            <motion.div
              style={{ scaleY: pathLength }}
              className="absolute left-[-2px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-aurora-cyan to-aurora-purple origin-top shadow-glowCyan"
            />
            {[
              { step: "Upload Documents", text: "Users upload claim invoices, coverage forms, or incident reports securely in PDF or image format." },
              { step: "AI Verification & Parsing", text: "GPT-4o Vision OCR extracts core parameters. PII masking automatically anonymizes personal identifiers." },
              { step: "RAG & Fraud Scoring", text: "Qdrant retrieves policy clauses. XGBoost and Isolation Forest models compute risk anomaly levels." },
              { step: "Audit Trail Decision", text: "Auditors receive a detailed report highlighting risk flags, matched policy clauses, and recommendations." },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-8 md:pl-12 group"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
              >
                <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-aurora-bg border-2 border-aurora-cyan group-hover:bg-aurora-cyan group-hover:shadow-glowCyan transition-all duration-300 z-10" />
                <span className="text-[10px] font-bold text-aurora-cyan uppercase tracking-wider">Step {index + 1}</span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1 group-hover:text-aurora-cyan transition-colors">{item.step}</h3>
                <p className="text-sm md:text-base text-slate-400 leading-relaxed mt-2 max-w-xl">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-main section-padding">
        <div className="glass-panel rounded-3xl p-8 md:p-14 lg:p-16 border-aurora-blue/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-aurora-animated opacity-20 pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center relative z-10">
            {[
              { val: "98%", label: "Fraud Detection Accuracy" },
              { val: "70%", label: "Faster Claim Processing" },
              { val: "500K+", label: "Claims Audited" },
              { val: "50+", label: "Insurance Partners" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                className="space-y-3"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-3xl sm:text-4xl md:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-br from-white to-aurora-cyan drop-shadow-md">{stat.val}</h3>
                <p className="text-[10px] sm:text-xs font-bold text-slate-300 uppercase tracking-widest leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-main section-padding">
        <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-16">
          <span className="text-xs font-bold text-aurora-cyan uppercase tracking-widest">Customer Reviews</span>
          <h2 className="font-display text-3xl md:text-4xl text-white">Trusted by Claims Auditors</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              className="glass-card p-8 md:p-10 rounded-3xl flex flex-col justify-between gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <p className="text-base text-slate-300 italic leading-relaxed font-display">
                &ldquo;{test.quote}&rdquo;
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-aurora-cyan shadow-glass shrink-0">
                  {test.name[0]}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{test.name}</h4>
                  <span className="text-xs text-slate-400 line-clamp-2">{test.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-main section-padding pt-0 md:pt-0">
        <motion.div
          className="rounded-3xl glass-card border-aurora-purple/30 p-10 md:p-16 lg:p-20 text-center space-y-6 md:space-y-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-aurora-animated opacity-10 pointer-events-none" />
          <TrendingUp className="h-12 w-12 text-aurora-cyan mx-auto relative z-10" />
          <h2 className="font-display text-3xl md:text-4xl text-white relative z-10">Ready to protect your claims pipeline?</h2>
          <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto leading-relaxed relative z-10">
            Join leading insurers using ClaimShield AI to detect fraud faster and settle claims with confidence.
          </p>
          <div className="relative z-10 pt-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"} className="btn-primary inline-flex items-center gap-2 py-4 px-10 text-sm">
              Get Started Today <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default Landing;
