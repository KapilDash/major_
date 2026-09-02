# ⚡ Quick Reference - Commands & Features

## 🚀 Start/Restart Application

### Terminal 1: Backend
```bash
cd d:\Major_project\backend
python run.py
```
**Expected:** "Uvicorn running on http://127.0.0.1:8000"

### Terminal 2: Frontend  
```bash
cd d:\Major_project\frontend\LegalAi
npm run dev
```
**Expected:** "Local: http://localhost:5173/"

---

## 🧪 Quick Tests (Copy & Paste)

### Test Chatbot (Real Google API)
1. Open http://localhost:5173
2. Click "ChatBot"
3. Ask: `"What is the punishment for IPC Section 498A?"`
4. ✅ Should get detailed answer (not mock)

### Test PDF Export
1. Go to "Precedent-Aligned Auto Drafting"
2. Select "Petition (Section 482)"
3. Enter: `"I was falsely accused of theft"`
4. Click "Generate Draft"
5. Click PDF icon (rightmost button)
6. ✅ File downloads as .pdf

### Test Real Data
1. Go to "Precedent Graph Engine"
2. Search: `"Criminal"`
3. ✅ Should show 200+ cases (not 3)
4. View statistics: Average delay, hearings, etc.

---

## 📊 Feature Status Dashboard

| Feature | Before | After | Status |
|---------|--------|-------|--------|
| Chatbot | Predefined Q&A | Google Gemini API | ✅ Live |
| Documents | Text only | PDF format | ✅ Live |
| Precedent Data | 3 mock | 1000+ real | ✅ Live |
| Case Details | Basic | Full metrics | ✅ Live |
| Dataset | Hardcoded | CSV file | ✅ Live |

---

## 🔧 Install Dependencies (If Needed)

```bash
# Backend dependencies
cd d:\Major_project\backend
pip install -r requirements.txt

# Specific packages for new features
pip install pandas==2.1.4 reportlab==4.0.9

# Frontend (if not already done)
cd d:\Major_project\frontend\LegalAi
npm install
```

---

## 📁 Key File Locations

```
d:\Major_project\
├── backend/
│   ├── app/
│   │   ├── services/
│   │   │   ├── data_loader.py         ← NEW: CSV loader
│   │   │   ├── google_api_service.py  ← UPDATED: Real API
│   │   │   ├── precedent_service.py   ← UPDATED: Real data
│   │   │   └── drafting_service.py    ← UPDATED: PDF
│   │   └── api/
│   │       └── drafting_routes.py     ← UPDATED: /generate-pdf
│   └── requirements.txt               ← UPDATED: +pandas +reportlab
├── frontend/
│   └── LegalAi/
│       └── src/
│           ├── pages/
│           │   └── AutoDrafting.jsx   ← UPDATED: PDF button
│           └── services/
│               └── api.js             ← UPDATED: generatePDF
├── datasets/
│   └── judicial_delay_dataset.csv     ← 1000+ cases
└── docs/
    ├── ACTIVATION_CHECKLIST.md
    ├── DATA_INTEGRATION_GUIDE.md
    └── IMPLEMENTATION_COMPLETE_V2.md
```

---

## 🔌 API Endpoints - New & Updated

### NEW: PDF Export
```
POST /api/drafting/generate-pdf
{
  "case_facts": "string",
  "document_type": "petition|bail|fir"
}
→ Returns: PDF as base64
```

### UPDATED: Chatbot (Now Real)
```
POST /api/chatbot/ask
{
  "message": "Your question"
}
→ Returns: Google Gemini response (or fallback)
```

### UPDATED: Precedent Search (Now Real Data)
```
POST /api/precedent/search
{
  "query": "Criminal",
  "case_type": "Criminal"
}
→ Returns: 1000+ real cases from dataset
```

---

## 🐛 Quick Troubleshooting

### "PDF download not working"
```bash
# Backend terminal:
pip install reportlab

# Then restart:
python run.py
```

### "Chatbot shows mock responses"
```
1. Check .env has GOOGLE_API_KEY
2. Get from: https://ai.google.dev/
3. Restart backend
4. Try question again
```

### "Precedent shows no cases"
```bash
# Check file exists:
dir d:\Major_project\datasets\judicial_delay_dataset.csv

# Restart backend to reload CSV:
python run.py
```

### "500 Error"
```bash
# Check backend logs for specific error
# Clear browser cache: Ctrl+Shift+Delete
# Restart both servers
```

---

## 📊 Data Reference

