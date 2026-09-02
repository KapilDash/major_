# Indian Judiciary AI System - Frontend

A comprehensive React-based frontend for an advanced legal intelligence system combining graph-based reasoning, predictive analytics, and adversarial NLP for court-aware decision support.

## 🚀 Features

### 1. **Precedent Graph Engine** (Feature 3)
- Build and visualize legal knowledge graphs
- Find similar precedents with similarity scores
- Analyze case relationships and citations
- Calculate precedent strength scores

### 2. **Contradiction & Risk Detector** (Feature 4)
- Detect weaknesses and contradictions in case arguments
- Identify missing evidence and procedural elements
- Simulate opponent counter-arguments
- Risk assessment scoring

### 3. **Procedural Flow Engine** (Feature 5)
- Predict case timelines and durations
- Analyze delay contributing factors
- Stage-wise delay probability assessment
- Court and state-specific predictions

### 4. **Hybrid Legal Chatbot** (Feature 6)
- Rule-based + LLM hybrid architecture
- Answer common legal questions accurately
- Prevent hallucinations with rule validation
- Explainable responses with legal references

### 5. **Outcome Calibration System** (Feature 7)
- Win probability predictions with confidence levels
- Model accuracy and calibration metrics
- Confidence distribution analysis
- Case outcome predictions

### 6. **Precedent-Aligned Auto Drafting** (Feature 8)
- Generate legally strong documents
- Automatic case citation insertion
- Template-based document generation
- Quality assurance metrics

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── pages/              # Feature pages
│   ├── Dashboard.jsx                    # Home and feature overview
│   ├── PrecedentGraph.jsx               # Legal graph visualization
│   ├── ContradictionDetector.jsx        # Risk analysis
│   ├── ProceduralFlow.jsx               # Timeline predictions
│   ├── ChatBot.jsx                      # Legal Q&A
│   ├── OutcomeCalibration.jsx           # Prediction confidence
│   └── AutoDrafting.jsx                 # Document generation
├── components/         # Reusable components (extensible)
├── services/          # API integration (ready for backend)
├── utils/             # Utility functions
├── App.jsx            # Main app with routing
├── App.css            # Global styles
├── index.css          # Tailwind imports
└── main.jsx           # Entry point
```

## 🎨 Features Breakdown

### Dashboard
- Overview of all 6 modules
- System advantages summary
- Technology stack information
- Comparison with generic LLMs

### Precedent Graph
- Interactive graph visualization (SVoom/drag)
- Case search functionality
- Precedent strength scoring
- Related cases analysis
- Similar case finder

### Contradiction Detector
- Multi-line case input
- Issue detection (contradictions, missing evidence)
- Severity classification (high/medium/low)
- Opponent attack simulation
- Overall risk scoring

### Procedural Flow
- Case type and court level selection
- Timeline visualization by stage
- Delay probability per stage
- Contributing factors analysis
- Court and state comparisons

### ChatBot
- Conversational interface
- Suggested common questions
- Hybrid rule + LLM responses
- Verification indicators
- Scrollable message history

### Outcome Calibration
- Win probability predictions
- Confidence level assessment
- Calibration curve visualization
- Model accuracy metrics
- Prediction factor breakdown

### Auto Drafting
- Document type selection
- Case fact input
- Automatic draft generation
- Citation management
- Download/copy functionality

## 🔄 API Integration Ready

Services folder is ready for backend integration:
```javascript
// services/api.js (ready for implementation)
const BASE_URL = 'http://localhost:8000/api';

export const precedentService = { /* ... */ };
export const riskDetectorService = { /* ... */ };
export const proceduralService = { /* ... */ };
// etc.
```

## 🎯 Future Enhancements

1. Backend integration (FastAPI/Node.js)
2. Real database connectivity
3. Advanced graph visualization (Cytoscape.js)
4. WebSocket for real-time chatbot
5. PDF export functionality
6. Advanced filtering and search
7. User authentication
8. Case history management
9. Collaborative features
10. Analytics dashboard

## 🔐 Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:8000/api
VITE_NODE_ENV=development
```

## 📝 Development Guidelines

### Adding New Pages
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in navbar

### Styling
Use Tailwind CSS utility classes. Custom styles in `App.css` if needed.

### State Management
Currently using React hooks. Consider Redux/Zustand for complex state.

### Form Handling
Use React hooks with controlled components.

## 🚢 Deployment

### Netlify
```bash
npm run build
# Deploy dist folder
```

### Vercel
```bash
# Connect GitHub repo directly
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📚 Documentation

Each page includes:
- Comprehensive headers explaining the feature
- Input forms with helpful placeholders
- Result visualizations with charts
- Educational explanations
- Mock data for demonstrations

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

MIT License - feel free to use this project

## 👥 Support

For issues or questions about the frontend:
- Check existing documentation
- Review component code comments
- Test with mock data first
- Verify browser compatibility

---

**Ready for Backend Integration!** 🎉

This frontend is fully functional with mock data and ready to integrate with your Python FastAPI backend for the Indian Judiciary AI System.
