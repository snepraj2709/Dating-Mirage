import { useState } from 'react';
import { createOrUpdateSession } from './api/client';
import { Hero } from './components/Hero';
import { MirrorStepper } from './components/MirrorStepper';
import { Navigation } from './components/Navigation';
import { PrivacyStrip } from './components/PrivacyStrip';
import { Step1IdealFlow } from './components/Step1IdealFlow';
import { clearIdealDraft, loadStoredSession, saveStoredSession } from './lib/localState';
import type { UserSession, VectorProfile } from './types/dating-mirror';

type AppStage = 'landing' | 'ideal' | 'actual';

export default function App() {
  const [stage, setStage] = useState<AppStage>('landing');
  const [session, setSession] = useState<UserSession | null>(() => loadStoredSession());
  const [isSavingIdeal, setIsSavingIdeal] = useState(false);
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
      <main className="stage-placeholder">
        <button className="ghost-button" onClick={() => setStage('ideal')}>
          Back to ideal
        </button>
        <section className="placeholder-card">
          <p className="eyebrow">Step 2</p>
          <h1>Who I Actually Choose</h1>
          {saveError && <p className="inline-error">{saveError}</p>}
          <p>The swipe matrix plugs into this shell in the next commit.</p>
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
