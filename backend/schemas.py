from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


DimensionKey = Literal["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
RelationshipType = Literal["best_friend", "roommate", "cousin", "work_friend", "others"]


class StrictSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")


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


class UserSessionResponse(BaseModel):
    id: str
    ideal_profile: Optional[VectorProfileSchema]
    actual_profile: Optional[VectorProfileSchema]
    social_profile: Optional[VectorProfileSchema]
    friend_count: int
    report_unlocked: bool
    result_email: Optional[str] = None
    result_email_saved_at: Optional[str] = None
    result_email_sent_at: Optional[str] = None


class SaveResultEmailRequest(BaseModel):
    result_email: str


class FriendFeedbackResponse(BaseModel):
    session_id: str
    friend_count: int
    report_unlocked: bool


class ShareableCardSchema(StrictSchema):
    archetype_title: str
    tagline: str
    core_conflict: str
    actionable_interventions: List[str]


class DiagnosticSectionSchema(StrictSchema):
    insight: str
    evidence_dimensions: List[DimensionKey]


class DiagnosticMatrixSchema(StrictSchema):
    facade: DiagnosticSectionSchema
    guilty_pleasure: DiagnosticSectionSchema
    blindspots: DiagnosticSectionSchema
    deep_void: DiagnosticSectionSchema


class FrictionAxisSchema(StrictSchema):
    score: int = Field(..., ge=1, le=10)
    analysis: str


class FrictionMapSchema(StrictSchema):
    burnout_axis: FrictionAxisSchema
    armor_axis: FrictionAxisSchema


class JohariReportResponse(StrictSchema):
    shareable_card: ShareableCardSchema
    diagnostic_matrix: DiagnosticMatrixSchema
    friction_map: FrictionMapSchema


class DeleteSessionResponse(BaseModel):
    deleted: bool
