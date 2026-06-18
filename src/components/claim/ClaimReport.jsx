import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClaimStore } from "../../store/claimStore";
import StatusBadge from "../common/StatusBadge";
import MarkdownRenderer from "../common/MarkdownRenderer";
import { Star, MessageSquare, AlertCircle, CheckCircle, Trash2, Download, Printer, HelpCircle, X } from "lucide-react";
import { policyChatApi } from "../../api/policyChat";
import apiClient from "../../api/apiClient";

const ClaimReport = ({ claim }) => {
  const navigate = useNavigate();
  const { submitFeedback, deleteClaim, isLoading, error } = useClaimStore();
  const [rating, setRating] = useState(5);
  const [agreed, setAgreed] = useState(true);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [showClaimStepsModal, setShowClaimStepsModal] = useState(false);
  const [claimingStepsText, setClaimingStepsText] = useState("");
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const fetchClaimingSteps = async () => {
    setLoadingSteps(true);
    setFetchError(null);
    try {
      let policyId = claim.policy_match?.policy_id;
      
      if (!policyId) {
        // Fallback: list all policies and take the first one
        const response = await apiClient.get("/policy");
        const policies = response.data;
        if (policies && policies.length > 0) {
          policyId = policies[0].id;
        }
      }
      
      if (!policyId) {
        throw new Error("No policy document associated with this claim or system index.");
      }
      
      const result = await policyChatApi.getClaimSteps(policyId);
      setClaimingStepsText(result.steps);
      setShowClaimStepsModal(true);
    } catch (err) {
      setFetchError(err.response?.data?.detail || err.message || "Failed to fetch claiming steps dynamically.");
    } finally {
      setLoadingSteps(false);
    }
  };

  const downloadMarkdown = () => {
    if (!claim.report) return;
    const element = document.createElement("a");
    const file = new Blob([claim.report], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `claim_report_${claim.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteClaim(claim.id);
    if (res.success) {
      navigate("/dashboard");
    } else {
      setDeleting(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const res = await submitFeedback(claim.id, rating, agreed, comment);
    if (res.success) {
      setSubmitted(true);
    }
  };

  const hasFeedback = !!claim.feedback || submitted;
  const activeFeedback = claim.feedback || { rating, agreed_with_decision: agreed, comment };

  return (
    <div className="space-y-6">
      {/* 1. Decision Header Card */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-glowCyan transition duration-300">
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pipeline Outcome</span>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-tight">Claim Decided</h2>
            <StatusBadge type="decision" value={claim.decision} />
          </div>
          <p className="text-slate-400 text-xs">
            Processed on {new Date(claim.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Anomaly / Score Indicator */}
        <div className="bg-black/20 border border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-inner">
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Fraud Risk Score</p>
            <StatusBadge type="fraud" value={claim.fraud_score} />
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Status</p>
            <StatusBadge type="status" value={claim.status} />
          </div>
        </div>
      </div>

      {/* 2. Audit Report Details */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Investigation Audit Report</h3>
          {claim.report && (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchClaimingSteps}
                disabled={loadingSteps}
                title="How to Claim"
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-350 font-semibold text-[10px] py-1.5 px-3 rounded-lg border border-white/10 transition disabled:opacity-60"
              >
                {loadingSteps ? (
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <HelpCircle className="h-3.5 w-3.5 text-aurora-cyan" />
                )}
                How to Claim
              </button>
              <button
                onClick={downloadMarkdown}
                title="Download Markdown"
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-[10px] py-1.5 px-3 rounded-lg border border-white/10 transition"
              >
                <Download className="h-3.5 w-3.5 text-aurora-cyan" />
                MD
              </button>
              <button
                onClick={handlePrint}
                title="Print / PDF"
                className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-[10px] py-1.5 px-3 rounded-lg border border-white/10 transition"
              >
                <Printer className="h-3.5 w-3.5 text-aurora-cyan" />
                PDF
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                title="Delete Claim"
                className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-semibold text-[10px] py-1.5 px-3 rounded-lg transition"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                Delete
              </button>
            </div>
          )}
        </div>
        
        {fetchError && (
          <div className="flex items-center gap-1.5 text-rose-450 text-xs font-semibold bg-rose-950/20 border border-rose-900/40 p-3.5 rounded-2xl">
            <AlertCircle className="h-4 w-4 text-rose-450 flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}

        {/* Delete Confirmation Modal / Banner */}
        {showConfirmDelete && (
          <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300">
            <div className="space-y-1">
              <p className="text-xs font-bold text-rose-400">Confirm Claim Deletion?</p>
              <p className="text-[10px] text-slate-400">This action will permanently remove this claim and associated audit reports from our systems.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                disabled={deleting}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-rose-500 hover:bg-rose-400 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition shadow-[0_0_10px_rgba(244,63,94,0.3)]"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        )}

        {claim.report ? (
          <div id="printable-report" className="text-slate-300 text-xs">
            <MarkdownRenderer content={claim.report} date={claim.created_at} />
          </div>
        ) : (
          <p className="text-slate-500 text-xs italic">Audit report is empty or not yet generated.</p>
        )}
      </div>      {/* 3. Feedback System Section */}
      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-bold text-white flex items-center gap-2 uppercase tracking-wider">
          <MessageSquare className="h-4.5 w-4.5 text-aurora-cyan" />
          Decision Validation & Feedback
        </h3>

        {hasFeedback ? (
          /* Static Display if feedback has been submitted */
          <div className="bg-black/20 border border-white/5 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Adjustment Agreement:</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  activeFeedback.agreed_with_decision
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.2)]"
                }`}
              >
                {activeFeedback.agreed_with_decision ? "Agreed with system decision" : "Disagreed with system decision"}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">Adjustment Accuracy Rating:</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < activeFeedback.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {activeFeedback.comment && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Comments:</span>
                <p className="text-slate-300 text-xs bg-black/20 p-3 rounded-xl border border-white/5 font-serif italic">
                  "{activeFeedback.comment}"
                </p>
              </div>
            )}

            {submitted && (
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                <CheckCircle className="h-4 w-4" />
                Thank you! Your feedback has been submitted successfully.
              </p>
            )}
          </div>
        ) : (
          /* Form for new feedback submission */
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <p className="text-xs text-slate-400">
              Verify if the system's fraud scoring and coverage decision were accurate. Your ratings train the model.
            </p>

            {/* Agreement Radio check */}
            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
              <span className="text-xs text-slate-300 font-semibold">Do you agree with the system decision?</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white">
                  <input
                    type="radio"
                    checked={agreed === true}
                    onChange={() => setAgreed(true)}
                    className="accent-aurora-cyan"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-white">
                  <input
                    type="radio"
                    checked={agreed === false}
                    onChange={() => setAgreed(false)}
                    className="accent-aurora-cyan"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Rating Stars Selection */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-semibold">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    className="hover:scale-110 transition duration-300"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        val <= rating ? "text-amber-400 fill-amber-400" : "text-slate-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest">Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details, missing features, or adjustment notes..."
                className="w-full bg-black/20 border border-white/10 rounded-2xl p-3 text-slate-200 text-xs h-24 outline-none focus:border-aurora-cyan transition-all duration-300"
                maxLength={1000}
              />
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary text-xs py-2.5 px-4 disabled:opacity-60 transition"
            >
              {isLoading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}
      </div>

      {/* Dynamic Claiming Steps Modal */}
      {showClaimStepsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-white/5">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5 text-aurora-cyan" />
                Claiming Procedures Guide
              </h3>
              <button 
                onClick={() => setShowClaimStepsModal(false)}
                className="text-slate-400 hover:text-white transition p-1.5 bg-white/5 rounded-lg hover:bg-white/10 border border-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans custom-scrollbar">
              <MarkdownRenderer content={claimingStepsText} />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex justify-end">
              <button
                onClick={() => setShowClaimStepsModal(false)}
                className="btn-primary text-xs py-2 px-4"
              >
                Dismiss Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimReport;
