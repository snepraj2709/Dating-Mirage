from .schemas import UserSessionResponse, VectorProfileSchema
from .scoring import aggregate_social_profile


DUMMY_SESSION_ID = "dummy-landing-page-report"


def dummy_ideal_profile() -> VectorProfileSchema:
    return VectorProfileSchema(
        CON=7,
        INT=10,
        AUT=4,
        VAL=7,
        GOC=7,
        VUL=4,
        REA=4,
        RWO=10,
    )


def dummy_actual_profile() -> VectorProfileSchema:
    return VectorProfileSchema(
        CON=1,
        INT=10,
        AUT=1,
        VAL=10,
        GOC=1,
        VUL=10,
        REA=10,
        RWO=1,
    )


def dummy_friend_profiles() -> list[VectorProfileSchema]:
    return [
        VectorProfileSchema(
            CON=1,
            INT=10,
            AUT=1,
            VAL=10,
            GOC=1,
            VUL=10,
            REA=10,
            RWO=1,
        ),
        VectorProfileSchema(
            CON=1,
            INT=10,
            AUT=1,
            VAL=10,
            GOC=10,
            VUL=1,
            REA=10,
            RWO=1,
        ),
    ]


def dummy_session() -> UserSessionResponse:
    friends = dummy_friend_profiles()
    social_profile = aggregate_social_profile(friends)
    if social_profile is None:
        raise RuntimeError("Dummy fixture requires social feedback.")

    return UserSessionResponse(
        id=DUMMY_SESSION_ID,
        ideal_profile=dummy_ideal_profile(),
        actual_profile=dummy_actual_profile(),
        social_profile=social_profile,
        friend_count=len(friends),
        report_unlocked=True,
    )
