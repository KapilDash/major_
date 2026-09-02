"""API Routes - Auto Drafting"""
from fastapi import APIRouter, HTTPException
from app.models.schemas import DraftingRequest
from app.services.drafting_service import AutoDraftingService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
drafting_service = AutoDraftingService()

@router.post("/generate")
async def generate_document(request: DraftingRequest):
    """Generate legal document"""
    try:
        result = await drafting_service.generate_document(
            case_facts=request.case_facts,
            doc_type=request.document_type
        )
        return result
    except Exception as e:
        logger.error(f"Error in generate_document: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/citations")
async def get_citations(request: DraftingRequest):
    """Get citations for document"""
    try:
        service = AutoDraftingService()
        citations = await service._get_relevant_citations(request.case_facts)
        return {"citations": citations}
    except Exception as e:
        logger.error(f"Error getting citations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/templates")
async def get_templates():
    """Get available document templates"""
    try:
        return {
            "templates": [
                {"name": "Petition (Section 482)", "id": "petition"},
                {"name": "Bail Application", "id": "bail"},
                {"name": "FIR", "id": "fir"},
                {"name": "Legal Arguments", "id": "argument"},
                {"name": "Memorandum", "id": "memorandum"}
            ]
        }
    except Exception as e:
        logger.error(f"Error getting templates: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-pdf")
async def generate_pdf(request: DraftingRequest):
    """Generate PDF version of legal document"""
    try:
        result = await drafting_service.generate_pdf(
            case_facts=request.case_facts,
            doc_type=request.document_type,
            document_content=request.additional_content if hasattr(request, 'additional_content') else None
        )
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result.get("error"))
        
        return result
    except Exception as e:
        logger.error(f"Error in generate_pdf: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
