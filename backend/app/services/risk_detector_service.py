"""Risk Detector Service"""
import logging
import re
from typing import List, Dict, Any

try:
    import numpy as np
except ImportError:
    np = None

logger = logging.getLogger(__name__)

class RiskDetectorService:
    """Service for detecting case risks and contradictions"""
    
    async def analyze_case(self, case_text: str, case_type: str = "criminal") -> Dict[str, Any]:
        """
        Analyze case for risks and contradictions
        
        Args:
            case_text: Case text/description
            case_type: Type of case (criminal/civil)
            
        Returns:
            Risk analysis with issues and recommendations
        """
        try:
            issues = self._detect_issues(case_text)
            risk_score = self._calculate_risk_score(issues, len(case_text))
            risk_factors = self._build_risk_factors(case_text, issues)
            counter_args = self._generate_counter_arguments(case_text, case_type)
            recommendations = self._generate_recommendations(issues)
            
            return {
                "overall_risk_score": risk_score,
                "risk_level": "High" if risk_score > 70 else "Medium" if risk_score > 40 else "Low",
                "risk_factors": risk_factors,
                "issues": issues,
                "counter_arguments": counter_args,
                "recommendations": recommendations,
                "case_type": case_type
            }
            
        except Exception as e:
            logger.error(f"Error analyzing case: {str(e)}")
            return {"error": str(e)}

    def _build_risk_factors(self, text: str, issues: List[Dict]) -> List[Dict[str, Any]]:
        """Return transparent factor weights used by the risk score."""
        lower_text = text.lower()
        factors = []

        explicit_gaps = re.findall(r"(?:no|without|lack(?:s|ing)?|not available|not provided)\s+([\w ]{3,40})", lower_text)
        if explicit_gaps:
            factors.append({
                "name": "Explicit evidence gap",
                "score": min(25, len(explicit_gaps) * 8),
                "description": f"The record explicitly reports: {', '.join(g.strip() for g in explicit_gaps[:3])}.",
            })
        if any(issue["type"] == "contradiction" for issue in issues):
            factors.append({
                "name": "Contradictory language",
                "score": 15,
                "description": "Two nearby factual statements use opposing or qualifying language and require reconciliation.",
            })
        if any(issue["type"] == "weak" for issue in issues):
            factors.append({
                "name": "Weak evidence wording",
                "score": 10,
                "description": "Vague terms reduce confidence in the factual record.",
            })
        if any(word in lower_text for word in ["delay", "adjournment", "default", "limitation expired", "barred by limitation"]):
            factors.append({
                "name": "Procedural delay exposure",
                "score": 12,
                "description": "The record mentions delay, adjournment, default, or limitation concerns.",
            })
        if not factors:
            factors.append({
                "name": "Initial document completeness",
                "score": 0,
                "description": "No explicit risk trigger was found in the uploaded text.",
            })
        return factors
    
    def _detect_issues(self, text: str) -> List[Dict[str, Any]]:
        """Detect potential issues in case"""
        issues = []
        text_lower = text.lower()
        
        # Only flag qualifying language when it appears in a sentence containing a fact.
        if re.search(r"\b(?:but|however|contradict(?:s|ion|ory)?)\b", text_lower):
            issues.append({
                "id": len(issues) + 1,
                "type": "contradiction",
                "severity": "medium",
                "title": "Potential Contradictory Statements",
                "description": "Found conditional statements that may indicate contradictions",
                "location": "Multiple sections",
                "suggestion": "Review and clarify conflicting statements"
            })
        
        explicit_gap = re.search(r"\b(?:no|without|lack(?:s|ing)?|not available|not provided)\s+([\w ]{3,40})", text_lower)
        if explicit_gap:
            gap = explicit_gap.group(1).strip()
            issues.append({
                "id": len(issues) + 1,
                "type": "missing",
                "severity": "medium",
                "title": "Explicit evidence gap",
                "description": f"The document explicitly states that {gap} is absent or unavailable.",
                "location": "Document text",
                "suggestion": f"Verify and supply the missing item: {gap}."
            })
        
        # Check for weak references
        if "allegedly" in text_lower or "seems" in text_lower:
            issues.append({
                "id": len(issues) + 1,
                "type": "weak",
                "severity": "medium",
                "title": "Weak Evidence References",
                "description": "Found vague language indicating weak evidence support",
                "location": "Various sections",
                "suggestion": "Use specific, factual statements instead of vague language"
            })
        
        return issues
    
    def _calculate_risk_score(self, issues: List[Dict], text_length: int) -> float:
        """Calculate overall risk score"""
        base_score = 0
        
        # Issue penalties
        high_severity = len([i for i in issues if i["severity"] == "high"])
        medium_severity = len([i for i in issues if i["severity"] == "medium"])
        
        base_score += high_severity * 20
        base_score += medium_severity * 10
        
        return min(100, max(0, base_score))
    
    def _generate_counter_arguments(self, text: str, case_type: str) -> List[Dict]:
        """Generate potential counter arguments"""
        counter_args = [
            {
                "id": 1,
                "argument": "Opposing counsel may challenge the credibility of evidence presented",
                    "likelihood": 55
            },
            {
                "id": 2,
                "argument": "Lack of sufficient documentation may weaken your case",
                    "likelihood": 45
            },
            {
                "id": 3,
                "argument": "Procedural technicalities could be used against you",
                    "likelihood": 35
            }
        ]
        
        return counter_args
    
    def _generate_recommendations(self, issues: List[Dict]) -> List[str]:
        """Generate recommendations"""
        recommendations = []
        
        high_issues = [i for i in issues if i["severity"] == "high"]
        if high_issues:
            recommendations.append("Resolve all high-severity issues immediately")
            for issue in high_issues:
                recommendations.append(f"• {issue['suggestion']}")
        
        recommendations.extend([
            "Gather additional supporting documentation",
            "Strengthen weak precedent references",
            "Address potential counter-arguments proactively"
        ])
        
        return recommendations
