import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { useClaimStore } from "../../store/claimStore";
import { UploadCloud, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";

const DocumentUploader = ({ onUploadComplete, maxFiles = 5 }) => {
  const { uploadFile } = useClaimStore();
  const [uploadedFiles, setUploadedFiles] = useState([]); // [{ name: '', path: '' }]
  const [uploadProgress, setUploadProgress] = useState(null); // String or percent
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setError(null);
      if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
        setError(`You can upload a maximum of ${maxFiles} documents per claim.`);
        return;
      }

      setUploadProgress("Uploading documents...");
      
      const newUploads = [...uploadedFiles];
      try {
        for (const file of acceptedFiles) {
          // Perform backend API upload directly to MinIO
          const storagePath = await uploadFile(file);
          newUploads.push({
            name: file.name,
            path: storagePath,
          });
        }
        setUploadedFiles(newUploads);
        onUploadComplete(newUploads.map((f) => f.path));
      } catch (err) {
        setError(err.message || "Failed to upload one or more documents.");
      } finally {
        setUploadProgress(null);
      }
    },
    [uploadedFiles, uploadFile, onUploadComplete, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxSize: 20 * 1024 * 1024, // 20 MB
  });

  const removeFile = (idxToRemove) => {
    const updated = uploadedFiles.filter((_, idx) => idx !== idxToRemove);
    setUploadedFiles(updated);
    onUploadComplete(updated.map((f) => f.path));
  };

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone Box */}
      <motion.div
        {...getRootProps()}
        className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-center items-center ${
          isDragActive
            ? "border-indigo-400 bg-indigo-950/20 shadow-lg shadow-indigo-500/10"
            : "border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/10"
        }`}
        whileHover={{ scale: 0.99 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <UploadCloud className="h-9 w-9 text-slate-500 mb-1" />
          <p className="text-slate-350 text-xs font-semibold">
            {isDragActive ? "Drop files here..." : "Drag & drop claim documents"}
          </p>
          <span className="text-[10px] text-slate-500">
            PDF, PNG, JPG (Max 20MB per file)
          </span>
        </div>
      </motion.div>

      {/* Upload State / Errors */}
      <AnimatePresence>
        {uploadProgress && (
          <motion.div 
            className="flex items-center gap-2 text-indigo-400 text-xs font-semibold animate-pulse"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            <div className="h-3.5 w-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            {uploadProgress}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-center gap-2 bg-red-950/20 border border-red-900/50 text-red-400 p-3 rounded-xl text-xs">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Supporting documents dossier ({uploadedFiles.length})
          </h4>
          <div className="divide-y divide-slate-900/60 bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <FileText className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-emerald-950/40 text-emerald-450 border border-emerald-900/40 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" />
                    Uploaded
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;
