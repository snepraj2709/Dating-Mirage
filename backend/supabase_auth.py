import json
import os
from dataclasses import dataclass
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


@dataclass(frozen=True)
class MagicLinkResult:
    sent: bool
    detail: str | None = None


def _config() -> tuple[str, str, str] | None:
    supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY")
    app_origin = os.getenv("APP_ORIGIN", "http://localhost:5173").rstrip("/")
    if not supabase_url or not supabase_key:
        return None
    return supabase_url, supabase_key, app_origin


def send_result_magic_link(email: str, session_id: str) -> MagicLinkResult:
    config = _config()
    if config is None:
        return MagicLinkResult(sent=False, detail="Supabase Auth is not configured.")

    supabase_url, supabase_key, app_origin = config
    redirect_to = f"{app_origin}/unlock?session_id={session_id}"
    endpoint = f"{supabase_url}/auth/v1/otp?{urlencode({'redirect_to': redirect_to})}"
    payload = json.dumps(
        {
            "email": email,
            "create_user": True,
            "data": {
                "dating_mirror_session_id": session_id,
            },
        }
    ).encode("utf-8")
    request = Request(
        endpoint,
        data=payload,
        headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=12) as response:
            if 200 <= response.status < 300:
                return MagicLinkResult(sent=True)
            return MagicLinkResult(sent=False, detail=f"Supabase Auth returned {response.status}.")
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        return MagicLinkResult(sent=False, detail=detail or str(error))
    except URLError as error:
        return MagicLinkResult(sent=False, detail=str(error.reason))
