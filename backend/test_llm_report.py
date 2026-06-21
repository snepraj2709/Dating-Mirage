import json
import os
import tempfile
import unittest
from pathlib import Path
from typing import Any
from unittest.mock import patch

from fastapi.testclient import TestClient
from pydantic import ValidationError

from backend import store
from backend.dummy_report_fixture import dummy_friend_profiles, dummy_session
from backend.llm_report import (
    MissingOpenAIAPIKeyError,
    build_llm_report_input,
    generate_llm_report,
)
from backend.main import app
from backend.schemas import JohariReportResponse, UserSessionResponse, VectorProfileSchema


VALID_REPORT = {
    "shareable_card": {
        "archetype_title": "The Guarded Chaos-Chaser",
        "tagline": "You ask for calm, then follow the siren.",
        "core_conflict": "You say you want steadiness, but your history rewards intensity.",
        "actionable_interventions": [
            "Wait 48 hours before escalating after a high-chemistry date.",
            "Ask for consistency before interpreting anxiety as attraction.",
        ],
    },
    "diagnostic_matrix": {
        "facade": {
            "insight": "You look composed outside the relationship while privately over-decoding signals.",
            "evidence_dimensions": ["CON", "REA"],
        },
        "guilty_pleasure": {
            "insight": "The chase still has emotional entertainment value even when it costs you steadiness.",
            "evidence_dimensions": ["INT", "CON"],
        },
        "blindspots": {
            "insight": "Friends see your independence collapse sooner than you register it.",
            "evidence_dimensions": ["AUT"],
        },
        "deep_void": {
            "insight": "High standards may be protecting you from ordinary, dependable closeness.",
            "evidence_dimensions": ["RWO", "VUL"],
        },
    },
    "friction_map": {
        "burnout_axis": {
            "score": 8,
            "analysis": "High intensity plus low consistency creates anxiety that can be mistaken for chemistry.",
        },
        "armor_axis": {
            "score": 4,
            "analysis": "Autonomy and vulnerability are tense, but not the central contradiction.",
        },
    },
}


def vector(value: float) -> VectorProfileSchema:
    return VectorProfileSchema(
        CON=value,
        INT=value,
        AUT=value,
        VAL=value,
        GOC=value,
        VUL=value,
        REA=value,
        RWO=value,
    )


def session(friend_count: int = 2) -> UserSessionResponse:
    return UserSessionResponse(
        id="session-1",
        ideal_profile=vector(7),
        actual_profile=vector(3),
        social_profile=vector(5.5),
        friend_count=friend_count,
        report_unlocked=True,
    )


class FakeResponses:
    def __init__(self) -> None:
        self.calls = []

    def create(self, **kwargs):
        self.calls.append(kwargs)
        return {"status": "completed", "output_text": json.dumps(VALID_REPORT)}


class FakeOpenAIClient:
    def __init__(self) -> None:
        self.responses = FakeResponses()


