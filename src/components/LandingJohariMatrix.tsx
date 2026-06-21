import { Eyebrow } from '@/components/ui/pill';
import { ContentBand } from '@/components/ui/section';

type MatrixKey = 'guilty-pleasure' | 'true-blindspot' | 'facade' | 'deep-void';

const matrixItems = [
  {
    key: 'facade',
    title: 'The Facade',
    copy: 'You know where you are settling, reacting, or over-accommodating, but the pattern is hidden from friends for some reason.',
    placement:
      'left-[7%] top-[12%] max-w-[min(34%,330px)] max-[720px]:left-[5%] max-[720px]:top-[10%] max-[720px]:max-w-[38%] max-[520px]:left-[4%] max-[520px]:top-[9%] max-[520px]:max-w-[40%]',
  },
  {
    key: 'guilty-pleasure',
    title: 'The Guilty Pleasure',
    copy: 'You and your friends both know you do this, but you hate that you do it." (e.g., High Intensity, Low Consistency).',
    placement:
      'right-[7%] top-[16%] max-w-[min(34%,330px)] max-[720px]:right-[5%] max-[720px]:top-[12%] max-[720px]:max-w-[38%] max-[520px]:right-[4%] max-[520px]:top-[10%] max-[520px]:max-w-[40%]',
  },
  {
    key: 'deep-void',
    title: 'The Deep Void',
    copy: 'A deeper psychological layer that neither you nor your friends can reliably observe through surface behavior.',
    placement:
      'left-[7%] bottom-[14%] max-w-[min(34%,330px)] max-[720px]:left-[5%] max-[720px]:bottom-[11%] max-[720px]:max-w-[38%] max-[520px]:left-[4%] max-[520px]:bottom-[9%] max-[520px]:max-w-[40%]',
  },
  {
    key: 'true-blindspot',
    title: 'The True Blind Spot',
    copy: 'You believe your choices are aligned with your standards, but your social Dating Mirrors a different pattern.',
    placement:
      'right-[7%] bottom-[12%] max-w-[min(36%,350px)] max-[720px]:right-[5%] max-[720px]:bottom-[10%] max-[720px]:max-w-[39%] max-[520px]:right-[4%] max-[520px]:bottom-[8%] max-[520px]:max-w-[41%]',
  },
] satisfies Array<{
  key: MatrixKey;
  title: string;
  copy: string;
  placement: string;
}>;

export function LandingJohariMatrix() {
  return (
    <ContentBand className="grid content-center gap-5 bg-[#fffaf6] py-[clamp(30px,5svh,52px)] max-[620px]:gap-3 max-[620px]:py-4" id="matrix-breakdown">
      <div className="mx-auto grid max-w-[760px] justify-items-center gap-2 text-center">
        <Eyebrow>Dating Matrix</Eyebrow>
        <h2 className="mb-0 text-[clamp(1.65rem,3.2vw,2.5rem)] leading-[1.08] tracking-normal text-foreground max-[620px]:text-[clamp(1.35rem,7vw,1.8rem)]">
          What you know <span className="text-primary">Vs</span>{' '}
          <span className="underline decoration-primary decoration-[0.08em] underline-offset-[0.12em]">
            What others can see
          </span>
          .
        </h2>
      </div>

      <div
        className="relative mx-auto h-[min(56svh,560px)] min-h-[420px] w-full max-w-[1120px] overflow-hidden rounded-lg bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_18px_60px_rgba(17,17,17,0.08),0_4px_18px_rgba(232,62,140,0.08)] max-[720px]:min-h-[500px] max-[620px]:h-[calc(100svh-270px)] max-[620px]:min-h-[430px]"
        aria-label="Dating matrix showing visibility to you and visibility to friends"
      >
        <div className="absolute left-[7%] right-[7%] top-1/2 h-px -translate-y-1/2 bg-foreground max-[520px]:left-[5%] max-[520px]:right-[5%]" aria-hidden="true" />
        <div className="absolute right-[7%] top-1/2 size-4 -translate-y-1/2 rotate-45 border-r-[3px] border-t-[3px] border-foreground max-[520px]:right-[5%]" aria-hidden="true" />
        <div className="absolute bottom-[9%] left-1/2 top-[10%] w-px -translate-x-1/2 bg-foreground max-[520px]:bottom-[8%] max-[520px]:top-[9%]" aria-hidden="true" />
        <div className="absolute left-1/2 top-[10%] size-4 -translate-x-1/2 -rotate-45 border-r-[3px] border-t-[3px] border-foreground max-[520px]:top-[9%]" aria-hidden="true" />

        <span className="absolute left-1/2 top-4 -translate-x-1/2 text-center text-[clamp(0.84rem,1.8vw,1.05rem)] leading-[1.1] text-foreground max-[520px]:top-3">
          Visible to You
        </span>
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-[clamp(0.84rem,1.8vw,1.05rem)] leading-[1.1] text-foreground max-[520px]:bottom-3">
          Invisible to you
        </span>
        <span className="absolute left-4 top-[calc(50%+18px)] text-[clamp(0.84rem,1.8vw,1.05rem)] leading-[1.1] text-foreground max-[720px]:left-3 max-[520px]:top-[calc(50%+14px)] max-[520px]:max-w-[88px]">
          Invisible to Friends
        </span>
        <span className="absolute right-4 top-[calc(50%+18px)] text-right text-[clamp(0.84rem,1.8vw,1.05rem)] leading-[1.1] text-foreground max-[720px]:right-3 max-[520px]:top-[calc(50%+14px)] max-[520px]:max-w-[82px]">
          Visible to Friends
        </span>

        {matrixItems.map((item) => (
          <article className={`absolute grid gap-2 text-foreground ${item.placement}`} key={item.key}>
            <h3 className="mb-0 text-[clamp(0.95rem,2vw,1.35rem)] leading-[1.05] tracking-normal max-[620px]:text-[clamp(0.82rem,3.3vw,1rem)]">
              {item.title}
            </h3>
            <p className="mb-0 text-[clamp(0.8rem,1.55vw,1rem)] leading-[1.38] text-muted-foreground max-[620px]:text-[clamp(0.68rem,2.75vw,0.84rem)] max-[620px]:leading-[1.28]">
              {item.copy}
            </p>
          </article>
        ))}
      </div>
    </ContentBand>
  );
}
