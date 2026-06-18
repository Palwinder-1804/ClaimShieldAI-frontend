import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Shield, KeyRound, Mail, User, AlertCircle, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const Register = () => {
  const { register, error, clearError, isLoading } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    setSuccessMessage(null);

    if (!fullName || !email || !password || !confirmPassword) {
      setValidationError("Please fill in all input fields.");
      return;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    const result = await register(email, password, fullName);
    if (result.success) {
      setSuccessMessage("Registration successful! We have sent a verification link to your email.");
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  const inputClass =
    "glass-input !pl-12";

  return (
    <motion.div 
      className="flex min-h-screen items-center justify-center bg-aurora-bg p-4 sm:p-6 font-sans relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-aurora-animated opacity-20 pointer-events-none" />
      <div className="absolute top-[10%] right-[15%] w-72 h-72 bg-aurora-purple/10 opacity-40 pointer-events-none rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-aurora-cyan/10 opacity-30 pointer-events-none rounded-full blur-3xl" />

      <div className="absolute top-5 left-4 sm:left-6 z-10">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <motion.div
        className="relative w-full max-w-md space-y-6 glass-panel p-8 sm:p-10 rounded-3xl z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="flex flex-col items-center text-center space-y-2">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-cyan to-aurora-blue text-white shadow-glowCyan"
            whileHover={{ scale: 1.05, rotate: -5 }}
          >
            <Shield className="h-7 w-7" />
          </motion.div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-white">Create Account</h2>
            <p className="text-slate-400 text-sm mt-1">Join the ClaimShield AI platform</p>
          </div>
        </div>

        {successMessage ? (
          <motion.div
            className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl space-y-4 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <p className="text-slate-200 text-sm leading-relaxed">{successMessage}</p>
            <Link to="/login" className="inline-block btn-primary text-sm py-3 px-6">
              Go to Sign In
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", icon: User, type: "text", value: fullName, set: setFullName, placeholder: "Palwinder Singh" },
              { label: "Email Address", icon: Mail, type: "email", value: email, set: setEmail, placeholder: "palwinder@company.com" },
              { 
                label: "Password", 
                icon: KeyRound, 
                type: showPassword ? "text" : "password", 
                value: password, 
                set: setPassword, 
                placeholder: "Min 8 characters",
                hasToggle: true,
                isToggled: showPassword,
                onToggle: () => setShowPassword(!showPassword)
              },
              { 
                label: "Confirm Password", 
                icon: KeyRound, 
                type: showConfirmPassword ? "text" : "password", 
                value: confirmPassword, 
                set: setConfirmPassword, 
                placeholder: "Re-enter password",
                hasToggle: true,
                isToggled: showConfirmPassword,
                onToggle: () => setShowConfirmPassword(!showConfirmPassword)
              },
            ].map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-xs font-semibold text-aurora-cyan uppercase tracking-wider">{field.label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.set(e.target.value)}
                      placeholder={field.placeholder}
                      className={`${inputClass} ${field.hasToggle ? "!pr-10" : ""}`}
                    />
                    {field.hasToggle && (
                      <button
                        type="button"
                        onClick={field.onToggle}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition duration-200"
                      >
                        {field.isToggled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {(validationError || error) && (
              <motion.div
                className="flex items-center gap-1.5 text-rose-400 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{validationError || error}</span>
              </motion.div>
            )}

            <button type="submit" disabled={isLoading} className="w-full btn-primary py-3 disabled:opacity-60 flex items-center justify-center">
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Register Account"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-aurora-cyan hover:text-white font-bold transition">
            Sign In
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Register;
