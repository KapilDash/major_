"""Pydantic models for request/response validation"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# ==================== Precedent Graph Models ====================

class CaseNode(BaseModel):
    id: str
    label: str
    type: str  # "case" or "section"
    citations: int
    court: Optional[str] = None
    year: Optional[int] = None

class CaseEdge(BaseModel):
    source: str
    target: str
    relation: str  # "cites", "applies", "overrules", etc.

class PrecedentGraphRequest(BaseModel):
    case_name: str
    case_type: str
    query: Optional[str] = None

class PrecedentGraphResponse(BaseModel):
    nodes: List[CaseNode]
    edges: List[CaseEdge]
    similar_cases: List[Dict[str, Any]]
    precedent_strength_scores: Dict[str, float]

# ==================== Risk Detector Models ====================

class Issue(BaseModel):
    id: int
    type: str  # "contradiction", "missing", "weak", "procedural"
    severity: str  # "high", "medium", "low"
    title: str
    description: str
    location: str
    suggestion: str

class CounterArgument(BaseModel):
    id: int
    argument: str
    likelihood: float  # 0-100

class RiskDetectorRequest(BaseModel):
    case_text: str
    case_type: str
    case_id: Optional[str] = None

class RiskDetectorResponse(BaseModel):
    overall_risk_score: float  # 0-100
    risk_level: str  # "high", "medium", "low"
    issues: List[Issue]
    counter_arguments: List[CounterArgument]
    recommendations: List[str]
    timestamp: datetime = Field(default_factory=datetime.now)

# ==================== Procedural Flow Models ====================

class TimelineStage(BaseModel):
    stage: str
    duration: int  # months
    delay_probability: float  # 0-100

class ProcedureRequest(BaseModel):
    case_type: str  # "criminal" or "civil"
    court: str  # "district", "high", "supreme"
    state: str

class ProcedureResponse(BaseModel):
    expected_duration: int  # months
    worst_case_duration: int  # months
    delay_probability: float  # 0-100
    stages: List[TimelineStage]
    delay_factors: Dict[str, float]
    stage_wise_risk: Dict[str, float]

# ==================== Chatbot Models ====================

class ChatMessage(BaseModel):
    id: Optional[str] = None
    type: str  # "user" or "assistant"
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)
    verified: bool = False
    references: Optional[List[str]] = None

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    message_id: str
    content: str
    verified: bool
    references: List[str]
    confidence: float  # 0-1
    suggested_questions: Optional[List[str]] = None

# ==================== Outcome Calibration Models ====================

class OutcomeRequest(BaseModel):
    case_data: Dict[str, Any]
    precedent_strength: Optional[float] = None
    evidence_quality: Optional[float] = None

class PredictionFactor(BaseModel):
    factor: str
    influence: float  # 0-100
    direction: str  # "positive", "negative", "neutral"

class OutcomeResponse(BaseModel):
    win_probability: float  # 0-100
    confidence_level: str  # "high", "medium", "low"
    model_accuracy: float
    calibration_error: float
    factors: List[PredictionFactor]
    outcome_distribution: Dict[str, float]
    data_points_used: int

# ==================== Auto Drafting Models ====================

class Citation(BaseModel):
    case_name: str
    year: int
    citation: str
    relevance: str  # "high", "medium", "low"
    paragraphs: List[int]

class DraftingRequest(BaseModel):
    case_facts: str
    document_type: str  # "petition", "bail", "fir", "argument", "memorandum"
    case_id: Optional[str] = None

class DraftingResponse(BaseModel):
    document_id: str
    content: str
    citations: List[Citation]
    quality_metrics: Dict[str, float]
    generated_at: datetime = Field(default_factory=datetime.now)

# ==================== Error Models ====================

class ErrorResponse(BaseModel):
    error: str
    detail: str
    status_code: int
    timestamp: datetime = Field(default_factory=datetime.now)
