import { useEffect, useState } from 'react';
import {
  burnSession,
  createOrUpdateSession,
  getReport,
  getSession,
  saveResultEmail as saveSessionResultEmail,
  submitActualProfile,
  submitFriendFeedback,
} from './api/client';
import { FriendRapidFireDeck } from './components/FriendRapidFireDeck';
import { FriendSharePanel } from './components/FriendSharePanel';
import { Hero } from './components/Hero';
import { FinalReport } from './components/FinalReport';
import { LandingJohariMatrix } from './components/LandingJohariMatrix';
import { LandingReportPreview } from './components/LandingReportPreview';
import { MapAnalysisSection } from './components/MapAnalysisSection';
import { MirrorStepper } from './components/MirrorStepper';
import { Navigation } from './components/Navigation';
import { PrivacyStrip } from './components/PrivacyStrip';
import { Step1IdealFlow } from './components/Step1IdealFlow';
import { Step2RealityIntro } from './components/Step2RealityIntro';
import { Step2SwipeMatrix } from './components/Step2SwipeMatrix';
import { UnlockReportScreen } from './components/UnlockReportScreen';
import { Button } from './components/ui/button';
import { CompactLoader, InlineError } from './components/ui/flow';
import { Eyebrow } from './components/ui/pill';
import { Surface } from './components/ui/surface';
import {
  clearActualSwipes,
  clearIdealDraft,
  clearLocalFriendProfiles,
  clearStoredSession,
  loadLocalFriendProfiles,
  loadStoredSession,
  saveStoredSession,
} from './lib/localState';
import type { MirrorReport, UserSession, VectorProfile } from './types/dating-mirror';

type AppStage = 'landing' | 'ideal' | 'actualIntro' | 'actual' | 'share' | 'reveal';

