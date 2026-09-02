#!/usr/bin/env python
"""Start the FastAPI backend server"""
import os
import sys
import uvicorn

# Set the current directory to backend
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
