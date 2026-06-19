import { ArrowLeft, ClipboardList } from 'lucide-react';

interface ComingNextProps {
  onBack: () => void;
}

export function ComingNext({ onBack }: ComingNextProps) {
  return (
    <section className="stage-placeholder">
      <button className="ghost-button" onClick={onBack}>
        <ArrowLeft size={18} />
        Back
      </button>
      <div className="placeholder-card">
        <ClipboardList size={32} />
        <p className="eyebrow">Step 1</p>
        <h1>Who I Say I Want</h1>
        <p>
          The ideal partner slider deck plugs into this shell in the next commit.
        </p>
      </div>
    </section>
  );
}

