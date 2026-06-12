import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading, fetchMe } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    // Attempt session restoration if state user is null
    if (!user) {
      fetchMe();
    }
  }, [user, fetchMe]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-slate-400 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but not onboarded (force onboarding, except if already on onboarding page)
  if (user && !user.is_onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Onboarded user attempting onboarding page
  if (user && user.is_onboarded && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
