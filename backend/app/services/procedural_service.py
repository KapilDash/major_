"""Procedural Flow Engine Service"""
import logging
from typing import Dict, List, Any

logger = logging.getLogger(__name__)

class ProceduralFlowService:
    """Service for case timeline and procedural flow prediction"""
    
    # Timeline data based on case type and court
    TIMELINE_DATA = {
        "criminal": {
            "district": {
                "stages": [
                    {"stage": "FIR Filing", "duration": 1, "delay_prob": 5},
                    {"stage": "Investigation", "duration": 3, "delay_prob": 15},
                    {"stage": "First Hearing", "duration": 2, "delay_prob": 35},
                    {"stage": "Chargesheet", "duration": 2, "delay_prob": 20},
                    {"stage": "Evidence", "duration": 8, "delay_prob": 45},
                    {"stage": "Arguments", "duration": 3, "delay_prob": 30},
                    {"stage": "Judgment", "duration": 1, "delay_prob": 25}
                ],
                "total_months": 20,
                "delay_likelihood": 65
            },
            "high": {
                "stages": [
                    {"stage": "Appeal Filing", "duration": 2, "delay_prob": 20},
                    {"stage": "Admission", "duration": 3, "delay_prob": 50},
                    {"stage": "Arguments", "duration": 4, "delay_prob": 40},
                    {"stage": "Judgment", "duration": 2, "delay_prob": 35}
                ],
                "total_months": 30,
                "delay_likelihood": 72
            }
        },
        "civil": {
            "district": {
                "stages": [
                    {"stage": "Filing", "duration": 1, "delay_prob": 8},
                    {"stage": "Admission", "duration": 2, "delay_prob": 40},
                    {"stage": "Evidence", "duration": 12, "delay_prob": 50},
                    {"stage": "Arguments", "duration": 4, "delay_prob": 35},
                    {"stage": "Judgment", "duration": 2, "delay_prob": 40}
                ],
                "total_months": 21,
                "delay_likelihood": 72
            }
        }
    }
    
    async def predict_timeline(self, case_type: str, court: str, state: str) -> Dict[str, Any]:
        """
        Predict case timeline
        
        Args:
            case_type: "criminal" or "civil"
            court: "district", "high", or "supreme"
            state: State name
            
        Returns:
            Timeline prediction with stages
        """
        try:
            # Get timeline data
            timeline_key = court if court in ["district", "high"] else "district"
            case_key = case_type if case_type in ["criminal", "civil"] else "criminal"
            
            if case_key not in self.TIMELINE_DATA or timeline_key not in self.TIMELINE_DATA[case_key]:
                timeline_data = self.TIMELINE_DATA["criminal"]["district"]
            else:
                timeline_data = self.TIMELINE_DATA[case_key][timeline_key]
            
            stages = timeline_data["stages"]
            total_months = timeline_data["total_months"]
            delay_likelihood = timeline_data["delay_likelihood"]
            
            return {
                "case_type": case_type,
                "court": court,
                "state": state,
                "expected_duration": total_months,
                "worst_case_duration": int(total_months * 1.5),
                "delay_probability": delay_likelihood,
                "stages": stages,
                "delay_factors": self._get_delay_factors(),
                "stage_wise_risk": self._calculate_stage_risk(stages)
            }
            
        except Exception as e:
            logger.error(f"Error predicting timeline: {str(e)}")
            return {"error": str(e)}
    
    def _get_delay_factors(self) -> Dict[str, float]:
        """Get delay contributing factors"""
        return {
            "court_backlog": 35,
            "judge_availability": 25,
            "adjournments": 20,
            "evidence_complexity": 15,
            "other": 5
        }
    
    def _calculate_stage_risk(self, stages: List[Dict]) -> Dict[str, float]:
        """Calculate stage-wise risk"""
        risk_map = {}
        for stage in stages:
            risk_map[stage["stage"]] = stage["delay_prob"]
        return risk_map
