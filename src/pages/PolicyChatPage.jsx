import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { policyChatApi } from "../api/policyChat";
import Navbar from "../components/common/Navbar";
import MarkdownRenderer from "../components/common/MarkdownRenderer";
import { 
  Send, UploadCloud, MessageSquare, AlertCircle, 
  FileText, Trash2, HelpCircle, ChevronRight, 
  ChevronDown, Cpu, User, ArrowLeft, X 
} from "lucide-react";

const PolicyChatPage = () => {
  const { policyId: urlPolicyId } = useParams();
  const navigate = useNavigate();

  const [policyId, setPolicyId] = useState(urlPolicyId || null);
  const [uploadedFilename, setUploadedFilename] = useState(null);
  
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I am your ClaimShield insurance assistant. Ask me anything about insurance rules. To ask about a specific policy, upload the document first.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [indexing, setIndexing] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (urlPolicyId) {
      setPolicyId(urlPolicyId);
    }
  }, [urlPolicyId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Document upload handler
  const onDrop = async (acceptedFiles) => {
    setError(null);
    if (acceptedFiles.length === 0) return;

    setIndexing(true);
    try {
      const result = await policyChatApi.uploadPolicy(acceptedFiles[0]);
      setPolicyId(result.policy_id);
      setUploadedFilename(result.uploaded_filename);
      
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `Success! I have processed and indexed "${result.uploaded_filename}" (${result.chunk_count} clauses). Ask me any document-grounded questions!`,
        },
      ]);
      navigate(`/policy-chat/${result.policy_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Document parsing and indexing failed.");
    } finally {
      setIndexing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  // Query dispatch
  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || input).trim();
    if (!textToSend) return;

    if (!customText) {
      setInput("");
    }

    // Append user message
    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setIsTyping(true);

    try {
      const response = await policyChatApi.askQuestion(textToSend, policyId);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: response.answer,
          sources: response.sources,
          confidence: response.confidence,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "An error occurred fetching response from assistant. Please check credentials or try general questions.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Session clearout
  const handleClearSession = async () => {
    if (!policyId) return;
    try {
      await policyChatApi.clearSession(policyId);
      setPolicyId(null);
      setUploadedFilename(null);
      setMessages([
        {
          sender: "bot",
          text: "Active document session cleared. Back to general insurance assistant mode.",
        },
      ]);
      navigate("/policy-chat");
    } catch (err) {
      setError("Failed to delete current document index.");
    }
  };
  const [showClaimStepsModal, setShowClaimStepsModal] = useState(false);
  const [claimingStepsText, setClaimingStepsText] = useState("");
  const [loadingSteps, setLoadingSteps] = useState(false);

  const fetchClaimingSteps = async () => {
    if (!policyId) return;
    setLoadingSteps(true);
    setError(null);
    try {
      const result = await policyChatApi.getClaimSteps(policyId);
      setClaimingStepsText(result.steps);
      setShowClaimStepsModal(true);
    } catch (err) {
      setError("Failed to fetch claiming steps dynamically.");
    } finally {
      setLoadingSteps(false);
    }
  };
  const quickPrompts = [
    "What is standard insurance deductible?",
    "How to file a claim?",
    "Explain policy exclusions?",
    "What are premium payments?",
  ];

  const getConfidenceBadge = (score) => {
    if (score === undefined || score === 0) return null;
    const scorePct = Math.round(score * 100);
    
    let colorClass = "bg-rose-500/20 text-rose-400 border-rose-500/30";
    if (score >= 0.75) {
      colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]";
    } else if (score >= 0.50) {
      colorClass = "bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]";
    }

    return (
      <span className={`inline-flex items-center text-[9px] px-2 py-0.5 rounded-full border font-mono font-bold ${colorClass}`}>
        Confidence: {scorePct}%
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-aurora-bg text-slate-200 flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-aurora-animated opacity-20 pointer-events-none z-0" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-aurora-purple/10 blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="flex-grow container-main p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 z-10 min-h-[calc(100vh-4.5rem)]">
        
        <div className="md:col-span-1 glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-aurora-cyan/10 blur-[50px] pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-aurora-cyan" />
                Policy Dossier
              </h2>
              <p className="text-[10px] text-slate-400">Ground AI answers in standard policy clauses.</p>
            </div>

            {policyId ? (
              <motion.div 
                className="bg-white/5 p-4 border border-white/10 rounded-2xl space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-start gap-2.5">
                  <FileText className="h-4.5 w-4.5 text-aurora-purple flex-shrink-0 mt-0.5" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate">
                      {uploadedFilename || "Policy Index File"}
                    </p>
                    <p className="text-[9px] text-slate-500 font-mono truncate">{policyId}</p>
                  </div>
                </div>

                <button
                  onClick={fetchClaimingSteps}
                  disabled={loadingSteps}
                  className="w-full btn-primary flex items-center justify-center gap-1.5 text-xs py-2.5 mb-2 disabled:opacity-60"
                >
                  {loadingSteps ? (
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <HelpCircle className="h-3.5 w-3.5" />
                  )}
                  {loadingSteps ? "Fetching Guide..." : "How to Claim"}
                </button>

                <button
                  onClick={handleClearSession}
                  className="w-full flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 font-semibold text-xs py-2.5 rounded-xl transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Unload Reference
                </button>
              </motion.div>
            ) : (
              <motion.div
                {...getRootProps()}
                className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                  isDragActive
                    ? "border-aurora-cyan bg-aurora-cyan/10"
                    : "border-white/20 bg-white/5 hover:border-aurora-cyan/40 hover:bg-white/10"
                }`}
                whileHover={{ scale: 0.99 }}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-300">Ground Policy Reference</p>
                <span className="text-[9px] text-slate-500 block mt-1">Upload PDF Policy to begin</span>
              </motion.div>
            )}

            {indexing && (
              <div className="flex items-center gap-2 text-aurora-purple text-[11px] font-bold animate-pulse">
                <div className="h-3.5 w-3.5 border-2 border-aurora-purple border-t-transparent rounded-full animate-spin"></div>
                Scrubbing & indexing RAG context...
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3.5 rounded-2xl text-xs">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-4 text-[9px] text-slate-500 leading-relaxed font-sans uppercase tracking-wider">
            ClaimShield chat automatically scrubs credit cards, phone numbers, and SSNs before sending requests.
          </div>
        </div>

        {/* Right Chat Thread Panel */}
        <div className="md:col-span-3 flex flex-col glass-panel rounded-2xl overflow-hidden min-h-[60vh] md:min-h-[calc(100vh-8rem)]">
          {/* Messages Thread Display */}
          <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-5 custom-scrollbar">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const isBot = msg.sender === "bot";
                return (
                  <motion.div 
                    key={idx} 
                    className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Bot Avatar Icon */}
                    {isBot && (
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-aurora-purple to-aurora-cyan text-white flex items-center justify-center flex-shrink-0 shadow-glowCyan">
                        <Cpu className="h-4.5 w-4.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 border ${
                        msg.sender === "user"
                          ? "bg-aurora-cyan/20 border-aurora-cyan/30 text-white rounded-br-none backdrop-blur-md"
                          : "bg-white/5 border-white/10 text-slate-300 rounded-bl-none backdrop-blur-md shadow-glass"
                      }`}
                    >
                      {isBot ? (
                        <MarkdownRenderer content={msg.text} />
                      ) : (
                        <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                      )}
                      
                      {/* Metadata: Confidence scores & Accordion sources */}
                      {isBot && (msg.confidence || (msg.sources && msg.sources.length > 0)) && (
                        <div className="border-t border-white/10 pt-2 flex flex-col gap-2">
                          {getConfidenceBadge(msg.confidence)}
                          
                          {msg.sources && msg.sources.length > 0 && (
                            <details className="text-[11px] group">
                              <summary className="cursor-pointer text-slate-400 hover:text-white flex items-center gap-1 font-bold select-none uppercase tracking-wider transition">
                                <span className="group-open:hidden"><ChevronRight className="h-3 w-3" /></span>
                                <span className="hidden group-open:inline"><ChevronDown className="h-3 w-3" /></span>
                                Matched Clause Sources ({msg.sources.length})
                              </summary>
                              <div className="mt-2 pl-3 border-l border-white/20 space-y-3 max-h-40 overflow-y-auto custom-scrollbar">
                                {msg.sources.map((src, sIdx) => (
                                  <div key={sIdx} className="space-y-0.5">
                                    <span className="font-mono font-bold text-aurora-cyan text-[10px]">{src.doc_name}</span>
                                    <p className="italic font-serif text-slate-400">"{src.snippet}"</p>
                                  </div>
                                ))}
                              </div>
                            </details>
                          )}
                        </div>
                      )}
                    </div>

                    {/* User Avatar Icon */}
                    {msg.sender === "user" && (
                      <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            
            {/* Animated Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start gap-3.5">
                <div className="h-8 w-8 rounded-xl bg-aurora-purple/20 border border-aurora-purple/30 flex items-center justify-center text-aurora-purple flex-shrink-0">
                  <Cpu className="h-4.5 w-4.5" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-4 text-xs text-slate-400 flex items-center gap-1.5 font-bold shadow-inner animate-pulse">
                  <span className="h-1.5 w-1.5 bg-aurora-purple rounded-full typing-dot"></span>
                  <span className="h-1.5 w-1.5 bg-aurora-cyan rounded-full typing-dot"></span>
                  <span className="h-1.5 w-1.5 bg-aurora-blue rounded-full typing-dot"></span>
                  <span>Scanning index...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-Prompt Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="px-6 py-2 flex flex-wrap gap-2 justify-center border-t border-white/10 pt-4 bg-black/20">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-white/5 border border-white/10 hover:border-aurora-cyan/50 text-slate-300 hover:text-white hover:bg-aurora-cyan/10 text-[10px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Box */}
          <div className="p-4 border-t border-white/10 bg-black/20 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={policyId ? "Ask about loaded policy clauses..." : "Ask general insurance queries..."}
              disabled={isTyping || indexing}
              className="glass-input flex-grow text-sm disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isTyping || indexing || !input.trim()}
              className="btn-primary p-3 rounded-xl disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Dynamic Claiming Steps Modal */}
      {showClaimStepsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] flex flex-col max-h-[85vh]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
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
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PolicyChatPage;
