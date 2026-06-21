from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


DimensionKey = Literal["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
RelationshipType = Literal["best_friend", "roommate", "cousin", "work_friend", "others"]
DominantGap = Literal["conscious", "blind_spot", "mixed"]


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
    friend_name: str = Field(..., min_length=1, max_length=120)
    relationship_type: RelationshipType
    relationship_label: str = Field(..., min_length=1, max_length=80)
    social_vector: VectorProfileSchema

    @field_validator("friend_name", "relationship_label")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("Field cannot be blank")
        return stripped


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


class LLMNarrativeReportResponse(StrictSchema):
    shareable_card: ShareableCardSchema
    diagnostic_matrix: DiagnosticMatrixSchema
    friction_map: FrictionMapSchema


class RadarScaleSchema(StrictSchema):
    min: int = Field(..., ge=1, le=10)
    max: int = Field(..., ge=1, le=10)


class RadarSeriesSchema(StrictSchema):
    ideal: VectorProfileSchema
    actual: VectorProfileSchema
    friend_feedback: VectorProfileSchema


class RadarDimensionSchema(StrictSchema):
    key: DimensionKey
    name: str
    ideal_score: float = Field(..., ge=1.0, le=10.0)
    actual_score: float = Field(..., ge=1.0, le=10.0)
    friend_feedback_score: float = Field(..., ge=1.0, le=10.0)
    conscious_gap: float = Field(..., ge=0.0)
    blind_spot_gap: float = Field(..., ge=0.0)
    total_gap: float = Field(..., ge=0.0)
    severity_percentage: float = Field(..., ge=0.0, le=100.0)
    dominant_gap: DominantGap
    highlight_rank: Optional[int] = Field(default=None, ge=1, le=3)


class RadarChartSchema(StrictSchema):
    scale: RadarScaleSchema
    series: RadarSeriesSchema
    dimensions: List[RadarDimensionSchema]
    highlights: List[RadarDimensionSchema]


class JohariReportResponse(LLMNarrativeReportResponse):
    radar_chart: RadarChartSchema


class DeleteSessionResponse(BaseModel):
    deleted: bool
