# Frontend-Backend Integration Guide

## 📌 Overview

This guide explains how to connect your React frontend to the FastAPI backend.

---

## 🔧 Step 1: Create API Service Files

Create these files in your frontend:

### File: `src/services/api.js`

```javascript
import axios from 'axios';

// Get API URL from environment or use default
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
apiClient.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// PRECEDENT GRAPH SERVICE
// ============================================
export const precedentAPI = {
  /**
   * Search for similar precedent cases
   * @param {string} caseText - Case description
   * @param {string} caseType - 'criminal' or 'civil'
   * @returns {Promise<Object>} Search results with similar cases
   */
  search: (caseText, caseType = 'criminal') =>
    apiClient.post('/precedent/search', {
      case_text: caseText,
      case_type: caseType,
    }),

  /**
   * Analyze and build precedent graph
   * @param {Array} nodes - Case nodes
   * @param {Array} edges - Relationships
   * @returns {Promise<Object>} Analyzed graph data
   */
  analyze: (nodes, edges) =>
    apiClient.post('/precedent/analyze', {
      nodes,
      edges,
    }),

  /**
   * Get case details by ID
   * @param {string} caseId - Case identifier
   * @returns {Promise<Object>} Case details
   */
  getCase: (caseId) =>
    apiClient.get(`/precedent/cases/${caseId}`),
};

// ============================================
// RISK DETECTOR SERVICE
// ============================================
export const riskAPI = {
  /**
   * Analyze case for risks and issues
   * @param {string} caseText - Case description
   * @param {string} caseType - 'criminal' or 'civil'
   * @returns {Promise<Object>} Risk analysis with issues, counter-arguments, scores
   */
  analyze: (caseText, caseType = 'criminal') =>
    apiClient.post('/detector/analyze', {
      case_text: caseText,
      case_type: caseType,
    }),

  /**
   * Detect contradictions in case
   * @param {string} caseText - Case description
   * @returns {Promise<Object>} List of contradictions found
   */
  detectContradictions: (caseText) =>
    apiClient.post('/detector/contradictions', {
      case_text: caseText,
    }),
};

// ============================================
// PROCEDURAL FLOW SERVICE
// ============================================
export const proceduralAPI = {
  /**
   * Predict case timeline and delays
   * @param {string} caseType - 'criminal' or 'civil'
   * @param {string} courtLevel - 'district' or 'high'
   * @param {string} state - State code
   * @returns {Promise<Object>} Timeline with predicted delays per stage
   */
  predict: (caseType = 'criminal', courtLevel = 'district', state = 'DL') =>
    apiClient.post('/procedural/predict', {
      case_type: caseType,
      court_level: courtLevel,
      state,
    }),

  /**
   * Get delay factors explanation
   * @returns {Promise<Object>} List of factors affecting delays
   */
  getFactors: () =>
    apiClient.get('/procedural/factors'),
};

// ============================================
// CHATBOT SERVICE
// ============================================
export const chatbotAPI = {
  /**
   * Ask chatbot a legal question
   * @param {string} message - Question text
   * @param {Object} context - Optional context
   * @returns {Promise<Object>} Chatbot response
   */
  ask: (message, context = null) =>
    apiClient.post('/chatbot/ask', {
      message,
      context,
    }),

  /**
   * Classify a legal issue
   * @param {string} text - Issue description
   * @returns {Promise<Object>} Classification result
   */
  classify: (text) =>
    apiClient.post('/chatbot/classify', {
      text,
    }),

  /**
   * Extract entities from case text
   * @param {string} text - Case text
   * @returns {Promise<Object>} Extracted entities
   */
  extractEntities: (text) =>
    apiClient.post('/chatbot/extract-entities', {
      text,
    }),

  /**
   * Get suggested questions
   * @returns {Promise<Array>} List of common questions
   */
  getSuggestions: () =>
    apiClient.get('/chatbot/suggestions'),
};

// ============================================
// OUTCOME CALIBRATION SERVICE
// ============================================
export const outcomeAPI = {
  /**
   * Predict case outcome
   * @param {string} caseText - Case description
   * @param {string} caseType - 'criminal' or 'civil'
   * @param {number} yearsAgo - Case age in years
   * @returns {Promise<Object>} Outcome prediction with confidence
   */
  predict: (caseText, caseType = 'criminal', yearsAgo = 1) =>
    apiClient.post('/outcome/predict', {
      case_text: caseText,
      case_type: caseType,
      years_ago: yearsAgo,
    }),

  /**
   * Get calibration metrics
   * @returns {Promise<Object>} Calibration data
   */
  getCalibration: () =>
    apiClient.get('/outcome/calibration'),
};

// ============================================
// AUTO DRAFTING SERVICE
// ============================================
export const draftingAPI = {
  /**
   * Generate legal document
   * @param {string} docType - Document type (petition, bail, fir, argument, memorandum)
   * @param {Object} caseData - Case information
   * @returns {Promise<Object>} Generated document
   */
  generate: (docType, caseData) =>
    apiClient.post('/drafting/generate', {
      document_type: docType,
      case_data: caseData,
    }),

  /**
   * Get relevant citations
   * @param {string} topic - Legal topic
   * @returns {Promise<Object>} List of citations
   */
  getCitations: (topic) =>
    apiClient.post('/drafting/citations', {
      topic,
    }),

  /**
   * Get available templates
   * @returns {Promise<Object>} List of templates
   */
  getTemplates: () =>
    apiClient.get('/drafting/templates'),
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthAPI = {
  /**
   * Check backend health
   * @returns {Promise<Object>} Server status
   */
  check: () =>
    apiClient.get('/health'),

  /**
   * Get API status
   * @returns {Promise<Object>} API documentation root
   */
  status: () =>
    apiClient.get('/'),
};

export default apiClient;
```

