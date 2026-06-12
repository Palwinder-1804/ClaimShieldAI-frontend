import { create } from "zustand";
import apiClient from "../api/apiClient";

export const useClaimStore = create((set, get) => ({
  claims: [],
  currentClaim: null,
  isLoading: false,
  uploading: false,
  error: null,

  fetchClaims: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/claims");
      set({ claims: response.data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to fetch claims list.", isLoading: false });
    }
  },

  fetchClaimDetails: async (claimId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/claims/${claimId}`);
      set({ currentClaim: response.data, isLoading: false });
      return response.data;
    } catch (err) {
      set({ error: "Failed to fetch claim details.", isLoading: false });
      return null;
    }
  },

  uploadFile: async (file) => {
    set({ uploading: true, error: null });
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await apiClient.post("/claims/upload-doc", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ uploading: false });
      return response.data.file_path; // Returns s3/MinIO key
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Document upload failed.";
      set({ error: errMsg, uploading: false });
      throw new Error(errMsg);
    }
  },

  submitClaim: async (claimType, filePaths) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post("/claims", {
        claim_type: claimType,
        documents: filePaths,
      });
      set((state) => ({
        claims: [response.data, ...state.claims],
        isLoading: false,
      }));
      return response.data;
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to submit claim request.";
      set({ error: errMsg, isLoading: false });
      return null;
    }
  },

  submitFeedback: async (claimId, rating, agreedWithDecision, comment) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(`/claims/${claimId}/feedback`, {
        rating,
        agreed_with_decision: agreedWithDecision,
        comment,
      });
      
      // Update local detailed claim record if loaded
      const current = get().currentClaim;
      if (current && current.id === claimId) {
        set({
          currentClaim: {
            ...current,
            feedback: {
              rating,
              agreed_with_decision: agreedWithDecision,
              comment,
              created_at: new Date().toISOString()
            }
          }
        });
      }
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Feedback submission failed.";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  deleteClaim: async (claimId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/claims/${claimId}`);
      set((state) => ({
        claims: state.claims.filter((c) => c.id !== claimId),
        currentClaim: state.currentClaim && state.currentClaim.id === claimId ? null : state.currentClaim,
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.detail || "Failed to delete claim.";
      set({ error: errMsg, isLoading: false });
      return { success: false, error: errMsg };
    }
  },

  clearError: () => set({ error: null })
}));
