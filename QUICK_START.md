# ⚡ QUICK START CHECKLIST

## 🎯 Goal
Get the entire Indian Judiciary AI System (Frontend + Backend) running in 10 minutes!

---

## 📋 Pre-Flight Checklist

Before starting, verify you have:

- [ ] **Python 3.9+** installed
  ```bash
  python --version
  ```

- [ ] **Node.js 18+** installed
  ```bash
  node --version
  npm --version
  ```

- [ ] **Project folders exist**
  - [ ] `d:\Major_project\backend\`
  - [ ] `d:\Major_project\frontend\LegalAi\`

- [ ] **All backend files created** (should see these folders):
  - [ ] `d:\Major_project\backend\app\`
  - [ ] `d:\Major_project\backend\requirements.txt`
  - [ ] `d:\Major_project\backend\.env.example`

- [ ] **Frontend files intact**
  - [ ] `d:\Major_project\frontend\LegalAi\package.json`
  - [ ] `d:\Major_project\frontend\LegalAi\src\`

---

## 🚀 Step-by-Step Setup

### **OPTION 1: Automatic Setup (Recommended for Windows)**

#### **Step 1: Run the Startup Script**
```bash
# From project root
START.bat
```

In the menu, select:
```
3) Both Backend and Frontend
```

This will automatically:
- ✅ Create Python virtual environment
- ✅ Install all dependencies
- ✅ Start backend server (Terminal 1)
- ✅ Start frontend server (Terminal 2)

Then jump to "Status Check" below.

---

### **OPTION 2: Manual Setup (More Control)**

#### **Step 1: Setup Backend Virtual Environment**

```bash
# Open PowerShell and navigate
cd d:\Major_project\backend

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate.bat

# You should see (venv) prefix now
```

#### **Step 2: Install Backend Dependencies**

```bash
# Make sure (venv) is active, then:
pip install -r requirements.txt

# Wait for installation to complete...
# Verify: pip show fastapi (should show version)
```

#### **Step 3: Setup Environment File**

```bash
# Copy template
copy .env.example .env

# Edit .env
notepad .env
```

In `.env` file, update these:
```
GOOGLE_API_KEY=abc123xyz...  # Get from https://ai.google.dev/
DEBUG=True
PORT=8000
```

#### **Step 4: Start Backend Server**

```bash
# Make sure (venv) is active
python run.py

# Wait for:
# "Uvicorn running on http://127.0.0.1:8000"
```

✅ **Backend is running!** Keep this terminal open.

---

#### **Step 5: Setup Frontend (New Terminal)**

```bash
# Open NEW PowerShell window
cd d:\Major_project\frontend\LegalAi

# Install dependencies
npm install

# Wait for completion...
```

#### **Step 6: Start Frontend Server**

```bash
# Start dev server
npm run dev

# Wait for:
# "VITE v... ready in ... ms"
# "➜ Local: http://localhost:5173"
```

✅ **Frontend is running!** Keep this terminal open.

---

## ✅ Status Check

**If both terminals show success messages, you're ready!**

### **Terminal 1 (Backend) should show:**
```
╔══════════════════════════════════════════════════════════════╗
║     🏛️  INDIAN JUDICIARY AI SYSTEM - BACKEND SERVER 🏛️      ║
...
✨ API Documentation:    http://localhost:8000/docs
```

### **Terminal 2 (Frontend) should show:**
```
VITE v... dev server running at:

  ➜ Local:   http://localhost:5173/
  ➜ Press q to quit
