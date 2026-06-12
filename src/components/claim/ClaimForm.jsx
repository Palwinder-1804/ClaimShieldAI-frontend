import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useClaimStore } from "../../store/claimStore";
import DocumentUploader from "../upload/DocumentUploader";
import { Send, Sparkles, CheckCircle2, ShieldAlert, Cpu, Database, FileText } from "lucide-react";

const ClaimForm = ({ onSuccess }) => {
  const { submitClaim, isLoading, error, clearError } = useClaimStore();
  const [claimType, setClaimType] = useState("health");
  const [documents, setDocuments] = useState([]);
  const [validationError, setValidationError] = useState(null);
  
  // AI scanning stages tracker
  const [scanStage, setScanStage] = useState(0); // 0: Idle, 1: Uploading, 2: OCR, 3: PII, 4: RAG, 5: Finished
  const stages = [
    { label: "Securing document upload to MinIO...", icon: FileText, color: "text-indigo-400" },
    { label: "Executing GPT-4o Vision OCR text extraction...", icon: Cpu, color: "text-purple-400" },
    { label: "Executing PII compliance scrubbing checks...", icon: ShieldAlert, color: "text-cyan-400" },
    { label: "Cross-examining Qdrant policy indexes...", icon: Database, color: "text-emerald-400" },
    { label: "Claims audit pipeline execution complete!", icon: CheckCircle2, color: "text-green-400" }
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      setScanStage(1);
      // Simulate stages progression for UI wow-factor while backend executes
      interval = setInterval(() => {
        setScanStage((prev) => {
          if (prev < 4) return prev + 1;
          return prev;
        });
      }, 2000);
    } else {
      setScanStage(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (documents.length === 0) {
      setValidationError("Please upload at least one supporting document.");
      return;
    }

    const claim = await submitClaim(claimType, documents);
    if (claim) {
      // Fire premium success confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#1A6BB5", "#0E8C8C", "#C9A227", "#10B981"]
      });
      
      if (onSuccess) {
        onSuccess(claim.id);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-6 rounded-3xl relative overflow-hidden glow-card-blue">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles className="h-24 w-24 text-insurance-blue" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-insurance-navy flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-insurance-gold" />
            File New Audit Claim
          </h3>
          <p className="text-xs text-slate-500">Initiate compliance scans and XGBoost anomaly evaluations.</p>
        </div>
        
        {/* Claim Type Input */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Coverage Type</label>
          <select
            value={claimType}
            onChange={(e) => setClaimType(e.target.value)}
            disabled={isLoading}
            className="w-full bg-slate-950 border border-slate-900 rounded-2xl px-4 py-3 text-slate-200 outline-none focus:border-indigo-500 text-xs font-semibold tracking-wide transition-all duration-300"
          >
            <option value="health">Health Insurance Coverage</option>
            <option value="motor">Motor/Auto Claims Insurance</option>
            <option value="life">Life Benefit Insurance</option>
            <option value="property">Real-Estate / Property Insurance</option>
          </select>
        </div>

        {/* Document Uploader Zone */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">Supporting Claims Documents</label>
          <DocumentUploader onUploadComplete={(paths) => setDocuments(paths)} />
        </div>

        {/* Submission Feedback & Errors */}
        {validationError && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/20 border border-red-900/40 p-3.5 rounded-2xl">
            <ShieldAlert className="h-4 w-4" />
            <span>{validationError}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/20 border border-red-900/40 p-3.5 rounded-2xl">
            <ShieldAlert className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Scanning progress visualization panel */}
        <AnimatePresence>
          {isLoading && scanStage > 0 && (
            <motion.div 
              className="bg-slate-950/80 p-5 rounded-2xl border border-slate-900 space-y-4 shadow-inner"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <span className="h-2 w-2 bg-indigo-500 rounded-full animate-ping"></span>
                AI Pipeline Auditing Stages
              </h4>
              
              <div className="space-y-2.5">
                {stages.map((stage, sIdx) => {
                  const StageIcon = stage.icon;
                  const active = scanStage >= sIdx + 1;
                  const current = scanStage === sIdx + 1;
                  return (
                    <div 
                      key={sIdx} 
                      className={`flex items-center gap-3 text-xs transition duration-300 ${
                        active ? "text-slate-350" : "text-slate-700"
                      }`}
                    >
                      <div className={`h-6 w-6 rounded-lg flex items-center justify-center border transition ${
                        active 
                          ? current ? "border-indigo-500/40 bg-indigo-950/20" : "border-emerald-500/30 bg-emerald-950/20"
                          : "border-slate-900 bg-slate-950/20"
                      }`}>
                        {active && !current ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <StageIcon className={`h-3.5 w-3.5 ${active ? stage.color : "text-slate-700"}`} />
                        )}
                      </div>
                      <span className={current ? "font-bold text-slate-100" : ""}>{stage.label}</span>
                      {current && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-2xl disabled:bg-indigo-700/50 disabled:text-slate-400 shadow-lg shadow-indigo-600/10 transition-all duration-300"
        >
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Auditing claims dossier...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Initiate Audit</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ClaimForm;
