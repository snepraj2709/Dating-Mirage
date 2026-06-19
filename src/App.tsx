import { useState } from 'react';
import { ComingNext } from './components/ComingNext';
import { Hero } from './components/Hero';
import { MirrorStepper } from './components/MirrorStepper';
import { Navigation } from './components/Navigation';
import { PrivacyStrip } from './components/PrivacyStrip';

type AppStage = 'landing' | 'ideal';

export default function App() {
  const [stage, setStage] = useState<AppStage>('landing');

  if (stage === 'ideal') {
    return <ComingNext onBack={() => setStage('landing')} />;
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