```

---

## 🌐 Open in Browser

### **URL: http://localhost:5173**

You should see:
- ✅ Dashboard page loads
- ✅ Navigation sidebar visible
- ✅ All 6 features displayed
- ✅ No error messages

---

## 🔑 Getting Google API Key (If Needed)

The system works WITHOUT a Google API key (uses mock data), but for real responses:

1. Go to: **https://ai.google.dev/**
2. Click **"Get API Key"**
3. Create new project
4. Copy the API key
5. Paste into `backend/.env`:
   ```
   GOOGLE_API_KEY=your_key_here
   ```
6. Restart backend server

---

## 🧪 Quick Test

### **Test 1: Backend Health**

```bash
# In browser or terminal:
curl http://localhost:8000/health
```

Should return:
```json
{"status": "healthy"}
```

### **Test 2: API Docs**

Open in browser:
```
http://localhost:8000/docs
```

Should see:
- ✅ Swagger UI interface
- ✅ List of 30 endpoints
- ✅ Interactive testing panels

### **Test 3: Frontend Features**

Click on any feature in frontend:
- [ ] Dashboard - Shows charts
- [ ] Precedent Graph - Shows case graph
- [ ] Risk Detector - Shows risk analysis
- [ ] Procedural Flow - Shows timeline
- [ ] Chatbot - Ask a question
- [ ] Outcome Calibration - Shows prediction
- [ ] Auto Drafting - Shows document editor

---

## 🔗 Test Frontend-Backend Connection

In browser, open DevTools (F12) and click any feature button:

**Check Network tab:**
```
✅ Requests going to http://localhost:8000/api/*
✅ Responses showing data (200 status)
✅ No CORS errors
```

**Check Console tab:**
```
✅ No error messages
✅ API responses logged
✅ Data displayed on page
```

---

## ❌ Troubleshooting

### **Problem: "ModuleNotFoundError"**
```
Solution:
1. Make sure (venv) is activated (see "(venv)" prefix)
2. Run: pip install -r requirements.txt
3. Restart backend with: python run.py
```

### **Problem: "Port 8000 already in use"**
```
Solution:
1. Find process using port: netstat -ano | findstr :8000
2. Kill process: taskkill /PID <PID> /F
3. Or use different port: uvicorn app.main:app --port 8001
```

### **Problem: "npm ERR! ENOENT: no such file"**
```
Solution:
1. Make sure you're in: d:\Major_project\frontend\LegalAi
2. Run: npm install (again)
3. Clear cache: npm cache clean --force
```

### **Problem: Frontend not connecting to backend**
```
Solution:
1. Check backend running: http://localhost:8000/docs
2. Check frontend using correct URL: http://localhost:8000/api
3. Check firewall not blocking port 8000
4. Check .env has correct API URL
```

### **Problem: CORS error in console**
```
Solution:
1. Verify backend CORS is enabled (it is by default)
2. Check frontend URL in ALLOWED_ORIGINS (default: localhost:5173)
3. Restart both servers
```

---

## 📱 File Locations Reference

| File | Location | Purpose |
|------|----------|---------|
| Backend Config | `backend\.env` | API keys & settings |
| Backend Server | `backend\run.py` | Start backend |
| Frontend Config | `frontend\LegalAi\.env.local` | Frontend settings |
| Frontend Server | `frontend\LegalAi\package.json` | npm scripts |
| API Docs | http://localhost:8000/docs | Test endpoints |
| Frontend UI | http://localhost:5173 | Use the app |

---

## 🛑 Stopping Servers

When done, close the terminals by:

**Backend Terminal:**
```
Press: CTRL + C
Type: Y
Press: Enter
```

**Frontend Terminal:**
```
Press: CTRL + C
```

---

## ⚙️ Next Time You Start

You only need to do the important steps:

```bash
# Terminal 1
cd d:\Major_project\backend
.\venv\Scripts\activate.bat
python run.py

# Terminal 2
cd d:\Major_project\frontend\LegalAi
npm run dev
```

Or just use:
```bash
START.bat
```

---

## 📚 For More Information

- **Backend Details**: `backend\BACKEND_SETUP.md`
- **Integration Guide**: `FRONTEND_BACKEND_INTEGRATION.md`
- **Full Project Guide**: `README.md`
- **API Documentation**: http://localhost:8000/docs (when running)

---

## ✨ Success Indicators

You know everything is working when:

✅ Backend Terminal:
```
INFO:     Application startup complete
```

✅ Frontend Terminal:
```
➜ Local: http://localhost:5173/
```

✅ Browser opens and shows dashboard
✅ Click "Chatbot", type "Can I get bail?", get response
✅ DevTools Network tab shows API calls to `http://localhost:8000/api/`

---

## 🎉 You're Done!

The system is now fully operational with:

- ✅ React frontend (port 5173)
- ✅ FastAPI backend (port 8000)
- ✅ Google AI integration
- ✅ 30 API endpoints
- ✅ 6 complete features
- ✅ Mock data for testing
- ✅ Interactive API docs

**Start exploring and building!** 🚀

---

## 💡 Pro Tips

1. **Use Swagger UI to test API**: http://localhost:8000/docs
2. **Check DevTools when features don't work**: F12 → Network & Console tabs
3. **Backend auto-reloads when code changes**: Just save files
4. **Frontend hot-reloads**: Just save files, browser updates instantly
5. **Use `.env.local` for personal settings**: Won't be committed to git

---

## 🤔 Common Questions

**Q: Do I need a Google API key?**
A: No! System works with mock data. API key is optional for real responses.

**Q: What if I want to use a different port?**
A: Backend: `uvicorn app.main:app --port 8001`
Frontend: Update `vite.config.js` with `server.port = 3000`

**Q: How do I stop everything?**
A: Press CTRL+C in each terminal.

**Q: Can I access from mobile/another computer?**
A: Yes, change `localhost` to your computer IP in URLs.

**Q: Is my data saved?**
A: Currently uses mock data. To persist, add database (see BACKEND_SETUP.md).

---

**Ready?** Start with:
```bash
START.bat
```

Then open: **http://localhost:5173** 🎯
