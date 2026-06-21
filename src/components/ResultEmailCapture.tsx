import { useEffect, useState, type ReactNode } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InlineError } from '@/components/ui/flow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Surface } from '@/components/ui/surface';
import { cn } from '@/lib/utils';

interface ResultEmailCaptureProps {
  title: ReactNode;
  description: ReactNode;
  buttonLabel: string;
  savingLabel: string;
  trustText: ReactNode;
  initialEmail?: string | null;
  successMessage?: ReactNode;
  surface?: boolean;
  className?: string;
  onSubmit: (email: string) => Promise<unknown>;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ResultEmailCapture({
  title,
  description,
  buttonLabel,
  savingLabel,
  trustText,
  initialEmail,
  successMessage,
  surface = true,
  className,
  onSubmit,
}: ResultEmailCaptureProps) {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<ReactNode | null>(null);

  useEffect(() => {
    setEmail(initialEmail ?? '');
    setEmailError(null);
  }, [initialEmail]);

  const submitEmail = async () => {
    const nextEmail = email.trim().toLowerCase();
    if (!isValidEmail(nextEmail)) {
      setEmailError('Enter a valid email address.');
      setSavedMessage(null);
      return;
    }

    setIsSaving(true);
    setEmailError(null);
    setSavedMessage(null);
    try {
      await onSubmit(nextEmail);
      setEmail(nextEmail);
      setSavedMessage(successMessage ?? null);
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'We could not hold that email. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const content = (
    <>
      <div>
        <h3 className="mb-1 text-[clamp(1.2rem,2vw,1.45rem)] leading-[1.18] text-foreground">
          {title}
        </h3>
        <p className="mb-0">{description}</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 max-[720px]:grid-cols-1">
        <Label>
          Email
          <Input
            autoComplete="email"
            inputMode="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSavedMessage(null);
            }}
            placeholder="you@example.com"
          />
        </Label>
        <Button className="min-h-[50px] px-6 text-white max-[720px]:w-full" onClick={submitEmail} disabled={isSaving}>
          <Send size={18} />
          {isSaving ? savingLabel : buttonLabel}
        </Button>
      </div>
      <p className="mb-0 inline-flex items-center gap-2 text-[0.94rem]">
        <ShieldCheck size={16} />
        {trustText}
      </p>
      {savedMessage && (
        <p className="mb-0 text-[0.94rem] font-medium text-primary" role="status">
          {savedMessage}
        </p>
      )}
      {emailError && <InlineError className="mb-0">{emailError}</InlineError>}
    </>
  );

  if (!surface) {
    return <section className={cn('grid gap-4', className)}>{content}</section>;
  }

  return (
    <Surface className={cn('grid gap-4 p-[clamp(18px,2.5vw,26px)]', className)} variant="muted">
      {content}
    </Surface>
  );
}