---

## 📝 Step 2: Create Environment File

Create or update: `frontend/LegalAi/.env.local`

```env
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Optional: Add other config
VITE_APP_VERSION=1.0.0
VITE_APP_TITLE=Indian Judiciary AI
```

---

## 🎨 Step 3: Update Frontend Components

### Example: ChatBot Component

File: `src/components/ChatBot.jsx`

```jsx
import { useState, useEffect } from 'react';
import { chatbotAPI } from '../services/api';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Load suggestions on mount
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const response = await chatbotAPI.getSuggestions();
        setSuggestions(response.data.suggestions);
      } catch (error) {
        console.error('Failed to load suggestions:', error);
      }
    };
    loadSuggestions();
  }, []);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call chatbot API
      const response = await chatbotAPI.ask(input);
      
      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Messages */}
      <div className="bg-white rounded-lg p-4 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center">
            <p className="mb-4">Ask me anything about Indian law!</p>
            <div className="space-y-2">
              {suggestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q);
                  }}
                  className="block w-full text-left p-2 hover:bg-gray-100 rounded"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 ${
                msg.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <p
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                {msg.content}
              </p>
            </div>
          ))
        )}
        {loading && <p className="text-gray-500">Typing...</p>}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a legal question..."
          disabled={loading}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

### Example: Risk Detector Component

File: `src/components/RiskDetector.jsx`

```jsx
import { useState } from 'react';
import { riskAPI } from '../services/api';

export default function RiskDetector() {
  const [caseText, setCaseText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!caseText.trim()) {
      setError('Please enter case details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await riskAPI.analyze(caseText, 'criminal');
      setAnalysis(response.data);
    } catch (err) {
      setError('Failed to analyze case. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input */}
      <textarea
        value={caseText}
        onChange={(e) => setCaseText(e.target.value)}
        placeholder="Enter case details..."
        className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        rows="6"
      />

      {/* Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze for Risks'}
      </button>

      {/* Results */}
      {error && <p className="text-red-500">{error}</p>}

      {analysis && (
        <div className="bg-white border rounded-lg p-4 space-y-4">
          <h3 className="font-bold text-lg">Analysis Results</h3>

          {/* Issues */}
          {analysis.issues && analysis.issues.length > 0 && (
            <div>
              <h4 className="font-semibold">Issues Found:</h4>
              <ul className="list-disc ml-6 space-y-1">
                {analysis.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Counter Arguments */}
          {analysis.counter_arguments && (
            <div>
              <h4 className="font-semibold">Counter Arguments:</h4>
              {analysis.counter_arguments.map((arg, idx) => (
                <div key={idx} className="bg-gray-100 p-2 rounded mt-2">
                  <p className="font-semibold">{arg.title}</p>
                  <p className="text-sm">{arg.argument}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations && (
            <div>
              <h4 className="font-semibold">Recommendations:</h4>
              <ul className="list-disc ml-6 space-y-1">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Risk Score */}
          {analysis.risk_score !== undefined && (
            <div>
              <p>Overall Risk Score: <span className="font-bold">{analysis.risk_score.toFixed(2)}</span></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 Step 4: Update Frontend Dependencies

Make sure your `package.json` includes axios:

```bash
cd frontend/LegalAi
npm install axios
```

Update `package.json` if needed:

```json
{
  "dependencies": {
    "axios": "^1.6.2",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.3",
    "lucide-react": "^0.408.0",
    "tailwindcss": "^4.2.2"
  }
}
```

---

## 🧪 Step 5: Test the Integration

### Terminal 1: Start Backend
```bash
cd backend
.\venv\Scripts\activate.bat
python run.py
```

### Terminal 2: Start Frontend
```bash
cd frontend/LegalAi
npm run dev
```

### Browser: Test API
1. Open http://localhost:5173 (Frontend)
2. Click on any feature
3. Check browser DevTools Console for API calls
4. Verify responses from backend

---

## 🔍 Debugging Tips

### Check API Connectivity

```javascript
// In browser console
import axios from 'axios';
axios.get('http://localhost:8000/health').then(r => console.log(r.data));
```

### View API Calls

Open Developer Tools → Network tab
- Look for requests to `localhost:8000`
- Check Response tab for data
- Check for CORS errors

### Backend Logs

Watch terminal where backend is running for:
- Request logs
- Error messages
- Stack traces

---

## ✅ Checklist

- ✅ Backend running on port 8000
- ✅ Frontend running on port 5173
- ✅ `api.js` service file created
- ✅ `.env.local` configured
- ✅ axios installed in frontend
- ✅ Components updated to use API services
- ✅ No CORS errors in console
- ✅ API responses showing in network tab

---

**Frontend-Backend integration is complete!** ✨

Now your React frontend can communicate with the FastAPI backend for all 6 features.
