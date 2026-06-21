import json
from typing import Any, Iterable, Optional

from pydantic import ValidationError

from .assessment_references import (
    ACTUAL_HISTORY_REFERENCE,
    DIMENSION_REFERENCE,
    IDEAL_QUESTIONS_REFERENCE,
    SOCIAL_OBSERVATION_REFERENCE,
)
from .config import get_openai_settings
from .schemas import JohariReportResponse, UserSessionResponse, VectorProfileSchema
from .scoring import (
    DIMENSION_KEYS,
    calculate_vector_gap_metrics,
    calculate_social_conflict_metadata,
)


PROMPT_VERSION = "dating-mirror-llm-report-v1"
SCHEMA_NAME = "dating_mirror_report"

SYSTEM_PROMPT = """
Role: You are an expert clinical psychologist and behavioral analyst specializing in romantic relationships, Attachment Theory, and Locus of Control.

Objective: Analyze a user's dating patterns across three vectors: Ideal Partner, Actual History, and Social Observation. The analysis covers eight dimensions: CON, INT, AUT, VAL, GOC, VUL, REA, and RWO.

Safety and tone:
- This is reflective behavioral analysis, not a medical diagnosis or therapy.
- Do not diagnose mental health conditions.
- Use direct, insightful, non-clinical language suitable for a polished consumer report.
- Be specific and behavior-focused.

Framework logic:
- facade: The user is aware of a private pattern or compromise that friends do not strongly observe. Visible to the user, hidden or muted in the social mirror.
- guilty_pleasure: The user knows the pattern is contradictory and the social mirror confirms it. Visible to both user and friends.
- blindspots: The user believes choices match standards, but friends observe a different pattern. Hidden from user, visible to friends.
- deep_void: A deeper unmet need or emotional avoidance pattern inferred across dimensions. Do not claim certainty; ground it in the provided vectors and evidence dimensions.

Social vector handling:
- social_vector.mean is the canonical aggregate social vector.
- social_vector.conflict_metadata explains disagreement among friends.
- If a dimension has is_polarized=true, treat the mean as a contested signal rather than neutral consensus.
- Do not let a 50/50 split erase insight; name the split when useful.

Friction map:
- burnout_axis should summarize friction around consistency, intensity, reactivity, and anxiety-as-chemistry patterns.
- armor_axis should summarize friction around autonomy, vulnerability, Communication, and relational worth.
- Scores must be integers from 1 to 10.

Gap metrics:
- Use gap_metrics.dimensions to ground your analysis in conscious_gap, blind_spot_gap, raw_severity, and severity_percentage.
- Use gap_metrics.top_tension_dimensions to prioritize evidence, but do not mechanically copy the order if another cross-dimensional pattern is stronger.
- gap_metrics.high_gap_threshold is interpretive context only; do not output this threshold or legacy matrix labels.

Output:
- Return exactly one JSON object matching the supplied JSON schema.
- Do not include markdown formatting.
- Do not include conversational filler outside the JSON.
- evidence_dimensions must contain only valid uppercase dimension keys.
""".strip()


class MissingOpenAIAPIKeyError(RuntimeError):
    pass


class LLMReportGenerationError(RuntimeError):
    pass


def _dimension_reference_by_key() -> dict[str, dict[str, Any]]:
    return {dimension["key"]: dimension for dimension in DIMENSION_REFERENCE}


def _scored_vector(vector: VectorProfileSchema) -> dict[str, dict[str, Any]]:
    references = _dimension_reference_by_key()
    return {
        key: {
            "score": float(getattr(vector, key)),
            "dimension": references[key],
        }
        for key in DIMENSION_KEYS
    }


def _json_schema_format() -> dict[str, Any]:
    return {
        "type": "json_schema",
        "name": SCHEMA_NAME,
        "strict": True,
        "schema": JohariReportResponse.model_json_schema(),
    }


