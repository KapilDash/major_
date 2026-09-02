#!/bin/bash
# Quick Start Guide for LegalAI Frontend

echo "========================================="
echo "LegalAI Frontend - Quick Start Guide"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")" || exit
echo "📁 Working directory: $(pwd)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "========================================="
echo "✨ Setup Complete!"
echo "========================================="
echo ""
echo "Available commands:"
echo ""
echo "  📱 Start development server:"
echo "     npm run dev"
echo ""
echo "  🏗️  Build for production:"
echo "     npm run build"
echo ""
echo "  👀 Preview production build:"
echo "     npm run preview"
echo ""
echo "  🔍 Run linting:"
echo "     npm run lint"
echo ""
echo "========================================="
echo ""
echo "📚 Features Implemented:"
echo "  1. ⚖️  Dashboard - Overview & navigation"
echo "  2. 📊 Precedent Graph Engine"
echo "  3. ⚠️  Contradiction & Risk Detector"
echo "  4. ⏱️  Procedural Flow Engine"
echo "  5. 💬 Hybrid Legal Chatbot"
echo "  6. 📈 Outcome Calibration System"
echo "  7. 📝 Precedent-Aligned Auto Drafting"
echo ""
echo "To get started, run:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
