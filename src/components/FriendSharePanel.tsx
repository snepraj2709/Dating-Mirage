import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Mail,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { ResultEmailCapture } from '@/components/ResultEmailCapture';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';
import { Label } from '@/components/ui/label';
import { Pill } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
import type { UserSession } from '../types/dating-mirror';

interface FriendSharePanelProps {
  session: UserSession | null;
  statusMessage?: string | null;
  isPreparingReport?: boolean;
  onBack: () => void;
  onViewReport: () => void;
  onRefresh: () => void | Promise<void>;
  onSaveResultEmail: (email: string) => Promise<UserSession>;
}

function ResponseDots({ count, target = 2 }: { count: number; target?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      {Array.from({ length: target }).map((_, index) => (
        <span
          key={index}
          className={`size-1.5 rounded-full ${index < count ? 'bg-positive' : 'bg-border-strong'}`}
        />
      ))}
    </span>
  );
}

export function FriendSharePanel({
  session,
  statusMessage,
  isPreparingReport = false,
  onBack,
  onViewReport,
  onRefresh,
  onSaveResultEmail,
}: FriendSharePanelProps) {
  const [displayName, setDisplayName] = useState('your friend');
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const friendCount = session?.friendCount ?? 0;
  const reportUnlocked = friendCount >= 2;
  const resultEmail = session?.resultEmail ?? null;
  const resultEmailSent = Boolean(session?.resultEmailSentAt);
  const progressValue = Math.min((friendCount / 2) * 100, 100);
  const responseCountLabel = `${friendCount} ${friendCount === 1 ? 'response' : 'responses'} received`;

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

  const refreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <FlowCard
      aria-labelledby="share-title"
      headerLabel="STEP 3 - SOCIAL MIRROR"
      headerMeta={
        <span className="inline-flex items-center gap-2">
          Friends <ResponseDots count={friendCount} /> {friendCount} of 2
        </span>
      }
      progressValue={progressValue}
      progressLabel={`${friendCount} of 2 friend responses`}
      progressVariant="accent"
      progressClassName="h-1.5 w-14 bg-[#eceff3]"
      contentClassName="pt-[clamp(18px,3vh,34px)]"
      footerLeft={
        <Button variant="ghostPill" onClick={onBack} className="max-[620px]:w-full">
          <ArrowLeft size={18} />
          Back
        </Button>
      }
    >
      {!resultEmail && (
        <div className="grid w-full gap-[clamp(18px,3vh,30px)]">
          <div className="grid max-w-[760px] gap-4">
            <Pill className="w-fit border-border-strong bg-muted px-4 text-[0.9rem] tracking-normal text-foreground">
              <span className="size-1.5 rounded-full bg-positive" />
              Your reflection is saved
            </Pill>
            <div>
              <h2
                id="share-title"
                className="mb-3 max-w-[620px] text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.02] text-foreground max-[620px]:text-[clamp(1.8rem,9vw,2.55rem)]"
              >
                Now send it to people who've seen the pattern.
              </h2>
              <p className="mb-0 max-w-[760px] text-[clamp(1rem,1.8vw,1.18rem)] leading-[1.5]">
                Pick 2-4 people who've watched you date. They get 8 quick questions; you only see
                the pattern they confirm, never their exact words.
              </p>
            </div>
            {statusMessage && <InlineError className="mb-0">{statusMessage}</InlineError>}
          </div>

          <div className="grid gap-3">
            <Label className="max-w-[840px]">
              Your invite link
              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-3 max-[720px]:grid-cols-1">
                <div className="grid min-h-[50px] grid-cols-[auto_1fr] items-center gap-3 overflow-hidden rounded-lg border border-input bg-card px-4 text-foreground">
                  <LinkIcon size={17} className="text-muted-foreground" />
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.95rem] font-medium">
                    {shareUrl || 'Finish Step 1 and Step 2 to generate a link.'}
                  </span>
                </div>
                <Button variant="ghostPill" onClick={copyLink} disabled={!shareUrl}>
                  <Copy size={17} />
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button asChild variant="secondaryPill" className={!shareUrl ? 'pointer-events-none opacity-60' : ''}>
                  <a href={shareUrl || '#'} target="_blank" rel="noreferrer">
                    Preview
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
            </Label>
            <p className="mb-0 inline-flex items-center gap-2 text-[0.94rem]">
              <ShieldCheck size={16} />
              One link, multiple friends. They can choose to stay anonymous.
            </p>
            <div className="flex min-h-[54px] items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-3 max-[620px]:grid">
              <span className="grid gap-1">
                <span className="text-[0.78rem] font-medium uppercase tracking-normal text-subtle-foreground">
                  Invite status
                </span>
                <span className="text-[0.98rem] font-medium text-foreground">{responseCountLabel}</span>
              </span>
              <Button variant="ghostPill" size="compact" onClick={refreshStatus} disabled={isRefreshing} className="shrink-0 max-[620px]:w-full">
                <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : undefined} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
            {reportUnlocked && (
              <Surface className="grid gap-4 p-[clamp(18px,2.5vw,26px)]" variant="muted">
                <div className="grid gap-1">
                  <h3 className="mb-0 text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.18] text-foreground">
                    Your mirror is ready.
                  </h3>
                  <p className="mb-0">
                    Two friend responses are in. Open the final report for this session.
                  </p>
                </div>
                <Button className="min-h-[54px] w-fit px-8 text-white max-[620px]:w-full" onClick={onViewReport} disabled={isPreparingReport}>
                  {isPreparingReport ? 'Opening...' : 'Show my Mirror'}
                  <ArrowRight size={18} />
                </Button>
              </Surface>
            )}
          </div>

          {!reportUnlocked && (
            <ResultEmailCapture
              title="Where should we send your results?"
              description="We'll email you the moment 2 friends respond. No password yet; just your email to hold your spot."
              buttonLabel="Secure your Dating Mirror"
              savingLabel="Holding..."
              trustText="Never shared. Used only to deliver your mirror."
              initialEmail={session?.resultEmail}
              onSubmit={onSaveResultEmail}
            />
          )}
        </div>
      )}

      {resultEmail && !reportUnlocked && (
        <div className="grid w-full place-items-center gap-[clamp(20px,4vh,38px)] text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-full border border-input bg-card">
            <Mail size={28} />
          </span>
          <div className="grid max-w-[620px] gap-3">
            <h2
              id="share-title"
              className="mb-0 text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.06] text-foreground"
            >
              Your mirror is reflecting.
            </h2>
            <p className="mb-0 text-[clamp(1rem,1.7vw,1.15rem)] leading-[1.5]">
              Your results are being held at this address. We'll email you the second your second
              friend responds.
            </p>
          </div>
          <Pill className="border-border-strong bg-muted px-4 text-[0.92rem] tracking-normal text-foreground">
            <Mail size={15} />
            {resultEmail}
          </Pill>

          <div className="grid justify-items-center gap-3">
            <div className="grid size-[86px] place-items-center rounded-full border-[5px] border-border border-r-foreground text-[1.65rem] font-medium text-foreground">
              {friendCount}
            </div>
            <p className="mb-0 text-[0.96rem]">{friendCount} of 2 friends responded</p>
            <div className="grid min-w-[min(360px,100%)] grid-cols-[auto_1fr_auto] items-center gap-3 text-left text-[0.96rem] max-[520px]:grid-cols-[auto_1fr]">
              <span className="size-2 rounded-full bg-positive" />
              <span>First response</span>
              <span className="text-positive max-[520px]:col-span-2 max-[520px]:ml-5">
                {friendCount >= 1 ? 'Done' : 'Waiting...'}
              </span>
              <span className={`size-2 rounded-full ${friendCount >= 2 ? 'bg-positive' : 'bg-border-strong'}`} />
              <span>Second response</span>
              <span className={friendCount >= 2 ? 'text-positive max-[520px]:col-span-2 max-[520px]:ml-5' : 'text-muted-foreground max-[520px]:col-span-2 max-[520px]:ml-5'}>
                {friendCount >= 2 ? 'Done' : 'Waiting...'}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 max-[520px]:grid max-[520px]:w-full">
              <Button variant="ghostPill" onClick={refreshStatus} disabled={isRefreshing}>
                <RefreshCw size={17} className={isRefreshing ? 'animate-spin' : undefined} />
                {isRefreshing ? 'Refreshing...' : 'Refresh status'}
              </Button>
              <Button variant="ghostPill" onClick={copyLink} disabled={!shareUrl}>
                <Copy size={17} />
                {copied ? 'Copied' : 'Copy reminder link'}
              </Button>
            </div>
          </div>

          <div className="grid w-full gap-4 border-t border-border pt-[clamp(18px,3vh,26px)] text-left">
            <div>
              <h3 className="mb-1 text-[1.05rem] text-foreground">A peek at what's coming</h3>
              <p className="mb-0">
                Your mirror is already forming. The full picture unlocks when your second friend responds.
              </p>
            </div>
            <div className="mx-auto grid w-[min(640px,100%)] gap-3 rounded-lg border border-border-strong bg-muted p-5">
              <span className="text-[0.78rem] uppercase tracking-[0.24em] text-subtle-foreground">
                Your Dating Mirror - Partial
              </span>
              <div>
                <span className="text-[0.78rem] uppercase tracking-[0.18em] text-subtle-foreground">
                  Who you say you want
                </span>
                <p className="mb-0 mt-1 text-foreground">
                  Someone emotionally steady, warm, and easy to be around.
                </p>
              </div>
              <div className="h-px bg-border" />
              <div className="grid gap-2 blur-[5px] select-none">
                <span className="h-4 w-4/5 rounded bg-border" />
                <span className="h-4 w-2/3 rounded bg-border" />
                <span className="h-4 w-3/4 rounded bg-border" />
              </div>
              <p className="mb-0 text-center text-[0.92rem]">2 more buckets unlock with your second response</p>
            </div>
          </div>
          {statusMessage && <InlineError className="mb-0">{statusMessage}</InlineError>}
        </div>
      )}

      {resultEmail && reportUnlocked && (
        <div className="grid w-full place-items-center gap-[clamp(20px,4vh,38px)] text-center">
          <span className="inline-flex size-16 items-center justify-center rounded-full border border-input bg-card">
            <Check size={30} className="text-positive" />
          </span>
          <div className="grid max-w-[620px] gap-3">
            <h2
              id="share-title"
              className="mb-0 text-[clamp(1.9rem,3.8vw,2.8rem)] leading-[1.06] text-foreground"
            >
              Your mirror is ready.
            </h2>
            <p className="mb-0 text-[clamp(1rem,1.7vw,1.15rem)] leading-[1.5]">
              {resultEmailSent
                ? `We sent the unlock link to ${resultEmail}. Open it to set a password and see your mirror.`
                : `Your results are ready for ${resultEmail}. Refresh once if the unlock email has not arrived yet.`}
            </p>
          </div>
          <Pill className="border-border-strong bg-muted px-4 text-[0.92rem] tracking-normal text-foreground">
            <Mail size={15} />
            {resultEmail}
          </Pill>
          <Surface className="grid w-[min(620px,100%)] gap-3 p-5 text-left" variant="muted">
            <span className="text-[0.78rem] uppercase tracking-[0.22em] text-subtle-foreground">
              The result notification email
            </span>
            <p className="mb-0 text-foreground">
              Subject: <strong>Your mirror is ready.</strong>
            </p>
            <p className="mb-0">
              The link opens a private unlock screen where you set a password and go straight to the full report.
            </p>
          </Surface>
          <Button className="min-h-[54px] px-8 text-white" onClick={onViewReport} disabled={isPreparingReport}>
            {isPreparingReport ? 'Opening...' : 'Show my Mirror'}
            <ArrowRight size={18} />
          </Button>
          {statusMessage && <InlineError className="mb-0">{statusMessage}</InlineError>}
        </div>
      )}
    </FlowCard>
  );
}
