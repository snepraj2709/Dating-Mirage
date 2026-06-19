from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


DimensionKey = Literal["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
QuadrantKey = Literal["guilty-pleasure", "total-disconnect", "true-blindspot", "aligned"]
RelationshipType = Literal["best_friend", "roommate", "cousin", "work_friend", "others"]


class VectorProfileSchema(BaseModel):
    CON: float = Field(..., ge=1.0, le=10.0)
    INT: float = Field(..., ge=1.0, le=10.0)
    AUT: float = Field(..., ge=1.0, le=10.0)
    VAL: float = Field(..., ge=1.0, le=10.0)
    GOC: float = Field(..., ge=1.0, le=10.0)
    VUL: float = Field(..., ge=1.0, le=10.0)
    REA: float = Field(..., ge=1.0, le=10.0)
    RWO: float = Field(..., ge=1.0, le=10.0)


class CreateOrUpdateSessionRequest(BaseModel):
    ideal_profile: VectorProfileSchema
    session_id: Optional[str] = None


class SubmitActualProfileRequest(BaseModel):
    actual_profile: VectorProfileSchema


class SubmitFriendRapidFireRequest(BaseModel):
    relationship_type: RelationshipType
    is_anonymous: bool = True
    feedback_profile: VectorProfileSchema


class DimensionJohariResultSchema(BaseModel):
    key: DimensionKey
    conscious_gap: float
    blind_spot_gap: float
    raw_severity: float
    severity_percentage: float
    quadrant: QuadrantKey


class UserSessionResponse(BaseModel):
    id: str
    ideal_profile: Optional[VectorProfileSchema]
    actual_profile: Optional[VectorProfileSchema]
    social_profile: Optional[VectorProfileSchema]
    friend_count: int
    report_unlocked: bool


class FriendFeedbackResponse(BaseModel):
    session_id: str
    friend_count: int
    report_unlocked: bool


class JohariReportResponse(BaseModel):
    user_id: str
    friend_count: int
    report_unlocked: bool
    dimensions: Dict[DimensionKey, DimensionJohariResultSchema]
    featured_dimensions: List[DimensionJohariResultSchema]
    share_card_url: Optional[str] = None


class DeleteSessionResponse(BaseModel):
    deleted: bool

