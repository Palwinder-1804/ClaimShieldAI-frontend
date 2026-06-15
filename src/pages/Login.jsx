import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { Shield, KeyRound, Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { BACKEND_URL } from "../api/apiClient";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const Login = () => {
  const { login, isAuthenticated, error, clearError, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from, clearError]);

  // Pre-fill email if remember me was checked previously
  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);
    if (!email || !password) {
      setValidationError("Please fill in all credentials.");
      return;
    }
    const result = await login(email, password, rememberMe);
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem("remembered_email", email);
      } else {
        localStorage.removeItem("remembered_email");
      }
      navigate(from, { replace: true });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <motion.div 
      className="flex min-h-screen items-center justify-center bg-aurora-bg p-4 sm:p-6 font-sans relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-aurora-animated opacity-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-aurora-cyan/10 opacity-50 pointer-events-none rounded-full blur-3xl" />
      <div className="absolute bottom-[10%] right-[15%] w-72 h-72 bg-aurora-purple/10 opacity-40 pointer-events-none rounded-full blur-3xl" />

      <div className="absolute top-5 left-4 sm:left-6 z-10">
        <Link to="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <motion.div
        className="relative w-full max-w-md space-y-8 glass-panel p-8 sm:p-10 rounded-3xl z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <motion.div
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-purple to-aurora-cyan text-white shadow-glowCyan"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="h-7 w-7" />
          </motion.div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl text-white">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to your ClaimShield console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-aurora-cyan uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="glass-input !pl-12"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-aurora-cyan uppercase tracking-wider">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="glass-input !pl-12"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pb-1">
            <label className="flex items-center gap-2 cursor-pointer group select-none">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="h-5 w-5 rounded-md border border-white/20 bg-white/5 transition-all duration-300 peer-checked:bg-gradient-to-br peer-checked:from-aurora-purple peer-checked:to-aurora-cyan peer-checked:border-transparent peer-hover:border-aurora-cyan/50 flex items-center justify-center shadow-inner" />
                <svg
                  className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="4"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white transition duration-200">
                Remember Me
              </span>
            </label>
          </div>

          {(validationError || error) && (
            <motion.div
              className="flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{validationError || error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 px-4 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Access System"
            )}
          </button>
        </form>

        <div className="relative flex items-center py-1">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase">Or continue with</span>
          <div className="flex-grow border-t border-white/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-aurora-cyan/40 text-slate-200 font-semibold py-3 rounded-xl hover:bg-white/10 transition-all duration-300"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.57,11.43 21.35,11.1z" fill="#4285F4" />
            <path d="M12,20.6c2.43,0 4.47,-0.8 5.96,-2.2l-2.92,-2.27c-0.8,0.54 -1.84,0.87 -3.04,0.87 -2.34,0 -4.32,-1.58 -5.03,-3.7H3.97v2.33C5.46,16.59 8.46,20.6 12,20.6z" fill="#34A853" />
            <path d="M6.97,13.3c-0.18,-0.54 -0.28,-1.12 -0.28,-1.72s0.1,-1.18 0.28,-1.72V7.53H3.97C3.35,8.78 3,10.2 3,11.7s0.35,2.92 0.97,4.17l3,-2.57z" fill="#FBBC05" />
            <path d="M12,6.43c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.47,3.63 14.43,2.8 12,2.8 8.46,2.8 5.46,6.8 3.97,9.13l3,2.57C7.68,8.01 9.66,6.43 12,6.43z" fill="#EA4335" />
          </svg>
          <span>Sign In with Google</span>
        </button>

        <p className="text-center text-slate-400 text-sm">
          New investigator?{" "}
          <Link to="/register" className="text-aurora-cyan hover:text-white font-bold transition">
            Create an Account
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
