import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useClaimStore } from "../store/claimStore";
import ClaimReport from "../components/claim/ClaimReport";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const ClaimDetail = () => {
  const { claimId } = useParams();
  const { currentClaim, fetchClaimDetails, isLoading, error } = useClaimStore();

  useEffect(() => {
    fetchClaimDetails(claimId);
  }, [claimId, fetchClaimDetails]);

  return (
    <div className="min-h-screen bg-aurora-bg text-slate-200 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora-animated opacity-20 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-aurora-purple/10 blur-[100px] pointer-events-none" />
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-6 space-y-6">
        {/* Back Link */}
        <div className="relative z-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-200 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Loading / Errors / Renders */}
        {isLoading ? (
          <Loader message="Retrieving claims dossier..." size="lg" />
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-6 rounded-2xl flex items-start gap-3 relative z-10">
            <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold">Error loading claim details</h4>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
          </div>
        ) : !currentClaim ? (
          <p className="text-slate-500 italic text-center py-12 relative z-10">Claim dossier not found.</p>
        ) : (
          <motion.div 
            className="space-y-6 relative z-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-white">Audit File Dossier</h1>
                <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wider">ID: {currentClaim.id}</p>
              </div>
              <div className="flex gap-2">
                {currentClaim.documents?.map((doc, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:8000/claims/download/${doc}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/5 border border-white/10 text-[10px] hover:text-white px-4 py-2 rounded-xl font-mono hover:bg-white/10 transition shadow-glass"
                    title={doc}
                  >
                    Doc {idx + 1}
                  </a>
                ))}
              </div>
            </div>

            <ClaimReport claim={currentClaim} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ClaimDetail;
