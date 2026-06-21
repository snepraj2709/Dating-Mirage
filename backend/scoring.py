import math
from typing import Dict, Iterable, Optional, TypedDict

from .schemas import VectorProfileSchema


DIMENSION_KEYS = ["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
HIGH_GAP_THRESHOLD = 3.0
MAX_DISTANCE = math.sqrt(9**2 + 9**2)


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