def build_llm_report_input(
    session: UserSessionResponse,
    friend_profiles: Iterable[VectorProfileSchema],
) -> dict[str, Any]:
    if session.ideal_profile is None or session.actual_profile is None or session.social_profile is None:
        raise ValueError("Session vectors are incomplete.")

    friends = list(friend_profiles)
    gap_metrics = calculate_vector_gap_metrics(
        ideal=session.ideal_profile,
        actual=session.actual_profile,
        social=session.social_profile,
    )

    return {
        "prompt_version": PROMPT_VERSION,
        "assessment_reference": {
            "dimensions": DIMENSION_REFERENCE,
            "ideal_questions": IDEAL_QUESTIONS_REFERENCE,
            "actual_history_statements": ACTUAL_HISTORY_REFERENCE,
            "social_observation_questions": SOCIAL_OBSERVATION_REFERENCE,
        },
        "user_data": {
            "session_id": session.id,
            "friend_count": session.friend_count,
            "ideal_vector": _scored_vector(session.ideal_profile),
            "actual_history_vector": _scored_vector(session.actual_profile),
            "social_vector": {
                "mean": _scored_vector(session.social_profile),
                "conflict_metadata": calculate_social_conflict_metadata(friends),
            },
        },
        "gap_metrics": gap_metrics,
    }


def _response_status(response: Any) -> Optional[str]:
    if isinstance(response, dict):
        status = response.get("status")
        return status if isinstance(status, str) else None
    status = getattr(response, "status", None)
    return status if isinstance(status, str) else None


def _iter_response_content_parts(response: Any) -> Iterable[Any]:
    output = response.get("output", []) if isinstance(response, dict) else getattr(response, "output", [])
    for item in output or []:
        content = item.get("content", []) if isinstance(item, dict) else getattr(item, "content", [])
        for part in content or []:
            yield part


def _part_value(part: Any, key: str) -> Any:
    return part.get(key) if isinstance(part, dict) else getattr(part, key, None)


def _response_has_refusal(response: Any) -> bool:
    for part in _iter_response_content_parts(response):
        if _part_value(part, "refusal"):
            return True
        if _part_value(part, "type") == "refusal":
            return True
    return False


def _response_output_text(response: Any) -> str:
    if isinstance(response, dict):
        output_text = response.get("output_text")
        if isinstance(output_text, str):
            return output_text
    else:
        output_text = getattr(response, "output_text", None)
        if isinstance(output_text, str):
            return output_text

    texts = []
    for part in _iter_response_content_parts(response):
        if _part_value(part, "type") == "output_text":
            text = _part_value(part, "text")
            if isinstance(text, str):
                texts.append(text)
    return "".join(texts)


def generate_llm_report(
    session: UserSessionResponse,
    friend_profiles: Iterable[VectorProfileSchema],
    *,
    client: Any = None,
    api_key: Optional[str] = None,
    model: Optional[str] = None,
    max_output_tokens: Optional[int] = None,
) -> JohariReportResponse:
    settings = get_openai_settings()
    resolved_api_key = settings.api_key if api_key is None else api_key.strip()
    resolved_model = model or settings.model
    resolved_max_output_tokens = max_output_tokens or settings.max_output_tokens

    if not resolved_api_key:
        raise MissingOpenAIAPIKeyError("OPENAI_API_KEY is not configured.")

    if client is None:
        from openai import OpenAI

        client = OpenAI(api_key=resolved_api_key)

    payload = build_llm_report_input(session, friend_profiles)

    try:
        response = client.responses.create(
            model=resolved_model,
            instructions=SYSTEM_PROMPT,
            input=json.dumps(payload, separators=(",", ":"), ensure_ascii=True),
            text={"format": _json_schema_format()},
            max_output_tokens=resolved_max_output_tokens,
            store=False,
            temperature=0.4,
        )
    except Exception as error:
        raise LLMReportGenerationError("OpenAI report generation failed.") from error

    status = _response_status(response)
    if status is not None and status != "completed":
        raise LLMReportGenerationError(f"OpenAI response did not complete: {status}.")

    if _response_has_refusal(response):
        raise LLMReportGenerationError("OpenAI refused to generate the report.")

    output_text = _response_output_text(response).strip()
    if not output_text:
        raise LLMReportGenerationError("OpenAI returned an empty report.")

    try:
        return JohariReportResponse.model_validate_json(output_text)
    except (ValidationError, ValueError) as error:
        raise LLMReportGenerationError("OpenAI report output did not match the schema.") from error
