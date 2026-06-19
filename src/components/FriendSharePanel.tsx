import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, ExternalLink, LockKeyhole, Mail, RefreshCw, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlowCard } from '@/components/ui/flow-card';
import { InlineError } from '@/components/ui/flow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pill } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
import { loadAnalysisAccess, saveAnalysisAccess } from '../lib/localState';
import type { AnalysisAccessAccount, UserSession } from '../types/dating-mirror';

interface FriendSharePanelProps {
  session: UserSession | null;
  statusMessage?: string | null;
  onBack: () => void;
  onRefresh: () => void;
  onContinue: () => void;
}

async function hashPassword(password: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const [inviteSent, setInviteSent] = useState(false);
  const [account, setAccount] = useState<AnalysisAccessAccount | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [accessMessage, setAccessMessage] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    const savedAccount = session?.id ? loadAnalysisAccess(session.id) : null;
    setAccount(savedAccount);
    setInviteSent(Boolean(savedAccount));
    setEmail(savedAccount?.email ?? '');
    setLoginEmail(savedAccount?.email ?? '');
    setPassword('');
    setConfirmPassword('');
    setLoginPassword('');
    setAccessMessage(null);
    setAccessError(null);
  }, [session?.id]);

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
    setInviteSent(true);
    setAccessMessage('Invite link copied. Set your analysis login next.');
    setAccessError(null);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const markInviteSent = () => {
    if (!shareUrl) {
      return;
    }
    setInviteSent(true);
    setAccessMessage('Invite marked as sent. Set your analysis login next.');
    setAccessError(null);
  };

  const saveAccessDetails = async () => {
    if (!session?.id) {
      setAccessError('Finish Step 2 before creating analysis access.');
      return;
    }

    const nextEmail = email.trim().toLowerCase();
    if (!isValidEmail(nextEmail)) {
      setAccessError('Enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setAccessError('Use at least 8 characters for your password.');
      return;
    }

    if (password !== confirmPassword) {
      setAccessError('Passwords do not match.');
      return;
    }

    const nextAccount = {
      email: nextEmail,
      passwordHash: await hashPassword(password),
    };
    saveAnalysisAccess(session.id, nextAccount);
    setAccount(nextAccount);
    setLoginEmail(nextEmail);
    setPassword('');
    setConfirmPassword('');
    setAccessError(null);
    setAccessMessage('Analysis access saved. Use this login once two friends respond.');
  };

  const loginAndReveal = async () => {
    if (!account) {
      setAccessError('Create your analysis login first.');
      return;
    }

    if (!reportUnlocked) {
      setAccessError('Your mirror unlocks after two friend responses.');
      return;
    }

    const submittedEmail = loginEmail.trim().toLowerCase();
    const submittedHash = await hashPassword(loginPassword);
    if (submittedEmail !== account.email || submittedHash !== account.passwordHash) {
      setAccessError('Email or password is incorrect.');
      return;
    }

    setAccessError(null);
    onContinue();
  };

  const friendCount = session?.friendCount ?? 0;
  const reportUnlocked = friendCount >= 2;
  const progressValue = Math.min((friendCount / 2) * 100, 100);

  return (
    <FlowCard
      aria-labelledby="share-title"
      headerLabel="LAUNCH MY MIRROR: STEP 3 (SOCIAL MIRROR)"
      headerMeta={`FRIENDS ${friendCount} OF 2`}
      progressValue={progressValue}
      progressLabel={`${friendCount} of 2 friend responses`}
      contentClassName="place-items-center"
      footerLeft={
        <Button variant="ghostPill" onClick={onBack} className="max-[620px]:w-full">
          <ArrowLeft size={18} />
          Back
        </Button>
      }
      footerRight={
        <Button variant="ghostPill" size="compact" onClick={onRefresh} className="max-[620px]:w-full">
          <RefreshCw size={17} />
          Refresh
        </Button>
      }
    >
      <div className="grid w-full max-w-[940px] gap-[clamp(18px,3vh,30px)]">
        <div className="grid justify-items-center gap-4 text-center">
          <Pill className="min-h-[34px] border-border-strong bg-muted px-5 text-[0.86rem] uppercase tracking-normal text-foreground">
            SOCIAL MIRROR INVITES
          </Pill>
          <h2
            id="share-title"
            className="mb-0 max-w-[800px] text-[clamp(1.85rem,4vw,3rem)] leading-[1.08] text-foreground max-[620px]:text-[clamp(1.55rem,8vw,2.2rem)]"
          >
            Send the vibe check to people who have seen the pattern.
          </h2>
          <p className="mb-0 max-w-[720px] font-medium leading-[1.5] text-muted-foreground">
            Friends get a private 8-question rapid-fire deck. You only see the count and aggregate signal,
            never individual answers.
          </p>
          {statusMessage && <InlineError className="mb-0 text-center">{statusMessage}</InlineError>}
        </div>

        <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] gap-4 max-[760px]:grid-cols-1">
          <Surface className="grid gap-4 p-[clamp(18px,2.6vw,28px)]" variant="muted">
            <Label>
              What should friends call you?
              <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
            </Label>

            <div className="grid min-h-[58px] grid-cols-[auto_1fr] items-center gap-2.5 overflow-hidden rounded-lg border border-border bg-card p-3.5 text-foreground">
              <Share2 size={18} />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.92rem] font-medium text-foreground">
                {shareUrl || 'Finish Step 1 and Step 2 to generate a link.'}
              </span>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 max-[620px]:grid-cols-1">
              <Button onClick={copyLink} disabled={!shareUrl}>
                <Copy size={18} />
                {copied ? 'Copied' : 'Copy invite'}
              </Button>
              <Button asChild variant="secondaryPill" className={!shareUrl ? 'pointer-events-none opacity-60' : ''}>
                <a href={shareUrl || '#'} target="_blank" rel="noreferrer">
                  Preview
                  <ExternalLink size={16} />
                </a>
              </Button>
            </div>

            <Button variant="ghostPill" onClick={markInviteSent} disabled={!shareUrl}>
              I sent the invite
            </Button>
          </Surface>

          <Surface className="grid gap-4 p-[clamp(18px,2.6vw,28px)]">
            <div className="grid grid-cols-[auto_1fr] items-center gap-3.5">
              <span className="inline-flex size-[62px] items-center justify-center rounded-full bg-foreground font-medium text-background">
                {friendCount}/2
              </span>
              <div>
                <h3 className="mb-0 text-xl leading-[1.2] text-foreground">
                  {reportUnlocked ? 'Mirror unlocked' : 'Waiting for two friends'}
                </h3>
                <p className="mb-0">
                  {reportUnlocked
                    ? 'Your analysis is ready. Sign in below to open it.'
                    : 'Your final analysis unlocks after two completed friend decks.'}
                </p>
              </div>
            </div>

            <div className="grid gap-2 rounded-lg border border-border bg-muted p-4">
              <div className="flex items-center gap-2 text-[0.88rem] font-medium uppercase tracking-normal text-subtle-foreground">
                <Mail size={16} />
                Final analysis access
              </div>
              <p className="mb-0">
                {account
                  ? `Analysis delivery is set for ${account.email}. Sign in below once friends are done.`
                  : inviteSent
                  ? 'Add the email and password you will use to receive and open your final analysis.'
                  : 'Copy the invite link or mark it sent to unlock analysis access setup.'}
              </p>
            </div>
          </Surface>
        </div>

        {inviteSent && (
          <Surface className="grid gap-4 p-[clamp(18px,2.6vw,28px)]">
            {!account ? (
              <>
                <div className="grid gap-1">
                  <h3 className="mb-0 text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.15] text-foreground">
                    Where should we send your final analysis?
                  </h3>
                  <p className="mb-0">
                    Once two friends respond, you will use this email and password to log in and see the result.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">
                  <Label>
                    Email
                    <Input
                      autoComplete="email"
                      inputMode="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </Label>
                  <Label>
                    Password
                    <Input
                      autoComplete="new-password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </Label>
                  <Label>
                    Confirm password
                    <Input
                      autoComplete="new-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                  </Label>
                </div>

                <Button className="w-[min(320px,100%)]" onClick={saveAccessDetails}>
                  <LockKeyhole size={18} />
                  Save analysis login
                </Button>
              </>
            ) : (
              <>
                <div className="grid gap-1">
                  <h3 className="mb-0 text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.15] text-foreground">
                    Sign in to open your final analysis.
                  </h3>
                  <p className="mb-0">
                    We will send the final analysis to <strong className="text-foreground">{account.email}</strong>.
                    Use the same login once the two friend responses are in.
                  </p>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-3 max-[760px]:grid-cols-1">
                  <Label>
                    Email
                    <Input
                      autoComplete="email"
                      inputMode="email"
                      type="email"
                      value={loginEmail}
                      onChange={(event) => setLoginEmail(event.target.value)}
                    />
                  </Label>
                  <Label>
                    Password
                    <Input
                      autoComplete="current-password"
                      type="password"
                      value={loginPassword}
                      onChange={(event) => setLoginPassword(event.target.value)}
                    />
                  </Label>
                  <Button className="min-h-[50px] px-6 max-[760px]:w-full" onClick={loginAndReveal} disabled={!reportUnlocked}>
                    {reportUnlocked ? 'Log in and reveal' : 'Waiting for friends'}
                    <Sparkles size={18} />
                  </Button>
                </div>
              </>
            )}

            {accessMessage && <p className="mb-0 font-medium text-muted-foreground">{accessMessage}</p>}
            {accessError && <InlineError className="mb-0">{accessError}</InlineError>}
          </Surface>
        )}
      </div>
    </FlowCard>
  );
}
