import React from "react";

const StatusBadge = ({ type, value }) => {
  const cleanVal = String(value || "").toLowerCase().trim();

  // 1. Claim Processing Status
  if (type === "status") {
    switch (cleanVal) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-950/40 text-blue-300 border border-blue-900/60 px-2 py-0.5 rounded-full text-xs font-semibold">
            <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-ping"></span>
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 bg-yellow-950/40 text-yellow-300 border border-yellow-900/60 px-2 py-0.5 rounded-full text-xs font-semibold">
            <span className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-spin border border-t-transparent border-yellow-400"></span>
            Processing
          </span>
        );
      case "done":
        return (
          <span className="inline-flex items-center gap-1 bg-green-950/40 text-green-300 border border-green-900/60 px-2 py-0.5 rounded-full text-xs font-semibold">
            Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 bg-red-950/40 text-red-300 border border-red-900/60 px-2 py-0.5 rounded-full text-xs font-semibold">
            Failed
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold">
            {value}
          </span>
        );
    }
  }

  // 2. Claim Investigation Decision
  if (type === "decision") {
    switch (cleanVal) {
      case "approved":
        return (
          <span className="bg-green-900/40 text-green-300 border border-green-800/80 px-2.5 py-1 rounded text-xs uppercase font-extrabold tracking-wider">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-900/40 text-red-300 border border-red-800/80 px-2.5 py-1 rounded text-xs uppercase font-extrabold tracking-wider">
            Rejected
          </span>
        );
      case "investigate":
      case "needs investigation":
        return (
          <span className="bg-amber-900/40 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded text-xs uppercase font-extrabold tracking-wider">
            Needs Investigation
          </span>
        );
      default:
        return (
          <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded text-xs uppercase font-extrabold tracking-wider">
            {value}
          </span>
        );
    }
  }

  // 3. Fraud Anomaly Scoring
  if (type === "fraud") {
    const score = parseFloat(value) || 0.0;
    if (score < 0.3) {
      return (
        <span className="bg-green-950/50 text-green-400 border border-green-900/70 px-2 py-0.5 rounded text-xs font-mono font-bold">
          {score.toFixed(2)} (Low)
        </span>
      );
    } else if (score <= 0.7) {
      return (
        <span className="bg-amber-950/50 text-amber-400 border border-amber-900/70 px-2 py-0.5 rounded text-xs font-mono font-bold">
          {score.toFixed(2)} (Medium)
        </span>
      );
    } else {
      return (
        <span className="bg-red-950/50 text-red-400 border border-red-900/70 px-2 py-0.5 rounded text-xs font-mono font-bold">
          {score.toFixed(2)} (High)
        </span>
      );
    }
  }

  return <span>{value}</span>;
};

export default StatusBadge;
