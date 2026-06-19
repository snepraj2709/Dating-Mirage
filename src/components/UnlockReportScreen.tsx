import { useEffect, useState } from 'react';
import { Eye, EyeOff, LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react';
import { getSession } from '@/api/client';
import { Button } from '@/components/ui/button';
import { CompactLoader, FlowShell, InlineError } from '@/components/ui/flow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Surface } from '@/components/ui/surface';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { UserSession } from '@/types/dating-mirror';

interface UnlockReportScreenProps {
  sessionId: string | null;
  fallbackSession: UserSession | null;
  onUnlocked: (session: UserSession) => void;
}

export function UnlockReportScreen({ sessionId, fallbackSession, onUnlocked }: UnlockReportScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [mirrorSession, setMirrorSession] = useState<UserSession | null>(null);
  const [isCheckingLink, setIsCheckingLink] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResultAccess, setHasResultAccess] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadUnlockState() {
      setIsCheckingLink(true);
      setError(null);

      if (!sessionId) {
        setError('Open this from your result email link.');
        setIsCheckingLink(false);
        return;
      }

      try {
        let nextSession: UserSession | null = null;
        try {
          nextSession = await getSession(sessionId);
        } catch {
          nextSession = fallbackSession?.id === sessionId ? fallbackSession : null;
        }

        if (cancelled) {
          return;
        }

        setMirrorSession(nextSession);

        if (!isSupabaseConfigured || !supabase) {
          setEmail(nextSession?.resultEmail ?? fallbackSession?.resultEmail ?? '');
          setError('This result link is not ready yet. Try again from the email when it arrives.');
          setIsCheckingLink(false);
          return;
        }

        const [{ data: authSession }, { data: authUser }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.auth.getUser(),
        ]);

        if (cancelled) {
          return;
        }

        const authEmail = authSession.session?.user.email ?? authUser.user?.email ?? '';
        setEmail(authEmail || nextSession?.resultEmail || fallbackSession?.resultEmail || '');
        setHasResultAccess(Boolean(authEmail));
        if (!authEmail) {
          setError('Open this screen from your result email link.');
        }
      } finally {
        if (!cancelled) {
          setIsCheckingLink(false);
        }
      }
    }

    void loadUnlockState();

    return () => {
      cancelled = true;
    };
  }, [fallbackSession, sessionId]);

  const submitPassword = async () => {
    if (!sessionId) {
      setError('Open this from your result email link.');
      return;
    }

    if (!hasResultAccess || !supabase) {
      setError('Open this screen from your result email link.');
      return;
    }

    if (password.length < 8) {
      setError('Use at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError('We could not set that password. Open the result email again and retry.');
        return;
      }

      let nextSession = mirrorSession;
      try {
        nextSession = await getSession(sessionId);
      } catch {
        nextSession = fallbackSession?.id === sessionId ? fallbackSession : mirrorSession;
      }

      if (!nextSession?.reportUnlocked) {
        setError('Your report still needs two friend responses.');
        return;
      }

      onUnlocked(nextSession);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FlowShell className="grid min-h-svh w-[min(980px,calc(100%_-_32px))] content-center py-[clamp(16px,4vh,40px)] max-[620px]:w-[min(100%_-_24px,560px)]">
      <div className="grid gap-4">
        <p className="mb-0 text-[0.82rem] uppercase tracking-[0.28em] text-subtle-foreground">
          Mirror unlock - opened from the email link
        </p>

        <Surface className="mx-auto grid w-[min(640px,100%)] gap-0 overflow-hidden p-0">
          <div className="grid justify-items-center gap-3 border-b border-border px-[clamp(20px,4vw,32px)] py-[clamp(24px,5vw,36px)] text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full border border-border-strong bg-muted">
              <LockKeyhole size={24} />
            </span>
            <div>
              <h1 className="mb-1 text-[clamp(1.75rem,4vw,2.55rem)] leading-[1.08] text-foreground">
                One last thing to unlock your mirror.
              </h1>
              <p className="mb-0 max-w-[480px]">
                Set a password for this report. Your email is already confirmed; this keeps the
                mirror private.
              </p>
            </div>
          </div>

          <div className="grid gap-4 px-[clamp(20px,4vw,32px)] py-[clamp(20px,4vw,30px)]">
            {isCheckingLink ? (
              <div className="grid place-items-center gap-3 py-8 text-center">
                <CompactLoader />
                <p className="mb-0">Checking your result link...</p>
              </div>
            ) : (
              <>
                <Label>
                  Email
                  <Input value={email} readOnly aria-readonly="true" />
                </Label>

                <Label>
                  Choose a password
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-input bg-card focus-within:border-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-border">
                    <input
                      className="min-h-[50px] min-w-0 bg-transparent px-4 font-medium text-foreground outline-none"
                      autoComplete="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="At least 8 characters"
                    />
                    <button
                      className="grid min-h-[50px] w-12 place-items-center text-muted-foreground hover:text-foreground"
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Label>

                <Label>
                  Confirm password
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-input bg-card focus-within:border-foreground focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-border">
                    <input
                      className="min-h-[50px] min-w-0 bg-transparent px-4 font-medium text-foreground outline-none"
                      autoComplete="new-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Same again"
                    />
                    <button
                      className="grid min-h-[50px] w-12 place-items-center text-muted-foreground hover:text-foreground"
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </Label>

                <Button className="min-h-[50px] w-full" onClick={submitPassword} disabled={isSubmitting || !hasResultAccess}>
                  <LockKeyhole size={18} />
                  {isSubmitting ? 'Unlocking...' : 'Set password and see my mirror'}
                </Button>

                <div className="flex flex-wrap justify-center gap-4 text-[0.88rem] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    Private by default
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Trash2 size={15} />
                    Delete anytime
                  </span>
                  <span>No ads</span>
                </div>

                {error && <InlineError className="mb-0 text-center">{error}</InlineError>}
              </>
            )}
          </div>
        </Surface>

        <Surface className="mx-auto grid w-[min(640px,100%)] gap-4 p-5" variant="muted">
          <span className="text-[0.78rem] uppercase tracking-[0.24em] text-subtle-foreground">
            Waiting behind this screen
          </span>
          <div>
            <span className="text-[0.78rem] uppercase tracking-[0.18em] text-subtle-foreground">
              Who you say you want
            </span>
            <div className="mt-2 grid gap-2 blur-[5px] select-none">
              <span className="h-4 w-5/6 rounded bg-border" />
              <span className="h-4 w-2/3 rounded bg-border" />
            </div>
          </div>
          <div className="h-px bg-border" />
          <div>
            <span className="text-[0.78rem] uppercase tracking-[0.18em] text-subtle-foreground">
              The gap
            </span>
            <div className="mt-2 grid gap-2 blur-[5px] select-none">
              <span className="h-4 w-3/4 rounded bg-border" />
              <span className="h-4 w-1/2 rounded bg-border" />
            </div>
          </div>
          <p className="mb-0 text-center text-[0.95rem]">Full mirror unlocks on the next screen</p>
        </Surface>
      </div>
    </FlowShell>
  );
}
