"""API Routes - Case Prediction"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

from app.services.prediction_service import prediction_service


class PredictionRequest(BaseModel):
    case_type: str  # Criminal, Civil, Family, Commercial, Property
    court_level: str  # District, High, Supreme
    state: str  # Delhi, Maharashtra, etc.
    number_of_hearings: Optional[int] = None
    judge_workload: Optional[int] = None


@router.post("/predict")
async def predict_case(request: PredictionRequest):
    """Predict case delay and success rate"""
    try:
        result = prediction_service.predict(
            case_type=request.case_type,
            court_level=request.court_level,
            state=request.state,
            hearings=request.number_of_hearings,
            workload=request.judge_workload,
        )
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_stats():
    """Get dataset statistics for visualizations"""
    try:
        return prediction_service.get_dataset_stats()
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
