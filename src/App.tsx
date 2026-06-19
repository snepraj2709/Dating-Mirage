import { useState } from 'react';
import { createOrUpdateSession, submitActualProfile } from './api/client';
import { Hero } from './components/Hero';
import { MirrorStepper } from './components/MirrorStepper';
import { Navigation } from './components/Navigation';
import { PrivacyStrip } from './components/PrivacyStrip';
import { Step1IdealFlow } from './components/Step1IdealFlow';
import { Step2SwipeMatrix } from './components/Step2SwipeMatrix';
import { clearActualSwipes, clearIdealDraft, loadStoredSession, saveStoredSession } from './lib/localState';
import type { UserSession, VectorProfile } from './types/dating-mirror';

type AppStage = 'landing' | 'ideal' | 'actual' | 'share';

export default function App() {
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
      <main className="stage-placeholder">
        <button className="ghost-button" onClick={() => setStage('actual')}>
          Back to swipes
        </button>
        <section className="placeholder-card">
          <p className="eyebrow">Step 3</p>
          <h1>What Friends Notice</h1>
          {saveError && <p className="inline-error">{saveError}</p>}
          <p>The private friend link flow plugs into this shell in the next commit.</p>
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
