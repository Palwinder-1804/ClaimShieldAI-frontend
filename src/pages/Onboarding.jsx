import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Shield, Sparkles, User, ArrowRight, AlertCircle } from "lucide-react";

const Onboarding = () => {
  const { user, onboard, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    clearError();
    if (user) {
      setFullName(user.full_name || "");
      if (user.is_onboarded) {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [user, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim()) {
      setValidationError("Please enter your name to complete onboarding.");
      return;
    }

    const res = await onboard(fullName);
    if (res.success) {
      navigate("/dashboard", { replace: true });
    }
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-insurance-mist p-4 sm:p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-insurance-mesh pointer-events-none z-0" />
      <div className="absolute top-[10%] left-[20%] w-72 h-72 blob-blue opacity-40 pointer-events-none rounded-full blur-3xl" />

      <motion.div 
        className="relative w-full max-w-md space-y-6 glass-panel p-6 sm:p-8 rounded-3xl z-10 glow-card-blue"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <motion.div 
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-insurance-navy to-insurance-blue text-white shadow-btn"
            whileHover={{ scale: 1.1, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <div>
            <h2 className="font-display text-2xl text-insurance-navy">Initialize Profile</h2>
            <p className="text-slate-500 text-sm mt-1">Complete your profile for ClaimShield</p>
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-500" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Palwinder Singh"
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-slate-800 text-sm placeholder-slate-400 outline-none focus:border-insurance-blue focus:ring-2 focus:ring-insurance-blue/20 transition"
              />
            </div>
          </div>

          {validationError && (
            <motion.div 
              className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/20 border border-red-900/40 p-3 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{validationError}</span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              className="flex items-center gap-1.5 text-red-400 text-xs font-semibold bg-red-950/20 border border-red-900/40 p-3 rounded-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="h-4 w-4 text-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Enter Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Onboarding;