export default function App() {
  const friendMatch = window.location.pathname.match(/^\/friend\/([^/]+)/);
  const unlockMatch = window.location.pathname === '/unlock';
  const unlockSessionId = new URLSearchParams(window.location.search).get('session_id');
  const [stage, setStage] = useState<AppStage>('landing');
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession());
  const [isSavingIdeal, setIsSavingIdeal] = useState(false);
  const [isSavingActual, setIsSavingActual] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [report, setReport] = useState<MirrorReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isPreparingReport, setIsPreparingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleIdealComplete = async (idealProfile: VectorProfile) => {
    setIsSavingIdeal(true);
    setSaveError(null);

    try {
      const nextSession = await createOrUpdateSession(idealProfile, session?.id);
      setSession(nextSession);
      saveStoredSession(nextSession);
      clearIdealDraft();
      setStage('actualIntro');
    } catch {
      const localSession: UserSession = {
        id: session?.id ?? `local-${crypto.randomUUID()}`,
        idealProfile,
        actualProfile: session?.actualProfile ?? null,
        socialProfile: session?.socialProfile ?? null,
        friendCount: session?.friendCount ?? 0,
        reportUnlocked: session?.reportUnlocked ?? false,
        resultEmail: session?.resultEmail ?? null,
        resultEmailSavedAt: session?.resultEmailSavedAt ?? null,
        resultEmailSentAt: session?.resultEmailSentAt ?? null,
      };
      setSession(localSession);
      saveStoredSession(localSession);
      clearIdealDraft();
      setSaveError('Saved on this device for now.');
      setStage('actualIntro');
    } finally {
      setIsSavingIdeal(false);
    }
  };

  const handleActualComplete = async (actualProfile: VectorProfile) => {
    const currentSession =
      session ??
      ({
        id: `local-${crypto.randomUUID()}`,
        idealProfile: null,
        actualProfile: null,
        socialProfile: null,
        friendCount: 0,
        reportUnlocked: false,
      } satisfies UserSession);

    setIsSavingActual(true);
    setSaveError(null);
    setReport(null);
    setReportError(null);

    try {
      const nextSession = currentSession.id.startsWith('local-')
        ? await createBackendSessionFromLocal({
            ...currentSession,
            actualProfile,
          })
        : await refreshBackendSessionAfterActual(currentSession.id, actualProfile);

      setSession(nextSession);
      saveStoredSession(nextSession);
      setStage(nextSession.friendCount >= 2 ? 'reveal' : 'share');
    } catch {
      const friendCount = loadLocalFriendProfiles(currentSession.id).length;
      const now = new Date().toISOString();
      const localSession: UserSession = {
        ...currentSession,
        actualProfile,
        friendCount,
        reportUnlocked: friendCount >= 2,
        resultEmailSentAt:
          friendCount >= 2 && currentSession.resultEmail
            ? currentSession.resultEmailSentAt ?? now
            : currentSession.resultEmailSentAt ?? null,
      };
      setSession(localSession);
      saveStoredSession(localSession);
      setSaveError('Your pattern is saved on this device for now.');
      setStage('share');
    } finally {
      setIsSavingActual(false);
    }
  };

  const refreshBackendSessionAfterActual = async (
    sessionId: string,
    actualProfile: VectorProfile,
  ): Promise<UserSession> => {
    await submitActualProfile(sessionId, actualProfile);
    return getSession(sessionId);
  };

  const createBackendSessionFromLocal = async (localSession: UserSession): Promise<UserSession> => {
    if (!localSession.idealProfile || !localSession.actualProfile) {
      throw new Error('Finish your ideal and actual profiles before opening the report.');
    }

    const localFriendProfiles = loadLocalFriendProfiles(localSession.id);
    const createdSession = await createOrUpdateSession(localSession.idealProfile);
    await submitActualProfile(createdSession.id, localSession.actualProfile);

    for (const friendProfile of localFriendProfiles) {
      await submitFriendFeedback(createdSession.id, 'others', friendProfile);
    }

    clearLocalFriendProfiles(localSession.id);
    return getSession(createdSession.id);
  };

  const refreshFriendCount = async () => {
    if (!session) {
      return;
    }

    setSaveError(null);
    try {
      if (session.id.startsWith('local-')) {
        throw new Error('Local session');
      }

      const nextSession = await getSession(session.id);
      setSession(nextSession);
      saveStoredSession(nextSession);
    } catch {
      const friendCount = loadLocalFriendProfiles(session.id).length;
      const now = new Date().toISOString();
      const nextSession = {
        ...session,
        friendCount,
        reportUnlocked: friendCount >= 2,
        resultEmailSentAt:
          friendCount >= 2 && session.resultEmail
            ? session.resultEmailSentAt ?? now
            : session.resultEmailSentAt ?? null,
      };
      setSession(nextSession);
      saveStoredSession(nextSession);
      setSaveError('Using locally saved friend responses.');
    }
  };

  const handleResultEmailSave = async (email: string): Promise<UserSession> => {
    if (!session) {
      throw new Error('Finish Step 2 before holding your report.');
    }

    setSaveError(null);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      if (session.id.startsWith('local-')) {
        throw new Error('Local session');
      }

      const nextSession = await saveSessionResultEmail(session.id, normalizedEmail);
      setSession(nextSession);
      saveStoredSession(nextSession);
      return nextSession;
    } catch {
      const now = new Date().toISOString();
      const emailChanged = session.resultEmail !== normalizedEmail;
      const nextSession: UserSession = {
        ...session,
        resultEmail: normalizedEmail,
        resultEmailSavedAt: emailChanged ? now : session.resultEmailSavedAt ?? now,
        resultEmailSentAt:
          session.friendCount >= 2
            ? emailChanged
              ? now
              : session.resultEmailSentAt ?? now
            : emailChanged
            ? null
            : session.resultEmailSentAt ?? null,
      };
      setSession(nextSession);
      saveStoredSession(nextSession);
      setSaveError('Email held on this device for now.');
      return nextSession;
    }
  };

  useEffect(() => {
    if (stage !== 'reveal' || !session) {
      return;
    }

    const activeSession = session;
    let cancelled = false;

    async function loadReport() {
      setIsLoadingReport(true);
      setReportError(null);

      try {
        if (!activeSession.id.startsWith('local-')) {
          const [nextReport, nextSession] = await Promise.all([
            getReport(activeSession.id),
            getSession(activeSession.id),
          ]);
          if (!cancelled) {
            setReport(nextReport);
            setSession(nextSession);
            saveStoredSession(nextSession);
          }
          return;
        }

        throw new Error('The final LLM report requires a backend session and OpenAI API key.');
      } catch (error) {
        if (!cancelled) {
          setReportError(
            error instanceof Error
              ? error.message
              : 'We could not generate the final report yet. Try again after the backend is configured.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingReport(false);
        }
      }
    }

    void loadReport();

    return () => {
      cancelled = true;
    };
  }, [stage, session?.id]);

  const handleBurnData = async () => {
    const sessionId = session?.id;
    if (sessionId && !sessionId.startsWith('local-')) {
      try {
        await burnSession(sessionId);
      } catch {
        // Local cleanup still proceeds; the user asked for one-tap deletion behavior.
      }
    }

    if (sessionId) {
      clearLocalFriendProfiles(sessionId);
    }
    clearStoredSession();
    clearIdealDraft();
    clearActualSwipes();
    setSession(null);
    setReport(null);
    setSaveError(null);
    setReportError(null);
    setStage('landing');
  };

  const handleUnlockComplete = (nextSession: UserSession) => {
    setSession(nextSession);
    saveStoredSession(nextSession);
    setReport(null);
    setReportError(null);
    setSaveError(null);
    window.history.replaceState(null, '', '/');
    setStage('reveal');
  };

  const handleViewReport = async () => {
    if (!session) {
      return;
    }

    setIsPreparingReport(true);
    setSaveError(null);
    setReport(null);
    setReportError(null);

    try {
      const nextSession = session.id.startsWith('local-')
        ? await createBackendSessionFromLocal(session)
        : await getSession(session.id);

      setSession(nextSession);
      saveStoredSession(nextSession);

      if (nextSession.friendCount < 2) {
        setSaveError('The mirror needs two friend responses before the final report opens.');
        setStage('share');
        return;
      }

      setStage('reveal');
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'We could not open your mirror yet. Try again.');
      setStage('share');
    } finally {
      setIsPreparingReport(false);
    }
  };

  const startMirror = () => setStage('ideal');

  if (friendMatch) {
    const searchParams = new URLSearchParams(window.location.search);
    return (
      <FriendRapidFireDeck
        sessionId={decodeURIComponent(friendMatch[1])}
        displayName={searchParams.get('name') ?? 'your friend'}
      />
    );
  }

  if (unlockMatch) {
    return (
      <UnlockReportScreen
        sessionId={unlockSessionId}
        fallbackSession={session}
        onUnlocked={handleUnlockComplete}
      />
    );
  }

  if (stage === 'ideal') {
    return (
      <Step1IdealFlow
        isSaving={isSavingIdeal}
        initialProfile={session?.idealProfile}
        saveError={saveError}
        onBack={() => setStage('landing')}
        onComplete={handleIdealComplete}
      />
    );
  }

  if (stage === 'actualIntro') {
    return (
      <Step2RealityIntro
        statusMessage={saveError}
        onBack={() => setStage('ideal')}
        onContinue={() => {
          setSaveError(null);
          setStage('actual');
        }}
      />
    );
  }

  if (stage === 'actual') {
    return (
      <Step2SwipeMatrix
        isSaving={isSavingActual}
        saveError={saveError}
        onBack={() => setStage('actualIntro')}
        onComplete={handleActualComplete}
      />
    );
  }

  if (stage === 'share') {
    return (
      <FriendSharePanel
        session={session}
        statusMessage={saveError}
        onBack={() => setStage('actual')}
        isPreparingReport={isPreparingReport}
        onViewReport={handleViewReport}
        onRefresh={refreshFriendCount}
        onSaveResultEmail={handleResultEmailSave}
      />
    );
  }

  if (stage === 'reveal') {
    if (isLoadingReport) {
      return (
        <main className="mx-auto grid min-h-screen w-[min(1040px,calc(100%_-_32px))] place-items-center content-center gap-5 py-6 pb-14 text-center max-[620px]:w-[min(100%_-_24px,520px)]">
          <CompactLoader />
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] text-foreground">Polishing your mirror...</h2>
        </main>
      );
    }

    if (report && session) {
      return (
        <FinalReport
          report={report}
          session={session}
          onBack={() => setStage('share')}
          onBurnData={handleBurnData}
        />
      );
    }

    return (
      <main className="mx-auto grid min-h-screen w-[min(720px,calc(100%_-_32px))] content-center gap-[22px] py-12 max-[620px]:w-[min(100%_-_24px,520px)]">
        <Button className="w-fit" variant="ghostPill" onClick={() => setStage('share')}>
          Back to sharing
        </Button>
        <Surface asChild>
          <section>
          <Eyebrow>Step 4</Eyebrow>
          <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] text-foreground">The Mirror Analysis</h2>
          {reportError && <InlineError>{reportError}</InlineError>}
          <p>Refresh your friend responses, then come back to reveal the report.</p>
          </section>
        </Surface>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf6]">
      <Navigation onStart={startMirror} />
      <Hero onStart={startMirror} />
      <MirrorStepper />
      <LandingReportPreview onStart={startMirror} />
      <LandingJohariMatrix />
      <MapAnalysisSection onStart={startMirror} />
      <PrivacyStrip />
      <footer className="landing-section grid grid-rows-[minmax(0,1fr)_auto] bg-[#050505] text-white">
        <div className="landing-container grid place-items-center py-[clamp(40px,8svh,84px)] text-center max-[620px]:py-8">
          <div className="grid justify-items-center gap-[clamp(20px,3svh,32px)]">
            <div className="grid gap-4">
              <h2 className="mb-0 max-w-[760px] text-[clamp(2.25rem,4.7vw,3.8rem)] font-medium leading-[1] tracking-normal text-white max-[620px]:text-[clamp(2rem,10vw,2.75rem)]">
                Your pattern is already there.
                <br />
                This just names it.
              </h2>
              <p className="mb-0 text-[clamp(0.95rem,1.5vw,1.18rem)] font-medium leading-[1.4] text-white/48">
                Takes about 10 minutes. Private by default. No account needed to start.
              </p>
            </div>
            <Button
              className="min-h-[56px] rounded-full border-[#d94f81] bg-[#d94f81] px-9 text-[1rem] text-white hover:border-[#e65d90] hover:bg-[#e65d90] max-[620px]:min-h-[52px] max-[620px]:w-full max-[620px]:max-w-[320px]"
              onClick={startMirror}
            >
              Build my mirror <span aria-hidden="true">&rarr;</span>
            </Button>
          </div>
        </div>
        <div className="border-t border-white/10 text-[0.95rem] font-medium text-white/36">
          <div className="landing-container flex min-h-[88px] items-center justify-between gap-[18px] max-[620px]:min-h-[96px] max-[620px]:flex-col max-[620px]:justify-center max-[620px]:py-4">
            <span>Dating Mirror</span>
            <nav className="flex flex-wrap justify-center gap-[clamp(18px,3vw,34px)] [&_a]:no-underline [&_a:hover]:text-white" aria-label="Footer">
              <a href="#how-it-works">Method</a>
              <a href="#matrix-breakdown">Matrix</a>
              <a href="#privacy">Privacy</a>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