class LLMReportTests(unittest.TestCase):
    def test_report_schema_rejects_extra_fields(self) -> None:
        payload = dict(VALID_REPORT)
        payload["unexpected"] = True

        with self.assertRaises(ValidationError):
            JohariReportResponse.model_validate(payload)

    def test_report_schema_rejects_missing_fields(self) -> None:
        payload = dict(VALID_REPORT)
        payload.pop("friction_map")

        with self.assertRaises(ValidationError):
            JohariReportResponse.model_validate(payload)

    def test_social_vector_passes_mean_and_conflict_metadata(self) -> None:
        friend_profiles = [vector(1), vector(1), vector(10), vector(10)]
        payload = build_llm_report_input(session(friend_count=4), friend_profiles)
        social_vector = payload["user_data"]["social_vector"]

        self.assertEqual(social_vector["mean"]["CON"]["score"], 5.5)
        self.assertEqual(social_vector["conflict_metadata"]["CON"]["min"], 1)
        self.assertEqual(social_vector["conflict_metadata"]["CON"]["max"], 10)
        self.assertEqual(social_vector["conflict_metadata"]["CON"]["std_dev"], 4.5)
        self.assertEqual(social_vector["conflict_metadata"]["CON"]["low_count"], 2)
        self.assertEqual(social_vector["conflict_metadata"]["CON"]["high_count"], 2)
        self.assertTrue(social_vector["conflict_metadata"]["CON"]["is_polarized"])

    def test_llm_input_uses_gap_metrics_without_old_report_schema(self) -> None:
        payload = build_llm_report_input(session(friend_count=2), [vector(1), vector(10)])
        serialized_payload = json.dumps(payload)

        self.assertIn("gap_metrics", payload)
        self.assertNotIn("deterministic_johari", payload)
        self.assertNotIn("featured_dimensions", serialized_payload)
        self.assertNotIn("quadrant", serialized_payload)
        self.assertNotIn("share_card_url", serialized_payload)

        gap_metrics = payload["gap_metrics"]
        self.assertIsInstance(gap_metrics, dict)
        self.assertEqual(gap_metrics["high_gap_threshold"], 3.0)
        self.assertEqual(len(gap_metrics["dimensions"]), 8)
        self.assertEqual(len(gap_metrics["top_tension_dimensions"]), 3)

        first_metric: dict[str, Any] = gap_metrics["top_tension_dimensions"][0]
        self.assertEqual(
            set(first_metric.keys()),
            {"key", "conscious_gap", "blind_spot_gap", "raw_severity", "severity_percentage"},
        )

    def test_generate_llm_report_uses_mocked_structured_output_call(self) -> None:
        fake_client = FakeOpenAIClient()

        report = generate_llm_report(
            session(),
            [vector(1), vector(10)],
            client=fake_client,
            api_key="test-key",
            model="gpt-4o",
            max_output_tokens=900,
        )

        self.assertEqual(report.shareable_card.archetype_title, "The Guarded Chaos-Chaser")
        call = fake_client.responses.calls[0]
        self.assertEqual(call["model"], "gpt-4o")
        self.assertEqual(call["max_output_tokens"], 900)
        self.assertFalse(call["store"])
        self.assertEqual(call["text"]["format"]["type"], "json_schema")
        self.assertTrue(call["text"]["format"]["strict"])
        self.assertIn("social_vector", call["input"])
        self.assertIn("gap_metrics", call["input"])
        self.assertNotIn("deterministic_johari", call["input"])

    def test_report_endpoint_returns_llm_schema_only(self) -> None:
        client = TestClient(app)

        with (
            patch("backend.main.get_session", return_value=session()),
            patch("backend.main.get_friend_profiles", return_value=[vector(1), vector(10)]),
            patch("backend.main.generate_llm_report", return_value=JohariReportResponse.model_validate(VALID_REPORT)),
        ):
            response = client.get("/sessions/session-1/report")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(set(response.json().keys()), {"shareable_card", "diagnostic_matrix", "friction_map"})
        self.assertNotIn("user_id", response.json())
        self.assertNotIn("featured_dimensions", response.json())

    def test_report_endpoint_returns_503_when_key_missing(self) -> None:
        client = TestClient(app)

        with (
            patch("backend.main.get_session", return_value=session()),
            patch("backend.main.get_friend_profiles", return_value=[vector(1), vector(10)]),
            patch(
                "backend.main.generate_llm_report",
                side_effect=MissingOpenAIAPIKeyError("OPENAI_API_KEY is not configured."),
            ),
        ):
            response = client.get("/sessions/session-1/report")

        self.assertEqual(response.status_code, 503)

    def test_friend_feedback_endpoint_accepts_metadata_and_social_vector(self) -> None:
        client = TestClient(app)
        payload = {
            "friend_name": " Jordan ",
            "relationship_type": "best_friend",
            "relationship_label": " Best Friend ",
            "social_vector": vector(7).model_dump(),
        }

        with (
            patch("backend.main.save_friend_feedback", return_value=1) as save_friend_feedback,
            patch("backend.main.get_session", return_value=None),
        ):
            response = client.post("/sessions/session-1/friend-feedback", json=payload)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {"session_id": "session-1", "friend_count": 1, "report_unlocked": False},
        )
        save_friend_feedback.assert_called_once()
        call_args = save_friend_feedback.call_args.args
        self.assertEqual(call_args[0], "session-1")
        self.assertEqual(call_args[1], "Jordan")
        self.assertEqual(call_args[2], "best_friend")
        self.assertEqual(call_args[3], "Best Friend")
        self.assertEqual(call_args[4].CON, 7)

    def test_friend_feedback_endpoint_rejects_old_payload_shape(self) -> None:
        client = TestClient(app)
        payload = {
            "relationship_type": "best_friend",
            "feedback_profile": vector(7).model_dump(),
        }

        response = client.post("/sessions/session-1/friend-feedback", json=payload)

        self.assertEqual(response.status_code, 422)

    def test_friend_feedback_store_persists_metadata_and_unlocks_at_two(self) -> None:
        with tempfile.TemporaryDirectory() as temp_dir:
            with patch("backend.store.DATABASE_PATH", Path(temp_dir) / "dating_mirror.db"):
                store.create_or_update_session(vector(6), "session-1")

                first_count = store.save_friend_feedback(
                    "session-1",
                    "Jordan",
                    "best_friend",
                    "Best Friend",
                    vector(7),
                )
                second_count = store.save_friend_feedback(
                    "session-1",
                    "Mia",
                    "roommate",
                    "Roommate",
                    vector(9),
                )

                session_response = store.get_session("session-1")
                with store.get_connection() as connection:
                    rows = connection.execute(
                        """
                        SELECT friend_name, relationship_type, relationship_label
                        FROM friend_feedback
                        WHERE session_id = ?
                        ORDER BY created_at ASC, rowid ASC
                        """,
                        ("session-1",),
                    ).fetchall()

        self.assertEqual(first_count, 1)
        self.assertEqual(second_count, 2)
        self.assertIsNotNone(session_response)
        assert session_response is not None
        self.assertEqual(session_response.friend_count, 2)
        self.assertTrue(session_response.report_unlocked)
        self.assertEqual(session_response.social_profile, vector(8))
        self.assertEqual(
            [dict(row) for row in rows],
            [
                {
                    "friend_name": "Jordan",
                    "relationship_type": "best_friend",
                    "relationship_label": "Best Friend",
                },
                {
                    "friend_name": "Mia",
                    "relationship_type": "roommate",
                    "relationship_label": "Roommate",
                },
            ],
        )

    def test_dummy_landing_page_fixture_has_social_mean_conflict_and_cached_report_schema(self) -> None:
        payload = build_llm_report_input(dummy_session(), dummy_friend_profiles())
        social_vector = payload["user_data"]["social_vector"]

        self.assertEqual(social_vector["mean"]["CON"]["score"], 1.0)
        self.assertEqual(social_vector["mean"]["GOC"]["score"], 5.5)
        self.assertEqual(social_vector["mean"]["VUL"]["score"], 5.5)
        self.assertTrue(social_vector["conflict_metadata"]["GOC"]["is_polarized"])
        self.assertTrue(social_vector["conflict_metadata"]["VUL"]["is_polarized"])
        self.assertFalse(social_vector["conflict_metadata"]["CON"]["is_polarized"])

        cached_report_path = Path(__file__).resolve().parents[1] / "src" / "data" / "dummy-llm-report.json"
        self.assertTrue(cached_report_path.exists())
        cached_report = json.loads(cached_report_path.read_text(encoding="utf-8"))
        JohariReportResponse.model_validate(cached_report)

    @unittest.skipUnless(os.getenv("RUN_OPENAI_LIVE_TEST") == "1", "Live OpenAI test is opt-in.")
    def test_live_openai_dummy_fixture_returns_strict_schema(self) -> None:
        report = generate_llm_report(dummy_session(), dummy_friend_profiles())

        self.assertIsInstance(report, JohariReportResponse)
        self.assertGreaterEqual(report.friction_map.burnout_axis.score, 1)
        self.assertLessEqual(report.friction_map.burnout_axis.score, 10)


if __name__ == "__main__":
    unittest.main()
