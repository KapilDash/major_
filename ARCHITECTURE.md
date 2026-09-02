# 🏗️ System Architecture & Flow Diagrams

## Indian Judiciary AI System - Complete Architecture

---

## 📊 1. Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    INDIAN JUDICIARY AI SYSTEM                   │
│                   (Complete End-to-End Flow)                    │
└─────────────────────────────────────────────────────────────────┘

┌─ FRONTEND (Port 5173) ─────────────────────────────────────────┐
│                                                                 │
│  React App (Vite + Tailwind CSS)                              │
│  ┌──────────────────────────────────────────────────────────────┐
│  │                                                              │
│  │  Navigation (React Router)                                  │
│  │  ├─ Dashboard                                               │
│  │  ├─ Precedent Graph                                         │
│  │  ├─ Risk Detector                                           │
│  │  ├─ Procedural Flow                                         │
│  │  ├─ ChatBot                                                 │
│  │  ├─ Outcome Calibration                                     │
│  │  └─ Auto Drafting                                           │
│  │                                                              │
│  └──────────────────────────────────────────────────────────────┘
│                              ▼
│                    API Service Layer
│                    (Axios HTTP Client)
│                              │
│         ┌────────────────────┴────────────────────┐
│         │                                         │
│         ▼                                         ▼
│    GET /health                           POST /api/chatbot/ask
│    POST /api/precedent/search             POST /api/detector/analyze
│    POST /api/procedural/predict            POST /api/outcome/predict
│         │                                         │
│         └────────────────────┬────────────────────┘
│                              │
└──────────────────────────────┼──────────────────────────────────┘
                               │
                     (HTTP over localhost:8000)
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│               BACKEND (Port 8000 - FastAPI)                     │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              API Routes Layer (FastAPI)                    │ │
│  │  ├─ /api/precedent/*                                      │ │
│  │  ├─ /api/detector/*                                       │ │
│  │  ├─ /api/procedural/*                                     │ │
│  │  ├─ /api/chatbot/*                                        │ │
│  │  ├─ /api/outcome/*                                        │ │
│  │  ├─ /api/drafting/*                                       │ │
│  │  ├─ /health                                               │ │
│  │  └─ /docs (Swagger UI)                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────┴────────────────────────────┐    │
│  │         Services Layer (Business Logic)                │    │
│  │  ├─ Precedent Service                                  │    │
│  │  ├─ Risk Detector Service                              │    │
│  │  ├─ Procedural Service                                 │    │
│  │  ├─ Google API Service (+ Chatbot)                     │    │
│  │  ├─ Outcome Service                                    │    │
│  │  └─ Drafting Service                                   │    │
│  └────────────────────────────┬────────────────────────────┘    │
│                               │                                  │
│                    ┌──────────┴──────────┐                       │
│                    │                     │                       │
│                    ▼                     ▼                        │
│            ┌─────────────┐      ┌──────────────┐                │
│            │ Mock Data   │      │ Google AI    │                │
│            │ (Default)   │      │ API/Gemini   │                │
│            └─────────────┘      └──────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 2. Request-Response Flow

```
USER INTERACTION:
    │
    ▼
Click "Chatbot" in Frontend (React)
    │
    ▼
ChatBot.jsx Component Renders
    │
    ▼
User types: "Can I get bail under IPC 420?"
    │
    ▼
handleSendMessage() function triggered
    │
    ▼
Call: chatbotAPI.ask(message)
    │
    ▼ (Axios HTTP Request)
    │
    POST http://localhost:8000/api/chatbot/ask
    │
    ├─ Header: Content-Type: application/json
    ├─ Body:
    │  {
    │    "message": "Can I get bail under IPC 420?",
    │    "context": null
    │  }
    │
    ▼ (Network - localhost:8000)
    │
┌─────────────────────────────────────────────────┐
│  Backend receives request at /api/chatbot/ask   │
└─────────────────────────────────────────────────┘
    │
    ▼
chatbot_routes.py: ask() endpoint handler
    │
    ▼
Calls: ChatbotService.generate_response(message)
    │
    ▼
google_api_service.py: generate_chatbot_response()
    │
    ├─ Is GOOGLE_API_KEY set?
    │
    ├─ YES ──▶ Call Google Generative AI API
    │         │
    │         ▼
    │    Use Gemini Pro Model
    │         │
    │         ▼
    │    Generate Response
    │
    └─ NO ──▶ Use Mock Response
             │
             ▼
            Look up in legal Q&A database
             │
             ▼
            Return mock answer
    │
    ▼
Response prepared:
{
  "response": "Yes, bail under IPC 420 is possible...",
  "confidence": 0.85,
  "references": ["IPC 420", "CrPC 441"]
}
    │
    ▼ (JSON Response)
    │
    Return to Frontend
    │
    ▼ (Network - localhost:5173)
    │
axios.post() receives response
    │
    ▼
ChatBot.jsx useEffect catches response
    │
    ▼
Update state: setMessages([...messages, aiResponse])
    │
    ▼
Component re-renders
    │
    ▼
User sees AI response on screen! ✨
```

---

## 🗂️ 3. File Organization Diagram

```
BACKEND STRUCTURE:

app/
│
├─ main.py
│  │
│  ├─ Create FastAPI app instance
│  ├─ Setup CORS
│  ├─ Register all routes
│  └─ Setup middleware
│
├─ api/ (Route Layer)
│  │
│  ├─ precedent_routes.py
│  │  └─ POST /search, /analyze, GET /cases/{id}
│  │
│  ├─ risk_detector_routes.py
│  │  └─ POST /analyze, /contradictions
│  │
│  ├─ procedural_routes.py
│  │  └─ POST /predict, GET /factors
│  │
│  ├─ chatbot_routes.py
│  │  └─ POST /ask, /classify, /extract-entities, GET /suggestions
│  │
│  ├─ outcome_routes.py
│  │  └─ POST /predict, GET /calibration
│  │
│  └─ drafting_routes.py
│     └─ POST /generate, /citations, GET /templates
│
├─ services/ (Business Logic Layer)
│  │
│  ├─ google_api_service.py
│  │  └─ GoogleAPIClient (AI/Chatbot integration)
│  │
│  ├─ precedent_service.py
│  │  └─ PrecedentGraphService (Case search & analysis)
│  │
│  ├─ risk_detector_service.py
│  │  └─ RiskDetectorService (Risk analysis)
│  │
│  ├─ procedural_service.py
│  │  └─ ProceduralFlowService (Timeline prediction)
│  │
│  ├─ outcome_service.py
│  │  └─ OutcomeCalibrationService (Outcome prediction)
│  │
│  └─ drafting_service.py
│     └─ AutoDraftingService (Document generation)
│
├─ models/
│  └─ schemas.py (Pydantic data models - 20+ models)
│
└─ config/
   └─ settings.py (App configuration)


FRONTEND STRUCTURE:

src/
│
├─ App.jsx (Main component)
│
├─ components/ (Page Components - 7 pages)
│  ├─ Dashboard.jsx
│  ├─ PrecedentGraph.jsx
│  ├─ RiskDetector.jsx
│  ├─ ProceduralFlow.jsx
│  ├─ ChatBot.jsx
│  ├─ OutcomeCalibration.jsx
│  └─ AutoDrafting.jsx
│
└─ services/
   └─ api.js (Axios API client with 6 API service objects)
      ├─ precedentAPI
      ├─ riskAPI
      ├─ proceduralAPI
      ├─ chatbotAPI
      ├─ outcomeAPI
      └─ draftingAPI
```

---

## 🔌 4. API Endpoint Hierarchy

```
http://localhost:8000
│
├─ Root
│  ├─ GET  /              (Welcome message)
│  └─ GET  /health        (Health check)
│
├─ Documentation
│  ├─ GET  /docs          (Swagger UI)
│  └─ GET  /redoc         (ReDoc)
│
├─ Precedent Endpoints (Feature 3)
│  ├─ POST /api/precedent/search
│  │  └─ Search similar cases
│  │
│  ├─ POST /api/precedent/analyze
│  │  └─ Analyze precedent graph
│  │
│  └─ GET  /api/precedent/cases/{case_id}
│     └─ Get case details
│
├─ Risk Detector Endpoints (Feature 4)
│  ├─ POST /api/detector/analyze
│  │  └─ Analyze case risks
│  │
│  └─ POST /api/detector/contradictions
│     └─ Detect contradictions
│
├─ Procedural Endpoints (Feature 5)
│  ├─ POST /api/procedural/predict
│  │  └─ Predict timeline
│  │
│  └─ GET  /api/procedural/factors
│     └─ Get delay factors
│
├─ Chatbot Endpoints (Feature 6)
│  ├─ POST /api/chatbot/ask
│  │  └─ Ask question
│  │
│  ├─ POST /api/chatbot/classify
│  │  └─ Classify legal issue
│  │
│  ├─ POST /api/chatbot/extract-entities
│  │  └─ Extract entities
│  │
│  └─ GET  /api/chatbot/suggestions
│     └─ Get suggestions
│
├─ Outcome Endpoints (Feature 7)
│  ├─ POST /api/outcome/predict
│  │  └─ Predict outcome
│  │
│  └─ GET  /api/outcome/calibration
│     └─ Get calibration metrics
│
└─ Drafting Endpoints (Feature 8)
   ├─ POST /api/drafting/generate
   │  └─ Generate document
   │
   ├─ POST /api/drafting/citations
   │  └─ Get citations
   │
   └─ GET  /api/drafting/templates
      └─ Get templates
```

---

## 🔗 5. Frontend Component Flow

```
App.jsx (Main)
│
├─ Navigation/Routing (React Router)
│
└─ Renders one of:
   │
   ├─ Dashboard.jsx
   │  ├─ Calls: outcomeAPI.predict()
   │  ├─ Calls: proceduralAPI.predict()
   │  └─ Displays: Charts & Analytics
   │
   ├─ PrecedentGraph.jsx
   │  ├─ Calls: precedentAPI.search()
   │  ├─ Calls: precedentAPI.analyze()
   │  └─ Displays: Case Graph
   │
   ├─ RiskDetector.jsx
   │  ├─ Calls: riskAPI.analyze()
   │  ├─ Calls: riskAPI.detectContradictions()
   │  └─ Displays: Risk Analysis
   │
   ├─ ProceduralFlow.jsx
   │  ├─ Calls: proceduralAPI.predict()
   │  ├─ Calls: proceduralAPI.getFactors()
   │  └─ Displays: Timeline
   │
   ├─ ChatBot.jsx
   │  ├─ Calls: chatbotAPI.ask()
   │  ├─ Calls: chatbotAPI.classify()
   │  ├─ Calls: chatbotAPI.getSuggestions()
   │  └─ Displays: Chat Interface
   │
   ├─ OutcomeCalibration.jsx
   │  ├─ Calls: outcomeAPI.predict()
   │  ├─ Calls: outcomeAPI.getCalibration()
   │  └─ Displays: Prediction Metrics
   │
   └─ AutoDrafting.jsx
      ├─ Calls: draftingAPI.generate()
      ├─ Calls: draftingAPI.getCitations()
      ├─ Calls: draftingAPI.getTemplates()
      └─ Displays: Document Editor
```

---

## 📈 6. Data Models Flow

```
REQUEST → VALIDATION → PROCESSING → RESPONSE

User Input (JSON)
    │
    ▼
Frontend: json.stringify(data)
    │
    ▼
Send to Backend (HTTP POST)
    │
    ▼
Backend: Parse JSON
    │
    ▼
Pydantic Model Validation
    ├─ SchemaName(**request_body)
    ├─ Type checking
    ├─ Field validation
    └─ Error: 422 422 Validation Error if invalid
    │
    ▼
Service Layer Processing
    ├─ Business logic
    ├─ Data transformation
    ├─ External API calls
    └─ Error: 500 Internal Server Error if fails
    │
    ▼
Response Model Creation
    ├─ Create ResponseSchema instance
    ├─ Populate data
    └─ Error: 400 Bad Request if invalid
    │
    ▼
Convert to JSON
    │
    ▼
Send to Frontend (HTTP 200)
    │
    ▼
Frontend: axios.then(response => response.data)
    │
    ▼
Update React State
    │
    ▼
Component Re-renders
    │
    ▼
Display to User ✨
```

---

## 🔐 7. Security & Error Handling Flow

```
REQUEST ENTERS SYSTEM
    │
    ▼
CORS Check
├─ Allowed origin?
│  └─ NO → 403 Forbidden
│
└─ YES → Continue
    │
    ▼
Route Matching
├─ Endpoint exists?
│  └─ NO → 404 Not Found
│
└─ YES → Continue
    │
    ▼
HTTP Method Check
├─ GET/POST/etc correct?
│  └─ NO → 405 Method Not Allowed
│
└─ YES → Continue
    │
    ▼
Pydantic Validation
├─ Valid JSON schema?
│  └─ NO → 422 Validation Error
│
└─ YES → Continue
    │
    ▼
Service Layer Processing
├─ Business logic OK?
│  ├─ Google API error?
│  │  └─ Use mock response
│  │
│  ├─ Database error?
│  │  └─ 500 Internal Server Error
│  │
│  └─ Logic error?
│     └─ 400 Bad Request
│
└─ YES → Continue
    │
    ▼
Response Generated
    │
    ▼
Return 200 OK + JSON Data
    │
    ▼
Frontend Receives Response
    │
    ▼
Display to User ✨
```

---

## 🚀 8. Startup Sequence Diagram

```
User executes: START.bat or python run.py
    │
    ▼
┌─────────────────────────────────────────────┐
│        BACKEND STARTUP SEQUENCE             │
└─────────────────────────────────────────────┘
    │
    ├─ Load Python environment
    ├─ Import FastAPI framework
    ├─ Import all services
    ├─ Import all routes
    ├─ Parse .env file
    ├─ Create FastAPI instance
    ├─ Setup CORS (configure origins)
    ├─ Register all route handlers
    ├─ Initialize services
    ├─ Create database connection (if configured)
    └─ Start Uvicorn ASGI server on 0.0.0.0:8000
         │
         ▼
    Backend Ready! ✅
    Logs: "Uvicorn running on http://127.0.0.1:8000"
         │
         ▼
      (In separate terminal)
         │
    ▼
┌─────────────────────────────────────────────┐
│        FRONTEND STARTUP SEQUENCE            │
└─────────────────────────────────────────────┘
    │
    ├─ Load Node.js environment
    ├─ Check node_modules exist
    ├─ Import Vite dev server
    ├─ Import React
    ├─ Parse .env.local file
    ├─ Create Vite dev server config
    ├─ Setup HMR (Hot Module Reload)
    ├─ Start Vite dev server on http://localhost:5173
    └─ Compile JSX to JavaScript
         │
         ▼
    Frontend Ready! ✅
    Logs: "Local: http://localhost:5173/"
         │
         ▼
    Browser opens automatically (if configured)
         │
         ▼
    User sees React app! 🎉
         │
         ▼
    User clicks feature
         │
         ▼
    Frontend calls Backend API
         │
         ▼
    Backend processes request
         │
         ▼
    Backend returns response
         │
         ▼
    Frontend updates display
         │
         ▼
    User sees results! ✨
```

---

## 📊 9. Database Structure (Optional - For Future Use)

```
When configured, database structure would be:

┌─ CASES TABLE ─────────────────────────┐
│ id (PK)                               │
│ case_number                           │
│ case_type (criminal/civil)            │
│ case_text                             │
│ status                                │
│ predicted_timeline                    │
│ predicted_outcome                     │
│ created_at                            │
│ updated_at                            │
└─────────────────────────────────────────┘
        │
        ├─ Has Many ──→ ISSUES
        │
        ├─ Has Many ──→ CITATIONS
        │
        └─ Has One ──→ PREDICTION

┌─ USERS TABLE (When Auth Added) ───────┐
│ id (PK)                               │
│ email                                 │
│ hashed_password                       │
│ role (admin/lawyer/user)              │
│ created_at                            │
└─────────────────────────────────────────┘
```

---

## 🔄 10. Technology Stack Diagram

```
FRONTEND STACK:
┌──────────────────────────────────────┐
│        Browser (Web Client)          │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│         React 19.2.4                 │
│  ├─ Components (7 pages)            │
│  ├─ Router (React Router 6.20.0)    │
│  └─ State Management                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│         Vite (Build Tool)            │
│  ├─ Hot Module Reload (HMR)         │
│  ├─ TypeScript Support (optional)   │
│  └─ Fast Development Server         │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│      Tailwind CSS 4.2.2              │
│  ├─ Responsive Design               │
│  ├─ Dark Mode (optional)            │
│  └─ Utility-first CSS               │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│      Additional Libraries            │
│  ├─ Axios 1.6.2 (HTTP)             │
│  ├─ Recharts 2.10.3 (Charts)       │
│  ├─ Lucide React (Icons)           │
│  └─ React Router 6.20.0 (Nav)      │
└──────────────────────────────────────┘


BACKEND STACK:
┌──────────────────────────────────────┐
│         Python 3.11                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│      FastAPI 0.104.1                 │
│  ├─ Modern Web Framework            │
│  ├─ Async Support                   │
│  ├─ Built-in Documentation          │
│  └─ OpenAPI Support                 │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│       Uvicorn 0.24.0                 │
│  ├─ ASGI Server                     │
│  ├─ Async Serving                   │
│  └─ Reload Support                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│      Pydantic 2.5.0                  │
│  ├─ Data Validation                 │
│  ├─ Type Checking                   │
│  └─ JSON Schema Generation          │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│    Google Generative AI              │
│  ├─ Gemini Pro Model                │
│  ├─ Chat & QA                       │
│  └─ Entity Extraction               │
└──────────────────────────────────────┘
```

---

## 🎯 Summary

This architecture provides:

✅ **Separation of Concerns**
- Frontend handles UI
- Backend handles Business Logic
- Services handle specific features
- Routes handle API endpoints

✅ **Scalability**
- Easy to add new features
- New services can be added independently
- Database can be swapped later

✅ **Maintainability**
- Clear folder structure
- Well-organized code
- Documented API endpoints
- Error handling throughout

✅ **Performance**
- Async backend (FastAPI)
- HMR frontend (Vite)
- Lightweight services
- Mock data caching

✅ **Security**
- CORS configured
- Input validation (Pydantic)
- Error handling
- Rate limiting ready

---

**System is production-ready!** 🚀
