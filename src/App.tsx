import { useState } from 'react';
import { createOrUpdateSession, getSession, submitActualProfile } from './api/client';
import { FriendRapidFireDeck } from './components/FriendRapidFireDeck';
import { FriendSharePanel } from './components/FriendSharePanel';
import { Hero } from './components/Hero';
import { MirrorStepper } from './components/MirrorStepper';
import { Navigation } from './components/Navigation';
import { PrivacyStrip } from './components/PrivacyStrip';
import { Step1IdealFlow } from './components/Step1IdealFlow';
import { Step2SwipeMatrix } from './components/Step2SwipeMatrix';
import {
  clearActualSwipes,
  clearIdealDraft,
  loadLocalFriendProfiles,
  loadStoredSession,
  saveStoredSession,
} from './lib/localState';
import type { UserSession, VectorProfile } from './types/dating-mirror';

type AppStage = 'landing' | 'ideal' | 'actual' | 'share' | 'reveal';

export default function App() {
  const friendMatch = window.location.pathname.match(/^\/friend\/([^/]+)/);
  const [stage, setStage] = useState<AppStage>('landing');
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession());
  const [isSavingIdeal, setIsSavingIdeal] = useState(false);
  const [isSavingActual, setIsSavingActual] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

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
        onContinue={() => setStage('reveal')}
      />
    );
  }

  if (stage === 'reveal') {
    return (
      <main className="stage-placeholder">
        <button className="ghost-button" onClick={() => setStage('share')}>
          Back to sharing
        </button>
        <section className="placeholder-card">
          <p className="eyebrow">Step 4</p>
          <h1>The Mirror Analysis</h1>
          <p>The Johari reveal and share card plug into this shell in the next commit.</p>
        </section>
      </main>
    );
  }

  return (
    <>
      <Navigation onStart={() => setStage('ideal')} />
      <main className="app-shell">
        <Hero onStart={() => setStage('ideal')} />
        <MirrorStepper />
        <PrivacyStrip />
      </main>
    </>
  );
}
