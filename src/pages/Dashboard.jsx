import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend, 
  LineChart, Line 
} from "recharts";
import { useClaimStore } from "../store/claimStore";
import { useAuthStore } from "../store/authStore";
import ClaimForm from "../components/claim/ClaimForm";
import ClaimStatus from "../components/claim/ClaimStatus";
import StatusBadge from "../components/common/StatusBadge";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { 
  FileText, PlusCircle, AlertCircle, ArrowRight, 
  ClipboardList, ShieldAlert, Sparkles, TrendingUp, CheckCircle 
} from "lucide-react";

// Count-up helper component for stats cards
const CountUp = ({ to, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(to) || 0;
    if (end === 0) {
      setCount(0);
      return;
    }
    const totalDuration = 1000; // 1 second
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [to]);

  return <span>{prefix}{count}{suffix}</span>;
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const { claims, fetchClaims, isLoading, error } = useClaimStore();
  const [activeClaimId, setActiveClaimId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleClaimSuccess = (claimId) => {
    setActiveClaimId(claimId);
    setShowForm(false);
    fetchClaims();
  };

  const handleStatusComplete = (finalStatus) => {
    fetchClaims();
  };

  // Dynamic calculations from backend data
  const totalClaimsCount = claims.length;
  const pendingCount = claims.filter(c => c.status === "pending" || c.status === "processing").length;
  const alertCount = claims.filter(c => c.fraud_score !== null && c.fraud_score > 0.7).length;
  const approvedCount = claims.filter(c => c.decision === "approved").length;

  // 1. Claims Trend Line Chart Data
  const trendData = (() => {
    const datesMap = {};
    // Seed last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      datesMap[str] = 0;
    }
    claims.forEach(c => {
      const str = new Date(c.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (datesMap[str] !== undefined) {
        datesMap[str] += 1;
      }
    });
    return Object.keys(datesMap).map(key => ({ name: key, count: datesMap[key] }));
  })();

  // 2. Fraud Risk Pie Chart Data
  const riskData = (() => {
    let low = 0, medium = 0, high = 0;
    claims.forEach(c => {
      if (c.status === "done" && c.fraud_score !== null) {
        if (c.fraud_score > 0.7) high++;
        else if (c.fraud_score >= 0.3) medium++;
        else low++;
      } else {
        low++; // default/unevaluated is treated as low risk initially
      }
    });
    return [
      { name: "Low Risk", value: low, color: "#10B981" },
      { name: "Medium Risk", value: medium, color: "#F59E0B" },
      { name: "High Risk", value: high, color: "#EF4444" }
    ].filter(item => item.value > 0 || claims.length === 0);
  })();

  // 3. Monthly Approval Bar Chart Data
  const approvalData = (() => {
    let approved = 0, rejected = 0, investigate = 0;
    claims.forEach(c => {
      if (c.decision === "approved") approved++;
      else if (c.decision === "rejected") rejected++;
      else if (c.decision === "investigate") investigate++;
    });
    return [
      { name: "Approved", count: approved, fill: "#10B981" },
      { name: "Investigate", count: investigate, fill: "#F59E0B" },
      { name: "Rejected", count: rejected, fill: "#EF4444" }
    ];
  })();

  // 4. Claim Status Area Chart Data
  const statusData = (() => {
    let pending = 0, processing = 0, done = 0, failed = 0;
    claims.forEach(c => {
      if (c.status === "pending") pending++;
      else if (c.status === "processing") processing++;
      else if (c.status === "done") done++;
      else if (c.status === "failed") failed++;
    });
    return [
      { name: "Pending", count: pending },
      { name: "Processing", count: processing },
      { name: "Done", count: done },
      { name: "Failed", count: failed }
    ];
  })();

  // AI Insights calculations
  const highRiskAnomalies = claims.filter(c => c.status === "done" && c.fraud_score !== null && c.fraud_score > 0.7);

  const chartTooltip = { backgroundColor: "rgba(15, 23, 42, 0.9)", borderColor: "rgba(255, 255, 255, 0.1)", borderRadius: "12px", color: "#F8FAFC", backdropFilter: "blur(12px)" };

  return (
    <div className="min-h-screen bg-aurora-bg text-slate-200 font-sans relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-aurora-animated opacity-20 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-aurora-purple/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-aurora-cyan/10 blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="z-10 container-main section-padding-sm md:py-10 space-y-6 md:space-y-8 flex-grow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="font-display text-2xl md:text-3xl text-white">Claims Auditing System</h1>
            <p className="text-sm text-slate-400">
              Welcome back, <span className="text-aurora-cyan font-semibold">{user?.full_name}</span>. Monitor claims risk metrics and OCR anomalies.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveClaimId(null);
              setShowForm(!showForm);
            }}
            className="btn-primary flex items-center gap-1.5 text-sm py-2.5 px-5 w-full sm:w-auto justify-center"
          >
            <PlusCircle className="h-4 w-4" />
            {showForm ? "View Claims Console" : "Submit New Claim"}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Total Claims", val: totalClaimsCount, icon: ClipboardList, color: "border-aurora-cyan/30 text-aurora-cyan bg-aurora-cyan/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]" },
            { label: "Pending Reviews", val: pendingCount, icon: FileText, color: "border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]" },
            { label: "Fraud Alerts", val: alertCount, icon: ShieldAlert, color: "border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-[0_0_15px_rgba(244,63,94,0.1)]" },
            { label: "Approved Claims", val: approvedCount, icon: CheckCircle, color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                className="glass-panel p-4 md:p-5 rounded-2xl flex items-center justify-between group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, borderColor: "rgba(0, 240, 255, 0.3)" }}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <h3 className="text-xl md:text-3xl font-display font-bold text-white drop-shadow-md">
                    <CountUp to={stat.val} />
                  </h3>
                </div>
                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Overlay form / progress stepper */}
        {activeClaimId && (
          <div className="glass-panel p-6 rounded-2xl">
            <ClaimStatus claimId={activeClaimId} onComplete={handleStatusComplete} />
            <div className="mt-4 text-center">
              <button
                onClick={() => setActiveClaimId(null)}
                className="text-sm font-semibold text-aurora-cyan hover:text-white transition"
              >
                Return to Claims registry
              </button>
            </div>
          </div>
        )}

        {showForm && !activeClaimId && (
          <div className="max-w-xl mx-auto">
            <ClaimForm onSuccess={handleClaimSuccess} />
          </div>
        )}

        {/* Dash Data Content Grid */}
        {!showForm && !activeClaimId && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Data Tables & Charts Grid (Col span 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Claims Registry Table */}
              <div className="glass-panel rounded-2xl p-5 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-aurora-cyan" />
                    Submitted Claims Registry
                  </h3>
                  <span className="text-xs text-slate-400 font-semibold">{claims.length} Total</span>
                </div>

                {isLoading ? (
                  <Loader message="Loading claims registry..." size="md" />
                ) : error ? (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                ) : claims.length === 0 ? (
                  <div className="text-center p-10 md:p-12 border border-dashed border-white/10 rounded-2xl space-y-3 bg-white/5">
                    <FileText className="h-8 w-8 text-slate-500 mx-auto" />
                    <p className="text-slate-400 text-sm">No claims registered.</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="text-aurora-cyan hover:text-white text-sm font-semibold transition"
                    >
                      File first claim invoice now
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                          <th className="py-3 px-4">Claim ID</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">State</th>
                          <th className="py-3 px-4">Risk Index</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm text-slate-300">
                        {claims.map((claim) => (
                          <tr key={claim.id} className="hover:bg-white/5 transition">
                            <td className="py-3 px-4 font-mono text-xs text-slate-400 max-w-[100px] truncate">
                              {claim.id}
                            </td>
                            <td className="py-3 px-4 capitalize font-semibold text-white">
                              {claim.claim_type}
                            </td>
                            <td className="py-3 px-4">
                              {new Date(claim.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge type="status" value={claim.status} />
                            </td>
                            <td className="py-3 px-4">
                              {claim.status === "done" ? (
                                <StatusBadge type="fraud" value={claim.fraud_score} />
                              ) : (
                                <span className="text-slate-500 font-mono">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Link
                                to={`/claims/${claim.id}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-aurora-cyan hover:text-white transition"
                              >
                                Details
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Data Visualization Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Claims Trend Line Chart */}
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-aurora-cyan" />
                    Claims Submission Volume
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                        <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} tick={{ fill: '#94a3b8' }} />
                        <Tooltip contentStyle={chartTooltip} />
                        <Area type="monotone" dataKey="count" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Monthly Approval Bar Chart */}
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    Auditing Decisions
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={approvalData}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                        <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} tick={{ fill: '#94a3b8' }} />
                        <Tooltip contentStyle={chartTooltip} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Fraud Risk Pie Chart */}
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-400" />
                    Fraud Risk Severity
                  </h4>
                  <div className="h-48 flex items-center justify-center">
                    {claims.length === 0 ? (
                      <span className="text-xs text-slate-500 italic">No evaluated claims</span>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="rgba(0,0,0,0)"
                          >
                            {riskData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={chartTooltip} />
                          <Legend wrapperStyle={{ fontSize: 10, color: '#e2e8f0' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* 4. Status Area Chart */}
                <div className="glass-panel p-5 rounded-2xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-aurora-purple" />
                    Registry Status Overview
                  </h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={statusData}>
                        <defs>
                          <linearGradient id="colorStatus" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8a2be2" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8a2be2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                        <YAxis stroke="#64748b" fontSize={10} allowDecimals={false} tick={{ fill: '#94a3b8' }} />
                        <Tooltip contentStyle={chartTooltip} />
                        <Area type="monotone" dataKey="count" stroke="#8a2be2" strokeWidth={2} fillOpacity={1} fill="url(#colorStatus)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

            </div>

            {/* Right AI Insights Panel (Col span 1) */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="glass-panel p-5 md:p-6 rounded-2xl space-y-6">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">AI Insights & Auditing</h3>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">High-Risk Detections</h4>

                  {highRiskAnomalies.length === 0 ? (
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                      <p className="text-xs text-slate-400 italic">No high-risk anomalies identified. Compliance is normal.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                      {highRiskAnomalies.map((claim) => (
                        <div key={claim.id} className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-[120px]">{claim.id}</span>
                            <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded font-mono font-bold drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">
                              Risk: {claim.fraud_score.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            Claim flagged as <span className="text-rose-400 font-bold uppercase">{claim.decision}</span>. Match ratio or double providers detected.
                          </p>
                          <div className="flex justify-end pt-1">
                            <Link to={`/claims/${claim.id}`} className="text-xs font-semibold text-aurora-cyan hover:text-white flex items-center gap-0.5">
                              Audit File <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audit Instructions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audit Instructions</h4>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
                    <p>
                      <strong className="text-aurora-cyan">1. Upload Files:</strong> Ingestion triggers scanned PDF extraction, masking credit cards, phone numbers, and SSNs.
                    </p>
                    <p>
                      <strong className="text-aurora-cyan">2. Cross-reference:</strong> The decision node matches claims with Qdrant policy indexes. Verify matched clauses on the details file.
                    </p>
                    <p>
                      <strong className="text-aurora-cyan">3. Verify Alerts:</strong> Double invoice providers will raise the Isolation Forest outlier flag. Inspect details immediately.
                    </p>
                  </div>
                </div>

                {/* Integration status */}
                <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-400 uppercase font-semibold tracking-wider">
                  <span>MLflow status:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-[pulse_2s_ease-in-out_infinite] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    Configured
                  </span>
                </div>

              </div>

            </div>

          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-4 px-6 text-center text-xs text-slate-500 z-10 bg-aurora-bg/50 backdrop-blur-md">
        <span>&copy; {new Date().getFullYear()} ClaimShield AI Inc. All rights reserved.</span>
      </footer>
    </div>
  );
};

export default Dashboard;
