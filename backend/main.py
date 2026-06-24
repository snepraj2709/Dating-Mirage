import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .llm_report import (
    LLMReportGenerationError,
    MissingOpenAIAPIKeyError,
    generate_llm_report,
)
from .schemas import (
    CreateOrUpdateSessionRequest,
    DeleteSessionResponse,
    FriendFeedbackResponse,
    JohariReportResponse,
    SaveResultEmailRequest,
    SubmitActualProfileRequest,
    SubmitFriendRapidFireRequest,
    UserSessionResponse,
)
from .scoring import build_radar_chart
from .store import (
    create_or_update_session,
    delete_session,
    get_friend_profiles,
    get_session,
    mark_result_email_sent,
    save_actual_profile,
    save_friend_feedback,
    save_result_email,
)
from .supabase_auth import send_result_magic_link


app = FastAPI(title="Dating Mirror API", version="0.1.0")


def get_cors_origins() -> list[str]:
    local_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
    production_origins = ["https://dating-mirror.vercel.app", "https://dating-mirage.vercel.app"]
    configured_origins = [
        origin.strip().rstrip("/")
        for origin in os.getenv("CORS_ORIGINS", "").split(",")
        if origin.strip()
    ]
    app_origin = os.getenv("APP_ORIGIN", "").strip().rstrip("/")
    origins = (
        [*local_origins, *production_origins, app_origin, *configured_origins]
        if app_origin
        else [*local_origins, *production_origins, *configured_origins]
    )
    return list(dict.fromkeys(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def send_result_email_if_ready(session: UserSessionResponse) -> UserSessionResponse:
    if not session.report_unlocked or not session.result_email or session.result_email_sent_at:
        return session

    result = send_result_magic_link(session.result_email, session.id)
    if not result.sent:
        return session

    return mark_result_email_sent(session.id) or session


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/sessions", response_model=UserSessionResponse)
def upsert_session(payload: CreateOrUpdateSessionRequest) -> UserSessionResponse:
    return create_or_update_session(payload.ideal_profile, payload.session_id)


@app.get("/sessions/{session_id}", response_model=UserSessionResponse)
def read_session(session_id: str) -> UserSessionResponse:
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.post("/sessions/{session_id}/actual-profile", response_model=UserSessionResponse)
def submit_actual_profile(session_id: str, payload: SubmitActualProfileRequest) -> UserSessionResponse:
    session = save_actual_profile(session_id, payload.actual_profile)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@app.post("/sessions/{session_id}/result-email", response_model=UserSessionResponse)
def save_report_email(session_id: str, payload: SaveResultEmailRequest) -> UserSessionResponse:
    session = save_result_email(session_id, payload.result_email)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    return send_result_email_if_ready(session)


@app.post("/sessions/{session_id}/friend-feedback", response_model=FriendFeedbackResponse)
def submit_friend_feedback(session_id: str, payload: SubmitFriendRapidFireRequest) -> FriendFeedbackResponse:
    friend_count = save_friend_feedback(
        session_id,
        payload.friend_name,
        payload.relationship_type,
        payload.relationship_label,
        payload.social_vector,
    )
    if friend_count is None:
        raise HTTPException(status_code=404, detail="Session not found")

    session = get_session(session_id)
    if session is not None:
        send_result_email_if_ready(session)

    return FriendFeedbackResponse(
        session_id=session_id,
        friend_count=friend_count,
        report_unlocked=friend_count >= 2,
    )


@app.get("/sessions/{session_id}/report", response_model=JohariReportResponse)
def read_report(session_id: str) -> JohariReportResponse:
    session = get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.ideal_profile is None or session.actual_profile is None:
        raise HTTPException(status_code=409, detail="User vectors are incomplete")

    if session.social_profile is None or session.friend_count < 2:
        raise HTTPException(status_code=423, detail="Minimum 2 friend responses required")

    try:
        narrative_report = generate_llm_report(session, get_friend_profiles(session.id))
    except MissingOpenAIAPIKeyError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except LLMReportGenerationError as error:
        raise HTTPException(status_code=502, detail=str(error)) from error

    return JohariReportResponse(
        **narrative_report.model_dump(),
        radar_chart=build_radar_chart(
            session.ideal_profile,
            session.actual_profile,
            session.social_profile,
        ),
    )


@app.delete("/sessions/{session_id}", response_model=DeleteSessionResponse)
def burn_session(session_id: str) -> DeleteSessionResponse:
    return DeleteSessionResponse(deleted=delete_session(session_id))