### Your CSV Dataset
- **Location:** `d:\Major_project\datasets\judicial_delay_dataset.csv`
- **Records:** 1000+ judicial cases
- **Case Types:** Criminal, Civil, Family, Commercial, Property
- **States:** Tamil Nadu, Delhi, Karnataka, Maharashtra, Uttar Pradesh
- **Years:** 2010-2023
- **Metrics:** Filing year, hearings, judge workload, disposal rate, delay

### Example Query
```python
# Search for all criminal cases
precedent_service.search_precedents("Criminal", "Criminal")

# Returns: 200+ criminal cases with:
# - Case ID, type, state, court
# - Number of hearings
# - Average delay (months)
# - Historical disposal rate
```

---

## 🎯 Feature Quick Guide

### Chatbot (ChatBot Page)
```
✅ Ask any legal question
✅ Get answer from Google Gemini AI
✅ Includes relevant citations
✅ Falls back to knowledge base if offline
❌ NOT limited to predefined Q&A anymore
```

### Document Drafting (Auto Drafting Page)
```
✅ Generate legal documents
✅ Choose template (Petition, Bail, FIR)
✅ Download as .txt
✅ Download as PDF (NEW!)
✅ Get quality metrics
✅ View cited precedents
```

### Precedent Graph (Precedent Graph Page)
```
✅ Search by case type
✅ See 1000+ real cases (not 3!)
✅ View case details and statistics
✅ Build graph relationships
✅ See dataset statistics
✅ Filter by case type and state
```

---

## 💾 How to Add More Data

### Add CSV File
```
1. Place new CSV in: d:\Major_project\datasets/
2. Ensure columns: case_type, filing_year, state, court_level, number_of_hearings, judge_workload, historical_disposal_rate, delay_months
3. Restart backend: python run.py
4. New data automatically loaded
```

### Example CSV Format
```csv
case_type,filing_year,state,court_level,number_of_hearings,judge_workload,historical_disposal_rate,delay_months
Criminal,2020,Delhi,High,25,450,0.65,35
Civil,2019,Maharashtra,District,18,550,0.45,28
Family,2021,Karnataka,Supreme,12,380,0.72,22
```

---

## 📱 Browser Console Debug Tips

### Check API Calls
```javascript
// Open F12 → Console
// Look for logs like:
✅ [API] POST http://localhost:8000/api/chatbot/ask
✅ [API] POST http://localhost:8000/api/drafting/generate-pdf
```

### Check Errors
```javascript
// Console should be clean
// If errors, check:
// 1. Backend running? (terminal shows no errors)
// 2. Frontend running? (terminal shows "Local: ...")
// 3. Both on localhost? (not 0.0.0.0)
```

---

## 🎓 Learning Path

### Day 1: Basics
- [ ] Restart servers
- [ ] Test each feature (3 min)
- [ ] Read ACTIVATION_CHECKLIST.md

### Day 2: Deep Dive
- [ ] Read DATA_INTEGRATION_GUIDE.md
- [ ] Check backend logs during use
- [ ] Verify dataset is being used

### Day 3: Customization
- [ ] Add your own dataset (if available)
- [ ] Modify PDF template
- [ ] Fine-tune chatbot prompts

---

## 🆘 Support Resources

### If Something Breaks
1. **Check File:**
   ```bash
   dir d:\Major_project\backend\app\services\data_loader.py
   ```

2. **Check Dependencies:**
   ```bash
   pip show pandas reportlab
   ```

3. **Check Logs:**
   ```bash
   # Backend terminal output
   # Frontend browser console (F12)
   ```

4. **Nuclear Option (Restart Fresh):**
   ```bash
   # Stop all terminals
   # Open new terminal
   cd d:\Major_project\backend
   python run.py
   # Open another terminal
   cd d:\Major_project\frontend\LegalAi
   npm run dev
   ```

---

## 🎉 Success Indicators

You'll know everything works when:
- ✅ Chatbot answer comes from Google (not predefined list)
- ✅ PDF button generates downloadable PDF file
- ✅ Precedent Graph shows 1000+ cases
- ✅ No "500 Error" messages
- ✅ Frontend console shows [API] logs without errors

---

## 📞 Quick Links

- **Google AI API:** https://ai.google.dev/
- **Pandas Docs:** https://pandas.pydata.org/
- **ReportLab Docs:** https://www.reportlab.com/
- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Docs:** https://react.dev/

---

**Last Updated:** April 17, 2026
**Version:** 2.0 (Real Data & Features)
**Status:** ✅ Production Ready
