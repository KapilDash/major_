/**
 * API Service Layer - Connects Frontend to Backend
 * Base URL defaults to http://localhost:8000
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred';
    console.error(`[API Error] ${message}`);
    return Promise.reject(error);
  }
);

// ==================== Health Check ====================
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

// ==================== Precedent Graph API ====================
export const precedentAPI = {
  search: async (caseName, caseType = 'criminal') => {
    const response = await api.post('/api/precedent/search', {
      case_name: caseName,
      case_type: caseType,
    });
    return response.data;
  },

  analyze: async (caseName, caseType = 'criminal') => {
    const response = await api.post('/api/precedent/analyze', {
      case_name: caseName,
      case_type: caseType,
    });
    return response.data;
  },

  getCaseDetails: async (caseId) => {
    const response = await api.get(`/api/precedent/cases/${caseId}`);
    return response.data;
  },

  exportPDF: async (caseIds, query = '') => {
    const response = await api.post('/api/precedent/export/pdf', {
      case_ids: caseIds,
      query: query,
    }, { timeout: 60000 });
    return response.data;
  },

  exportCSV: async (caseIds) => {
    const response = await api.post('/api/precedent/export/csv', {
      case_ids: caseIds,
    }, { timeout: 60000 });
    return response.data;
  },
};

// ==================== Risk Detector API ====================
export const riskDetectorAPI = {
  analyze: async (caseText, caseType = 'criminal') => {
    const response = await api.post('/api/detector/analyze', {
      case_text: caseText,
      case_type: caseType,
    });
    return response.data;
  },

  detectContradictions: async (caseText, caseType = 'criminal') => {
    const response = await api.post('/api/detector/contradictions', {
      case_text: caseText,
      case_type: caseType,
    });
    return response.data;
  },
};

// ==================== Procedural Flow API ====================
export const proceduralAPI = {
  predict: async (caseType, court, state) => {
    const response = await api.post('/api/procedural/predict', {
      case_type: caseType,
      court: court,
      state: state,
    });
    return response.data;
  },

  getFactors: async () => {
    const response = await api.get('/api/procedural/factors');
    return response.data;
  },
};

// ==================== Chatbot API ====================
export const chatbotAPI = {
  ask: async (message, context = null, conversationId = null) => {
    const response = await api.post('/api/chatbot/ask', {
      message: message,
      context: context,
      conversation_id: conversationId,
    });
    return response.data;
  },

  uploadDocument: async (file, conversationId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) {
      formData.append('conversation_id', conversationId);
    }
    const response = await api.post('/api/chatbot/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
    return response.data;
  },

  removeDocument: async (conversationId) => {
    const response = await api.delete(`/api/chatbot/document/${conversationId}`);
    return response.data;
  },

  classify: async (text) => {
    const response = await api.post('/api/chatbot/classify', {
      message: text,
    });
    return response.data;
  },

  extractEntities: async (text) => {
    const response = await api.post('/api/chatbot/extract-entities', {
      message: text,
    });
    return response.data;
  },

  getSuggestions: async (query = '') => {
    const response = await api.get('/api/chatbot/suggestions', {
      params: { query },
    });
    return response.data;
  },
};

// ==================== Outcome Calibration API ====================
export const outcomeAPI = {
  predict: async (caseData) => {
    const response = await api.post('/api/outcome/predict', {
      case_data: caseData,
    });
    return response.data;
  },

  getCalibration: async () => {
    const response = await api.get('/api/outcome/calibration');
    return response.data;
  },
};

// ==================== Case Prediction API ====================
export const predictionAPI = {
  predict: async (caseType, courtLevel, state, hearings = null, workload = null) => {
    const body = {
      case_type: caseType,
      court_level: courtLevel,
      state: state,
    };
    if (hearings !== null && hearings !== undefined) body.number_of_hearings = hearings;
    if (workload !== null && workload !== undefined) body.judge_workload = workload;
    const response = await api.post('/api/prediction/predict', body);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/prediction/stats');
    return response.data;
  },
};

// ==================== Auto Drafting API ====================
export const draftingAPI = {
  generate: async (caseFacts, documentType) => {
    const response = await api.post('/api/drafting/generate', {
      case_facts: caseFacts,
      document_type: documentType,
    });
    return response.data;
  },

  getCitations: async (caseFacts, documentType = 'petition') => {
    const response = await api.post('/api/drafting/citations', {
      case_facts: caseFacts,
      document_type: documentType,
    });
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/api/drafting/templates');
    return response.data;
  },

  generatePDF: async (caseFacts, documentType) => {
    const response = await api.post('/api/drafting/generate-pdf', {
      case_facts: caseFacts,
      document_type: documentType,
    });
    return response.data;
  },
};

export default api;
