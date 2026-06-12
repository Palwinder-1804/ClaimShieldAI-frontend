import apiClient from "./apiClient";

export const policyChatApi = {
  /**
   * Uploads custom policy document to construct an active session index.
   */
  uploadPolicy: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await apiClient.post("/api/policy-chat/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data; // { policy_id, uploaded_filename, chunk_count }
  },

  /**
   * Dispatches questions to the assistant.
   */
  askQuestion: async (question, policyId = null) => {
    const response = await apiClient.post("/api/policy-chat/ask", {
      question,
      policy_id: policyId,
    });
    return response.data; // { answer, sources, confidence }
  },

  /**
   * Clears the current document Q&A session.
   */
  clearSession: async (policyId) => {
    const response = await apiClient.delete(`/api/policy-chat/session/${policyId}`);
    return response.data;
  },

  /**
   * Retrieves claiming procedure steps for a policy.
   */
  getClaimSteps: async (policyId) => {
    const response = await apiClient.get(`/policy/${policyId}/claim-steps`);
    return response.data;
  },
};
