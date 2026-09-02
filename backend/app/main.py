"""Main FastAPI application"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config.settings import settings
from app.api import (
    precedent_routes,
    risk_detector_routes,
    procedural_routes,
    chatbot_routes,
    outcome_routes,
    drafting_routes,
    prediction_routes
)

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1"]
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": settings.API_TITLE,
        "version": settings.API_VERSION
    }

# Include routers
app.include_router(precedent_routes.router, prefix="/api/precedent", tags=["Precedent Graph"])
app.include_router(risk_detector_routes.router, prefix="/api/detector", tags=["Risk Detector"])
app.include_router(procedural_routes.router, prefix="/api/procedural", tags=["Procedural Flow"])
app.include_router(chatbot_routes.router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(outcome_routes.router, prefix="/api/outcome", tags=["Outcome Calibration"])
app.include_router(drafting_routes.router, prefix="/api/drafting", tags=["Auto Drafting"])
app.include_router(prediction_routes.router, prefix="/api/prediction", tags=["Case Prediction"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Indian Judiciary AI System API",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
