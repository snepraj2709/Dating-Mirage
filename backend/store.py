import json
import sqlite3
from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from .schemas import UserSessionResponse, VectorProfileSchema
from .scoring import aggregate_social_profile


DATABASE_PATH = Path(__file__).with_name("dating_mirror.db")


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS sessions (
              id TEXT PRIMARY KEY,
              ideal_profile TEXT,
              actual_profile TEXT,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        existing_columns = {
            row["name"] for row in connection.execute("PRAGMA table_info(sessions)").fetchall()
        }
        if "result_email" not in existing_columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN result_email TEXT")
        if "result_email_saved_at" not in existing_columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN result_email_saved_at TEXT")
        if "result_email_sent_at" not in existing_columns:
            connection.execute("ALTER TABLE sessions ADD COLUMN result_email_sent_at TEXT")
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS friend_feedback (
              id TEXT PRIMARY KEY,
              session_id TEXT NOT NULL,
              relationship_type TEXT NOT NULL,
              feedback_profile TEXT NOT NULL,
              created_at TEXT DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
            )
            """
        )


def _profile_to_json(profile: VectorProfileSchema) -> str:
    return profile.model_dump_json()


def _profile_from_json(value: Optional[str]) -> Optional[VectorProfileSchema]:
    if value is None:
        return None
    return VectorProfileSchema(**json.loads(value))


def create_or_update_session(ideal_profile: VectorProfileSchema, session_id: Optional[str] = None) -> UserSessionResponse:
    init_db()
    resolved_id = session_id or str(uuid4())

    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO sessions (id, ideal_profile, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
              ideal_profile = excluded.ideal_profile,
              updated_at = CURRENT_TIMESTAMP
            """,
            (resolved_id, _profile_to_json(ideal_profile)),
        )

    session = get_session(resolved_id)
    if session is None:
        raise RuntimeError("Unable to create session")
    return session


def save_actual_profile(session_id: str, actual_profile: VectorProfileSchema) -> Optional[UserSessionResponse]:
    init_db()
    with get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE sessions
            SET actual_profile = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (_profile_to_json(actual_profile), session_id),
        )
        if cursor.rowcount == 0:
            return None

    return get_session(session_id)


def save_result_email(session_id: str, result_email: str) -> Optional[UserSessionResponse]:
    init_db()
    normalized_email = result_email.strip().lower()
    with get_connection() as connection:
        row = connection.execute("SELECT result_email FROM sessions WHERE id = ?", (session_id,)).fetchone()
        if row is None:
            return None

        email_changed = (row["result_email"] or "").lower() != normalized_email
        connection.execute(
            """
            UPDATE sessions
            SET result_email = ?,
                result_email_saved_at = CASE
                  WHEN ? THEN CURRENT_TIMESTAMP
                  ELSE COALESCE(result_email_saved_at, CURRENT_TIMESTAMP)
                END,
                result_email_sent_at = CASE WHEN ? THEN NULL ELSE result_email_sent_at END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (normalized_email, email_changed, email_changed, session_id),
        )

    return get_session(session_id)


def save_friend_feedback(session_id: str, relationship_type: str, feedback_profile: VectorProfileSchema) -> Optional[int]:
    init_db()
    with get_connection() as connection:
        session = connection.execute("SELECT id FROM sessions WHERE id = ?", (session_id,)).fetchone()
        if session is None:
            return None

        connection.execute(
            """
            INSERT INTO friend_feedback (id, session_id, relationship_type, feedback_profile)
            VALUES (?, ?, ?, ?)
            """,
            (str(uuid4()), session_id, relationship_type, _profile_to_json(feedback_profile)),
        )
        count = connection.execute(
            "SELECT COUNT(*) AS friend_count FROM friend_feedback WHERE session_id = ?", (session_id,)
        ).fetchone()["friend_count"]

    return int(count)


def mark_result_email_sent(session_id: str) -> Optional[UserSessionResponse]:
    init_db()
    with get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE sessions
            SET result_email_sent_at = COALESCE(result_email_sent_at, CURRENT_TIMESTAMP),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (session_id,),
        )
        if cursor.rowcount == 0:
            return None

    return get_session(session_id)


def get_friend_profiles(session_id: str) -> List[VectorProfileSchema]:
    init_db()
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT feedback_profile FROM friend_feedback WHERE session_id = ? ORDER BY created_at ASC",
            (session_id,),
        ).fetchall()

    return [VectorProfileSchema(**json.loads(row["feedback_profile"])) for row in rows]


def get_session(session_id: str) -> Optional[UserSessionResponse]:
    init_db()
    with get_connection() as connection:
        row = connection.execute("SELECT * FROM sessions WHERE id = ?", (session_id,)).fetchone()
        if row is None:
            return None

        friend_profiles = get_friend_profiles(session_id)
        social_profile = aggregate_social_profile(friend_profiles)

        return UserSessionResponse(
            id=row["id"],
            ideal_profile=_profile_from_json(row["ideal_profile"]),
            actual_profile=_profile_from_json(row["actual_profile"]),
            social_profile=social_profile,
            friend_count=len(friend_profiles),
            report_unlocked=len(friend_profiles) >= 2,
            result_email=row["result_email"],
            result_email_saved_at=row["result_email_saved_at"],
            result_email_sent_at=row["result_email_sent_at"],
        )


def delete_session(session_id: str) -> bool:
    init_db()
    with get_connection() as connection:
        connection.execute("DELETE FROM friend_feedback WHERE session_id = ?", (session_id,))
        cursor = connection.execute("DELETE FROM sessions WHERE id = ?", (session_id,))
    return cursor.rowcount > 0
