import React from "react";
import { motion } from "framer-motion";
import PublicNavbar from "../components/common/PublicNavbar";
import Footer from "../components/common/Footer";
import { Sparkles, Heart, Rocket, Cpu, Database, Network, KeyRound } from "lucide-react";

const About = () => {
  const values = [
    { title: "Our Mission", desc: "To automate claims auditing with zero-trust AI architectures, protecting honest policyholders and detecting anomaly signatures globally.", icon: Rocket, color: "text-insurance-blue bg-insurance-sky border-insurance-blue/20" },
    { title: "Our Vision", desc: "A world where insurance claims are settled securely and instantly, backed by transparent audit logs and verifiable decisions.", icon: Sparkles, color: "text-insurance-teal bg-teal-50 border-insurance-teal/20" },
    { title: "Commitment to Trust", desc: "We adhere strictly to zero-storage guidelines for masked PII data, building integrity directly into the core pipeline.", icon: Heart, color: "text-insurance-gold bg-amber-50 border-insurance-gold/20" },
  ];

  const techStack = [
    { name: "FastAPI Backend", desc: "High-performance Python API gateway running fully asynchronous database pipelines.", icon: Cpu },
    { name: "React Frontend", desc: "A sleek, responsive interface constructed with modular state managers and charts.", icon: Network },
    { name: "Supabase & Postgres", desc: "Relational database modeling user records, claim indices, and audit trails.", icon: Database },
    { name: "MinIO & Qdrant RAG", desc: "S3 object storage matched with vector database collections for hybrid retrieval.", icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-insurance-mist font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-insurance-mesh pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 blob-blue opacity-40 pointer-events-none rounded-full blur-3xl" />

      <PublicNavbar />

      <main className="relative z-10 container-main section-padding flex-grow w-full">
        <motion.div
          className="text-center space-y-4 mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl md:text-5xl text-insurance-navy leading-tight">About ClaimShield AI</h1>
          <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Redefining insurance compliance, document parsing, and fraud auditing with state-of-the-art machine learning and semantic search.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                className="glass-card p-6 md:p-8 rounded-2xl space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${val.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-insurance-navy">{val.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="glass-card p-8 md:p-10 rounded-3xl space-y-4 mb-16 md:mb-20 border-l-4 border-l-insurance-gold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-bold text-insurance-navy font-display">The ClaimShield Story</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-display italic">
            &ldquo;Founded in 2025 by a team of insurance auditors and machine learning engineers, ClaimShield AI was built to solve the latency and leakages in traditional claims validation. By combining advanced natural language processing with scalable semantic index searches, we provide claims handlers with a unified, secure dashboard to verify, query, and flag documents safely.&rdquo;
          </p>
        </motion.div>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="font-display text-2xl text-insurance-navy">Our Technology Stack</h3>
            <p className="text-sm text-slate-500">Engineered with speed, safety, and scalability in mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {techStack.map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <motion.div
                  key={idx}
                  className="flex gap-4 p-5 md:p-6 glass-card rounded-2xl items-start"
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -12 : 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="h-11 w-11 rounded-xl bg-insurance-sky border border-insurance-blue/15 flex items-center justify-center text-insurance-blue flex-shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-insurance-navy">{tech.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{tech.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
