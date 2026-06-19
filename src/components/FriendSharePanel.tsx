import { useMemo, useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, RefreshCw, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowShell, InlineError, TopBar } from '@/components/ui/flow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eyebrow } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
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
    <FlowShell className="w-[min(1040px,calc(100%_-_32px))] pb-14 max-[620px]:w-[min(100%_-_24px,520px)]">
      <TopBar>
        <Button variant="ghostPill" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Actual
        </Button>
        <Button variant="ghostPill" onClick={onRefresh}>
          <RefreshCw size={17} />
          Refresh
        </Button>
      </TopBar>

      <section className="grid min-h-[calc(100vh_-_144px)] grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] items-center gap-7 max-[620px]:min-h-auto max-[620px]:grid-cols-1 max-[620px]:pt-6">
        <div>
          <Eyebrow>Step 3 - What Friends Notice</Eyebrow>
          <h2 className="max-w-[720px] text-[clamp(2.4rem,7vw,5rem)] leading-[1.05] text-foreground">
            Send the vibe check to people who have seen the pattern.
          </h2>
          <p>
            Friends get a private 8-question rapid-fire deck. You only see the count and
            aggregate signal, never individual answers.
          </p>
          {statusMessage && <InlineError>{statusMessage}</InlineError>}
        </div>

        <Surface asChild>
          <article>
          <Label>
            What should friends call you?
            <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
          </Label>

          <div className="my-[18px] grid min-h-[58px] grid-cols-[auto_1fr] items-center gap-2.5 overflow-hidden rounded-lg border border-border bg-muted p-3.5 text-foreground">
            <Share2 size={18} />
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.92rem] font-medium text-foreground">
              {shareUrl || 'Finish Step 1 and Step 2 to generate a link.'}
            </span>
          </div>

          <div className="mb-[18px] flex flex-wrap gap-3">
            <Button onClick={copyLink} disabled={!shareUrl}>
              <Copy size={18} />
              {copied ? 'Copied' : 'Copy link'}
            </Button>
            <Button asChild variant="secondaryPill">
              <a href={shareUrl || '#'} target="_blank" rel="noreferrer">
                Preview
                <ExternalLink size={16} />
              </a>
            </Button>
          </div>

          <div className="mb-[18px] grid grid-cols-[auto_1fr] items-center gap-3.5 rounded-lg border border-border p-4">
            <span className="inline-flex size-[62px] items-center justify-center rounded-full bg-foreground font-medium text-background">
              {friendCount}/2
            </span>
            <div>
              <h3 className="mb-0 text-xl leading-[1.2] text-foreground">
                {reportUnlocked ? 'Mirror unlocked' : 'Waiting for two friends'}
              </h3>
              <p className="mb-0">
                {reportUnlocked
                  ? 'The Johari reveal is ready to cook.'
                  : 'Minimum two completed friend decks are required before the final report.'}
              </p>
            </div>
          </div>

          <Button size="flow" onClick={onContinue} disabled={!reportUnlocked}>
            Reveal my mirror
            <Sparkles size={18} />
          </Button>
          </article>
        </Surface>
      </section>
    </FlowShell>
  );
}
