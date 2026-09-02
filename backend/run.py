"""
Main entry point for the Indian Judiciary AI Backend Server

This module starts the FastAPI application with Uvicorn server.
Includes startup logging and configuration.
"""

import logging
import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent))

import uvicorn
from app.main import app
from app.config.settings import settings

# Setup logging
import os
log_dir = os.path.join(os.path.dirname(__file__), 'logs')
os.makedirs(log_dir, exist_ok=True)

log_handlers = [logging.StreamHandler()]
try:
    log_handlers.append(logging.FileHandler(os.path.join(log_dir, 'legal_ai.log')))
except Exception:
    pass

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=log_handlers
)

logger = logging.getLogger(__name__)


def main():
    """Start the FastAPI server"""
    
    print(f"""
================================================================
                                                              
     INDIAN JUDICIARY AI SYSTEM - BACKEND SERVER              
                                                              
                      FastAPI v0.104.1                        
                      Uvicorn ASGI Server                     
                                                              
================================================================

  SERVER CONFIGURATION:
    Host: {settings.HOST}
    Port: {settings.PORT}
    Debug: {settings.DEBUG}
    Environment: {settings.ENVIRONMENT}

  URLS:
    API Documentation:    http://localhost:{settings.PORT}/docs
    ReDoc:               http://localhost:{settings.PORT}/redoc
    Health Check:        http://localhost:{settings.PORT}/health
    Root:                http://localhost:{settings.PORT}/

  FEATURES AVAILABLE:
    [+] Precedent Graph Engine (Feature 3)
    [+] Risk Detector (Feature 4)
    [+] Procedural Flow (Feature 5)
    [+] Chatbot with Google API (Feature 6)
    [+] Outcome Calibration (Feature 7)
    [+] Auto Drafting (Feature 8)

  Starting server...
================================================================
    """)
    
    logger.info("Starting FastAPI application...")
    logger.info(f"Server running on {settings.HOST}:{settings.PORT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    try:
        uvicorn.run(
            "app.main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=settings.DEBUG,
            log_level="info"
        )
    except KeyboardInterrupt:
        logger.info("Server shutdown requested")
        print("\n\nServer stopped. Goodbye! 👋")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        print(f"\n❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
