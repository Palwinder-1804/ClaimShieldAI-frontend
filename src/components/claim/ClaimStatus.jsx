import React, { useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import Loader from "../common/Loader";
import { CheckCircle2, AlertTriangle, FileSearch, Shield, Activity, ShieldCheck, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

const ClaimStatus = ({ claimId, onComplete }) => {
  const [status, setStatus] = useState("pending"); // pending, processing, done, failed
  const [decision, setDecision] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    const pollStatus = async () => {
      try {
        const response = await apiClient.get(`/claims/${claimId}/status`);
        const data = response.data;
        setStatus(data.status);
        setDecision(data.decision);

        if (data.status === "done" || data.status === "failed") {
          clearInterval(intervalId);
          if (onComplete) {
            onComplete(data.status);
          }
        }
      } catch (err) {
        setError("Error checking claim status.");
        clearInterval(intervalId);
      }
    };

    pollStatus();
    intervalId = setInterval(pollStatus, 3000);

    return () => clearInterval(intervalId);
  }, [claimId, onComplete]);

  const steps = [
    { label: "Ingestion", icon: UploadCloud, color: "text-aurora-cyan border-aurora-cyan shadow-glowCyan" },
    { label: "AI OCR", icon: FileSearch, color: "text-aurora-purple border-aurora-purple shadow-[0_0_15px_rgba(138,43,226,0.6)]" },
    { label: "PII & RAG", icon: Shield, color: "text-aurora-blue border-aurora-blue shadow-[0_0_15px_rgba(0,119,255,0.6)]" },
    { label: "Fraud Check", icon: Activity, color: "text-rose-400 border-rose-400 shadow-[0_0_15px_rgba(251,113,133,0.6)]" },
    { label: "Decision", icon: ShieldCheck, color: "text-emerald-400 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]" }
  ];

  const getActiveStep = () => {
    if (status === "pending") return 0;
    if (status === "processing") return 2; 
    if (status === "done") return 5;
    return -1; 
  };

  const activeStep = getActiveStep();

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl w-full mx-auto space-y-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora-animated opacity-10 pointer-events-none" />

      <div className="text-center space-y-2 relative z-10">
        <h3 className="text-xl font-display font-bold text-white tracking-wide">Claims Processing Pipeline</h3>
        <p className="text-xs text-aurora-cyan font-mono bg-aurora-cyan/10 border border-aurora-cyan/20 inline-block px-3 py-1 rounded-full">ID: {claimId}</p>
      </div>

      {status !== "done" && status !== "failed" && (
        <div className="relative z-10">
          <Loader message={`Status: ${status.toUpperCase()}...`} size="md" />
        </div>
      )}

      {/* Horizontal Stepper Display */}
      <div className="relative flex justify-between items-center z-10 py-4 max-w-3xl mx-auto overflow-x-auto sm:overflow-visible pb-6 sm:pb-4 scrollbar-hide">
        {/* Connection Line */}
        <div className="absolute top-10 left-[5%] right-[5%] h-1 bg-white/5 rounded-full z-0 hidden sm:block" />
        
        {steps.map((step, idx) => {
          let stepState = "incoming";
          if (status === "failed") stepState = "failed";
          else if (activeStep > idx) stepState = "completed";
          else if (activeStep === idx || (status === "processing" && idx < 4 && idx >= 1)) stepState = "active";

          const IconComponent = step.icon;
          const isActiveOrDone = stepState === "completed" || stepState === "active";

          return (
            <motion.div 
              key={idx} 
              className="relative flex flex-col items-center flex-shrink-0 w-20 sm:w-28 group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* Node */}
              <div
                className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 z-10 bg-aurora-bg/80 backdrop-blur-md ${
                  stepState === "completed"
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                    : stepState === "active"
                    ? `${step.color} animate-pulse bg-white/10`
                    : stepState === "failed"
                    ? "bg-rose-500/20 border-rose-500 text-rose-400"
                    : "bg-white/5 border-white/10 text-slate-500"
                }`}
              >
                {stepState === "completed" ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : stepState === "failed" ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <IconComponent className="h-6 w-6" />
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-4 text-center space-y-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider block ${isActiveOrDone ? 'text-white' : 'text-slate-500'}`}>
                  Step {idx + 1}
                </span>
                <p className={`text-xs sm:text-sm font-semibold transition-colors leading-tight ${
                    isActiveOrDone ? "text-white" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {status === "done" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center space-y-2 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
        >
          <p className="text-emerald-400 text-base font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="h-6 w-6" />
            Claim Successfully Processed
          </p>
          {decision && (
            <p className="text-sm text-slate-300">
              Final Recommendation: <span className="uppercase font-black text-white ml-1">{decision}</span>
            </p>
          )}
        </motion.div>
      )}

      {status === "failed" && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-center space-y-2 relative z-10"
        >
          <p className="text-rose-400 text-base font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6" />
            Pipeline Failure
          </p>
          <p className="text-xs text-slate-300">Permanent failure occurred. Administrator notified via DLQ.</p>
        </motion.div>
      )}
    </div>
  );
};

export default ClaimStatus;

