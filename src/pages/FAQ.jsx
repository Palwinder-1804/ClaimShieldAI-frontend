import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PublicNavbar from "../components/common/PublicNavbar";
import Footer from "../components/common/Footer";
import { HelpCircle, ChevronDown } from "lucide-react";

const FAQItem = ({ question, answer, idx }) => {
  const [isOpen, setIsOpen] = useState(idx === 0);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left text-sm md:text-base font-semibold text-insurance-navy select-none outline-none hover:bg-insurance-sky/30 transition"
      >
        <span className="pr-4">{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="h-5 w-5 text-insurance-blue flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      q: "What is ClaimShield AI?",
      a: "ClaimShield AI is a cloud-native insurance fraud detection and policy-grounded analysis platform. It enables insurance providers, auditors, and claims analysts to upload invoices or documents, run automatic OCR, mask sensitive PII details, index references, and query specific details using RAG models.",
    },
    {
      q: "How does the fraud detection engine work?",
      a: "The fraud detection engine evaluates submitted document features through a hybrid pipeline. It utilizes pre-trained machine learning models (XGBoost Classifier and Isolation Forest) for statistical anomaly detection, matched against rule-based heuristic check bounds.",
    },
    {
      q: "How does ClaimShield safeguard data privacy?",
      a: "Privacy is built directly into our codebase. Every uploaded document is passed through an automatic PII Masker that anonymizes names, emails, phone numbers, credit cards, and SSNs. Queries sent to core LLM assistants never contain original sensitive identifiers.",
    },
    {
      q: "What types of insurance policy files are supported?",
      a: "We support digital and scanned PDF formats, as well as typical image invoices (PNG, JPEG, TIFF). Digital PDFs undergo instant digital text extraction, while scanned files are converted to high-resolution images and run through GPT-4o Vision OCR.",
    },
    {
      q: "How can I start using ClaimShield AI?",
      a: "You can create a new account by registering on the platform. After email confirmation or via Google OAuth authentication, you will complete a profile onboarding stage and enter your claims console dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-insurance-mist font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-insurance-mesh pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 blob-teal opacity-40 pointer-events-none rounded-full blur-3xl" />

      <PublicNavbar />

      <main className="relative z-10 container-main section-padding flex-grow w-full max-w-3xl">
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-14 w-14 rounded-2xl bg-insurance-sky border border-insurance-blue/20 flex items-center justify-center mx-auto">
            <HelpCircle className="h-7 w-7 text-insurance-blue" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-insurance-navy">Frequently Asked Questions</h1>
          <p className="text-slate-600 text-sm md:text-base max-w-lg mx-auto">
            Everything you need to know about our AI auditing models, OCR parser, PII scrubbers, and data policies.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <FAQItem question={faq.q} answer={faq.a} idx={idx} />
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
