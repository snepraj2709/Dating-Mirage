import { useEffect, useState } from 'react';
import { burnSession, createOrUpdateSession, getReport, getSession, submitActualProfile } from './api/client';
import { FriendRapidFireDeck } from './components/FriendRapidFireDeck';
import { FriendSharePanel } from './components/FriendSharePanel';
import { Hero } from './components/Hero';
import { JohariReveal } from './components/JohariReveal';
import { LandingJohariMatrix } from './components/LandingJohariMatrix';
import { MirrorStepper } from './components/MirrorStepper';
import { MirrorSimulator } from './components/MirrorSimulator';
import { Navigation } from './components/Navigation';
import { PrivacyStrip } from './components/PrivacyStrip';
import { Step1IdealFlow } from './components/Step1IdealFlow';
import { Step2SwipeMatrix } from './components/Step2SwipeMatrix';
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
import { aggregateSocialProfile, calculateJohariReport } from './lib/scoring';
import type { JohariReport, UserSession, VectorProfile } from './types/dating-mirror';

type AppStage = 'landing' | 'ideal' | 'actual' | 'share' | 'reveal';

export default function App() {
  const friendMatch = window.location.pathname.match(/^\/friend\/([^/]+)/);
  const [stage, setStage] = useState<AppStage>('landing');
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession());
  const [isSavingIdeal, setIsSavingIdeal] = useState(false);
  const [isSavingActual, setIsSavingActual] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [report, setReport] = useState<JohariReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  const handleIdealComplete = async (idealProfile: VectorProfile) => {
    setIsSavingIdeal(true);
    setSaveError(null);

    try {
      const nextSession = await createOrUpdateSession(idealProfile, session?.id);
      setSession(nextSession);
      saveStoredSession(nextSession);
      clearIdealDraft();
      setStage('actual');
    } catch {
      const localSession: UserSession = {
        id: session?.id ?? `local-${crypto.randomUUID()}`,
        idealProfile,
        actualProfile: session?.actualProfile ?? null,
        socialProfile: session?.socialProfile ?? null,
        friendCount: session?.friendCount ?? 0,
        reportUnlocked: session?.reportUnlocked ?? false,
      };
      setSession(localSession);
      saveStoredSession(localSession);
      clearIdealDraft();
      setSaveError('Saved locally. Start the backend before final report sync.');
      setStage('actual');
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

    try {
      if (currentSession.id.startsWith('local-')) {
        throw new Error('Local session has no backend id yet');
      }

      const nextSession = await submitActualProfile(currentSession.id, actualProfile);
      setSession(nextSession);
      saveStoredSession(nextSession);
      clearActualSwipes();
      setStage('share');
    } catch {
      const localSession: UserSession = {
        ...currentSession,
        actualProfile,
      };
      setSession(localSession);
      saveStoredSession(localSession);
      clearActualSwipes();
      setSaveError('Actual pattern saved locally. Backend sync can retry later.');
      setStage('share');
    } finally {
      setIsSavingActual(false);
    }
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
      const nextSession = {
        ...session,
        friendCount,
        reportUnlocked: friendCount >= 2,
      };
      setSession(nextSession);
      saveStoredSession(nextSession);
      setSaveError('Using locally saved friend responses.');
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

        throw new Error('Local report fallback');
      } catch {
        const friendProfiles = loadLocalFriendProfiles(activeSession.id);
        const socialProfile = aggregateSocialProfile(friendProfiles);

        if (
          !activeSession.idealProfile ||
          !activeSession.actualProfile ||
          !socialProfile ||
          friendProfiles.length < 2
        ) {
          if (!cancelled) {
            setReportError('The mirror needs two friend responses plus your ideal and actual vectors.');
          }
          return;
        }

        const localReport = calculateJohariReport(
          activeSession.id,
          activeSession.idealProfile,
          activeSession.actualProfile,
          socialProfile,
          friendProfiles.length,
        );
        const nextSession = {
          ...activeSession,
          socialProfile,
          friendCount: friendProfiles.length,
          reportUnlocked: true,
        };

        if (!cancelled) {
          setReport(localReport);
          setSession(nextSession);
          saveStoredSession(nextSession);
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

  const startReveal = () => {
    setReport(null);
    setReportError(null);
    setStage('reveal');
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

  if (stage === 'ideal') {
    return (
      <Step1IdealFlow
        isSaving={isSavingIdeal}
        saveError={saveError}
        onBack={() => setStage('landing')}
        onComplete={handleIdealComplete}
      />
    );
  }

  if (stage === 'actual') {
    return (
      <Step2SwipeMatrix
        isSaving={isSavingActual}
        saveError={saveError}
        onBack={() => setStage('ideal')}
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
        onRefresh={refreshFriendCount}
        onContinue={startReveal}
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
        <JohariReveal
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
    <main className="min-h-screen bg-background">
      <Navigation onStart={startMirror} />
      <Hero onStart={startMirror} />
      <MirrorStepper />
      <LandingJohariMatrix />
      <MirrorSimulator onStart={startMirror} />
      <PrivacyStrip />
      <footer className="flex min-h-[84px] items-center justify-between gap-[18px] border-t border-border px-[clamp(16px,5vw,64px)] text-[0.9rem] text-muted-foreground max-[620px]:flex-col max-[620px]:items-start max-[620px]:justify-center max-[620px]:py-5">
        <span>Dating Mirror</span>
        <nav className="flex flex-wrap gap-[18px] [&_a]:no-underline [&_a:hover]:text-foreground" aria-label="Footer">
          <a href="#how-it-works">Method</a>
          <a href="#matrix-breakdown">Matrix</a>
          <a href="#privacy">Privacy</a>
        </nav>
      </footer>
    </main>
  );
}
