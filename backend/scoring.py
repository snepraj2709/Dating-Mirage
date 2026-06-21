import math
from typing import Dict, Iterable, Optional, TypedDict, cast

from .assessment_references import DIMENSION_REFERENCE
from .schemas import DominantGap, RadarChartSchema, RadarDimensionSchema, VectorProfileSchema


DIMENSION_KEYS = ["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
HIGH_GAP_THRESHOLD = 3.0
MAX_DISTANCE = math.sqrt(9**2 + 9**2)
MIXED_GAP_DELTA = 0.5


class DimensionGapMetric(TypedDict):
    key: str
    conscious_gap: float
    blind_spot_gap: float
    raw_severity: float
    severity_percentage: float


def _vector_value(vector: VectorProfileSchema, key: str) -> float:
    return float(getattr(vector, key))


def aggregate_social_profile(friend_profiles: Iterable[VectorProfileSchema]) -> Optional[VectorProfileSchema]:
    profiles = list(friend_profiles)
    if not profiles:
        return None

    values = {}
    for key in DIMENSION_KEYS:
        values[key] = round(sum(_vector_value(profile, key) for profile in profiles) / len(profiles), 2)

    return VectorProfileSchema(**values)


def calculate_social_conflict_metadata(friend_profiles: Iterable[VectorProfileSchema]) -> Dict[str, dict[str, float | int | bool]]:
    profiles = list(friend_profiles)
    metadata: Dict[str, dict[str, float | int | bool]] = {}

    for key in DIMENSION_KEYS:
        scores = [_vector_value(profile, key) for profile in profiles]
        if not scores:
            metadata[key] = {
                "min": 0,
                "max": 0,
                "std_dev": 0,
                "low_count": 0,
                "high_count": 0,
                "is_polarized": False,
            }
            continue

        mean = sum(scores) / len(scores)
        variance = sum((score - mean) ** 2 for score in scores) / len(scores)
        low_count = sum(1 for score in scores if score <= 4.0)
        high_count = sum(1 for score in scores if score >= 7.0)

        metadata[key] = {
            "min": round(min(scores), 2),
            "max": round(max(scores), 2),
            "std_dev": round(math.sqrt(variance), 2),
            "low_count": low_count,
            "high_count": high_count,
            "is_polarized": low_count > 0 and high_count > 0 and (max(scores) - min(scores)) >= 6.0,
        }

    return metadata


def calculate_dimension_gap_metrics(
    key: str,
    ideal: VectorProfileSchema,
    actual: VectorProfileSchema,
    social: VectorProfileSchema,
) -> DimensionGapMetric:
    conscious_gap = abs(_vector_value(ideal, key) - _vector_value(actual, key))
    blind_spot_gap = abs(_vector_value(actual, key) - _vector_value(social, key))
    raw_severity = math.sqrt(conscious_gap**2 + blind_spot_gap**2)
    severity_percentage = (raw_severity / MAX_DISTANCE) * 100

    return {
        "key": key,
        "conscious_gap": round(conscious_gap, 2),
        "blind_spot_gap": round(blind_spot_gap, 2),
        "raw_severity": round(raw_severity, 2),
        "severity_percentage": round(severity_percentage, 1),
    }


def calculate_vector_gap_metrics(
    ideal: VectorProfileSchema,
    actual: VectorProfileSchema,
    social: VectorProfileSchema,
) -> dict[str, object]:
    dimensions: Dict[str, DimensionGapMetric] = {
        key: calculate_dimension_gap_metrics(key, ideal, actual, social) for key in DIMENSION_KEYS
    }
    top_tension_dimensions = sorted(
        dimensions.values(),
        key=lambda result: result["raw_severity"],
        reverse=True,
    )[:3]

    return {
        "high_gap_threshold": HIGH_GAP_THRESHOLD,
        "dimensions": dimensions,
        "top_tension_dimensions": top_tension_dimensions,
    }


def _dominant_gap(conscious_gap: float, blind_spot_gap: float) -> DominantGap:
    if abs(conscious_gap - blind_spot_gap) <= MIXED_GAP_DELTA:
        return "mixed"

    return "conscious" if conscious_gap > blind_spot_gap else "blind_spot"


def _plain_vector(vector: VectorProfileSchema) -> dict[str, float]:
    return {key: round(_vector_value(vector, key), 2) for key in DIMENSION_KEYS}


def build_radar_chart(
    ideal: VectorProfileSchema,
    actual: VectorProfileSchema,
    social: VectorProfileSchema,
) -> RadarChartSchema:
    gap_metrics = calculate_vector_gap_metrics(ideal=ideal, actual=actual, social=social)
    dimension_metrics = cast(Dict[str, DimensionGapMetric], gap_metrics["dimensions"])
    top_metrics = cast(list[DimensionGapMetric], gap_metrics["top_tension_dimensions"])
    highlight_rank_by_key = {metric["key"]: index + 1 for index, metric in enumerate(top_metrics)}
    reference_by_key = {dimension["key"]: dimension for dimension in DIMENSION_REFERENCE}

    dimensions = []
    for key in DIMENSION_KEYS:
        metric = dimension_metrics[key]
        conscious_gap = metric["conscious_gap"]
        blind_spot_gap = metric["blind_spot_gap"]
        dimensions.append(
            RadarDimensionSchema(
                key=key,
                name=str(reference_by_key[key]["name"]),
                ideal_score=round(_vector_value(ideal, key), 2),
                actual_score=round(_vector_value(actual, key), 2),
                friend_feedback_score=round(_vector_value(social, key), 2),
                conscious_gap=conscious_gap,
                blind_spot_gap=blind_spot_gap,
                total_gap=metric["raw_severity"],
                severity_percentage=metric["severity_percentage"],
                dominant_gap=_dominant_gap(conscious_gap, blind_spot_gap),
                highlight_rank=highlight_rank_by_key.get(key),
            )
        )

    highlights = sorted(
        (dimension for dimension in dimensions if dimension.highlight_rank is not None),
        key=lambda dimension: dimension.highlight_rank or 0,
    )

    return RadarChartSchema(
        scale={"min": 1, "max": 10},
        series={
            "ideal": _plain_vector(ideal),
            "actual": _plain_vector(actual),
            "friend_feedback": _plain_vector(social),
        },
        dimensions=dimensions,
        highlights=highlights,
    )
