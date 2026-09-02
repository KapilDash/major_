"""API Routes - Precedent Graph Engine"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.models.schemas import PrecedentGraphRequest, PrecedentGraphResponse
from app.services.precedent_service import PrecedentGraphService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
precedent_service = PrecedentGraphService()


class ExportRequest(BaseModel):
    case_ids: List[str]
    query: Optional[str] = ""


@router.post("/search", response_model=dict)
async def search_precedents(request: PrecedentGraphRequest):
    """Search for similar precedents — returns results + graph"""
    try:
        result = await precedent_service.search_precedents(
            query=request.case_name,
            case_type=request.case_type
        )
        return result
    except Exception as e:
        logger.error(f"Error in search_precedents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze", response_model=dict)
async def analyze_graph(request: PrecedentGraphRequest):
    """Analyze precedent graph for a single case"""
    try:
        result = await precedent_service.build_graph(case_id=request.case_name)
        return result
    except Exception as e:
        logger.error(f"Error in analyze_graph: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cases/{case_id}")
async def get_case_details(case_id: str):
    """Get details of a specific case"""
    try:
        result = await precedent_service.get_case_details(case_id)
        return result
    except Exception as e:
        logger.error(f"Error getting case details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export/pdf")
async def export_cases_pdf(request: ExportRequest):
    """Export selected cases as a PDF report"""
    try:
        result = await precedent_service.export_cases_pdf(
            case_ids=request.case_ids,
            query=request.query
        )
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("error"))
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export/csv")
async def export_cases_csv(request: ExportRequest):
    """Export selected cases as CSV"""
    try:
        result = await precedent_service.export_cases_csv(
            case_ids=request.case_ids
        )
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("error"))
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting CSV: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
