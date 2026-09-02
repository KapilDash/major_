"""API Routes - Procedural Flow"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import ProcedureRequest
from app.services.procedural_service import ProceduralFlowService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
procedural_service = ProceduralFlowService()

@router.post("/predict")
async def predict_timeline(request: ProcedureRequest):
    """Predict case timeline"""
    try:
        result = await procedural_service.predict_timeline(
            case_type=request.case_type,
            court=request.court,
            state=request.state
        )
        return result
    except Exception as e:
        logger.error(f"Error in predict_timeline: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/factors")
async def get_delay_factors():
    """Get delay contributing factors"""
    try:
        service = ProceduralFlowService()
        return {"factors": service._get_delay_factors()}
    except Exception as e:
        logger.error(f"Error getting factors: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
