import { useMemo, useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, RefreshCw, Share2, Sparkles } from 'lucide-react';
import type { UserSession } from '../types/dating-mirror';

interface FriendSharePanelProps {
  session: UserSession | null;
  statusMessage?: string | null;
  onBack: () => void;
  onRefresh: () => void;
  onContinue: () => void;
}

export function FriendSharePanel({
  session,
  statusMessage,
  onBack,
  onRefresh,
  onContinue,
}: FriendSharePanelProps) {
  const [displayName, setDisplayName] = useState('your friend');
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (!session?.id) {
      return '';
    }

    const url = new URL(`/friend/${session.id}`, window.location.origin);
    if (displayName.trim()) {
      url.searchParams.set('name', displayName.trim());
    }
    return url.toString();
  }, [displayName, session?.id]);

  const copyLink = async () => {
    if (!shareUrl) {
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const friendCount = session?.friendCount ?? 0;
  const reportUnlocked = friendCount >= 2;

  return (
    <main className="share-screen">
      <div className="flow-topbar">
        <button className="ghost-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Actual
        </button>
        <button className="ghost-button" onClick={onRefresh}>
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <section className="share-layout">
        <div className="share-copy">
          <p className="eyebrow">Step 3 - What Friends Notice</p>
          <h2>Send the vibe check to people who have seen the pattern.</h2>
          <p>
            Friends get a private 8-question rapid-fire deck. You only see the count and
            aggregate signal, never individual answers.
          </p>
          {statusMessage && <p className="inline-error">{statusMessage}</p>}
        </div>

        <article className="share-card-panel">
          <label className="text-field">
            What should friends call you?
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </label>

          <div className="share-url-box">
            <Share2 size={18} />
            <span>{shareUrl || 'Finish Step 1 and Step 2 to generate a link.'}</span>
          </div>

          <div className="share-actions">
            <button className="primary-button" onClick={copyLink} disabled={!shareUrl}>
              <Copy size={18} />
              {copied ? 'Copied' : 'Copy link'}
            </button>
            <a className="secondary-link" href={shareUrl || '#'} target="_blank" rel="noreferrer">
              Preview
              <ExternalLink size={16} />
            </a>
          </div>

          <div className="unlock-meter">
            <span className="meter-count">{friendCount}/2</span>
            <div>
              <h3>{reportUnlocked ? 'Mirror unlocked' : 'Waiting for two friends'}</h3>
              <p>
                {reportUnlocked
                  ? 'The Johari reveal is ready to cook.'
                  : 'Minimum two completed friend decks are required before the final report.'}
              </p>
            </div>
          </div>

          <button className="primary-button flow-continue" onClick={onContinue} disabled={!reportUnlocked}>
            Reveal my mirror
            <Sparkles size={18} />
          </button>
        </article>
      </section>
    </main>
  );
}
