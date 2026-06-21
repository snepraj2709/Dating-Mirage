import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv


load_dotenv(Path(__file__).resolve().parents[1] / ".env")


@dataclass(frozen=True)
class OpenAISettings:
    api_key: str
    model: str
    max_output_tokens: int


def _int_from_env(name: str, default: int) -> int:
    raw_value = os.getenv(name)
    if raw_value is None:
        return default

    try:
        return int(raw_value)
    except ValueError:
        return default


def get_openai_settings() -> OpenAISettings:
    return OpenAISettings(
        api_key=os.getenv("OPENAI_API_KEY", "").strip(),
        model=os.getenv("OPENAI_MODEL", "gpt-4o").strip() or "gpt-4o",
        max_output_tokens=_int_from_env("OPENAI_MAX_OUTPUT_TOKENS", 1800),
    )
