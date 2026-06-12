import React from "react";

const Loader = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4"
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 gap-2">
      <div className={`animate-spin rounded-full border-insurance-blue border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}></div>
      {message && <p className="text-slate-500 text-sm font-medium">{message}</p>}
    </div>
  );
};

export default Loader;
