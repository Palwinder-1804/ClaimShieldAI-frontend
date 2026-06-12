import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ClaimDetail from "./pages/ClaimDetail";
import PolicyChatPage from "./pages/PolicyChatPage";
import Landing from "./pages/Landing";
import About from "./pages/About";
import FAQ from "./pages/FAQ";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />

        {/* Public auth pathways */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected onboarding pathway */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        {/* Protected Dashboard Pathway */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Claim Detailed Audits Pathway */}
        <Route
          path="/claims/:claimId"
          element={
            <ProtectedRoute>
              <ClaimDetail />
            </ProtectedRoute>
          }
        />

        {/* Protected Document Chat Assistant Pathways */}
        <Route
          path="/policy-chat"
          element={
            <ProtectedRoute>
              <PolicyChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/policy-chat/:policyId"
          element={
            <ProtectedRoute>
              <PolicyChatPage />
            </ProtectedRoute>
          }
        />

        {/* Wildcard redirect to Landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-aurora-bg text-slate-200 selection:bg-aurora-cyan/30 selection:text-white">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
};

export default App;
