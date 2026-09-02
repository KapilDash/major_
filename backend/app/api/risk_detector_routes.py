"""API Routes - Risk Detector"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import RiskDetectorRequest, RiskDetectorResponse
from app.services.risk_detector_service import RiskDetectorService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
risk_service = RiskDetectorService()

@router.post("/analyze", response_model=dict)
async def analyze_risk(request: RiskDetectorRequest):
    """Analyze case for risks and contradictions"""
    try:
        result = await risk_service.analyze_case(
            case_text=request.case_text,
            case_type=request.case_type
        )
        return result
    except Exception as e:
        logger.error(f"Error in analyze_risk: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/contradictions")
async def detect_contradictions(request: RiskDetectorRequest):
    """Detect contradictions in case"""
    try:
        result = await risk_service.analyze_case(
            case_text=request.case_text,
            case_type=request.case_type
        )
        return {"issues": result.get("issues", [])}
    except Exception as e:
        logger.error(f"Error detecting contradictions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
