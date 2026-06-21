import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { Eyebrow } from '@/components/ui/pill';
import { ContentBand } from '@/components/ui/section';

type MatrixKey = 'guilty-pleasure' | 'true-blindspot' | 'facade' | 'deep-void';

const matrixItems = [
  {
    key: 'facade',
    title: 'The Facade',
    copy: 'You know where you are settling or over-accommodating, but pretend otherwise to your friends.',
    placement: 'col-start-1 row-start-1',
  },
  {
    key: 'guilty-pleasure',
    title: 'Guilty Pleasure',
    copy: 'You know you hate it but you still do it, and your friends also know you do this',
    placement: 'col-start-2 row-start-1',
  },
  {
    key: 'deep-void',
    title: 'The Deep Void',
    copy: 'A deeper psychological layer that neither you nor your friends can reliably observe through surface behavior.',
    placement: 'col-start-1 row-start-2',
  },
  {
    key: 'true-blindspot',
    title: 'Blind Spot',
    copy: 'You believe your choices align with your standards, but your friends see a different pattern.',
    placement: 'col-start-2 row-start-2',
  },
] satisfies Array<{
  key: MatrixKey;
  title: string;
  copy: string;
  placement: string;
}>;

export function LandingJohariMatrix() {
  const axisIconClassName = 'size-[18px] text-[#d8d8df] max-[620px]:size-[14px]';
  const axisLabelClassName =
    'inline-flex items-center gap-2 text-[0.76rem] font-medium uppercase leading-none tracking-normal text-[#a3a3ad] max-[620px]:gap-1.5 max-[620px]:text-[0.58rem]';

  return (
    <ContentBand
      className="grid content-center gap-[clamp(22px,4svh,40px)] bg-[#fffaf6] py-[clamp(30px,5svh,52px)] max-[620px]:gap-4 max-[620px]:py-4"
      id="matrix-breakdown"
    >
      <div className="mx-auto grid max-w-[1120px] justify-items-center gap-2 text-center">
        <Eyebrow className="mb-2 text-[#9b9aa2]">Dating Matrix</Eyebrow>
        <h2 className="mb-0 text-[clamp(2rem,4vw,3.65rem)] leading-[0.98] tracking-normal text-foreground max-[620px]:text-[clamp(1.55rem,7vw,2rem)]">
          What you know <span className="text-primary">Vs</span>{' '}
          <span className="underline decoration-primary decoration-[0.08em] underline-offset-[0.12em]">
            What others can see
          </span>
          .
        </h2>
      </div>

      <div
        className="relative mx-auto h-[min(58svh,590px)] min-h-[500px] w-full max-w-[1120px] overflow-hidden rounded-lg bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_18px_60px_rgba(17,17,17,0.08),0_4px_18px_rgba(232,62,140,0.08)] max-[820px]:min-h-[500px] max-[620px]:h-[calc(100svh-244px)] max-[620px]:min-h-[420px]"
        aria-label="Dating matrix showing visibility to you and visibility to friends"
      >
        <div className="absolute left-[5%] right-[5%] top-1/2 h-px -translate-y-1/2 bg-[#e8e8ed] max-[620px]:left-[6%] max-[620px]:right-[6%]" aria-hidden="true" />
        <div className="absolute bottom-[7%] left-1/2 top-[7%] w-px -translate-x-1/2 bg-[#e8e8ed] max-[620px]:bottom-[8%] max-[620px]:top-[8%]" aria-hidden="true" />

        <ChevronLeft
          className="absolute left-[5%] top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 text-[#dedee5] max-[620px]:left-[6%] max-[620px]:size-4"
          strokeWidth={1.3}
          aria-hidden="true"
        />
        <ChevronRight
          className="absolute right-[5%] top-1/2 size-5 -translate-y-1/2 translate-x-1/2 text-[#dedee5] max-[620px]:right-[6%] max-[620px]:size-4"
          strokeWidth={1.3}
          aria-hidden="true"
        />
        <ChevronUp
          className="absolute left-1/2 top-[7%] size-5 -translate-x-1/2 -translate-y-1/2 text-[#dedee5] max-[620px]:top-[8%] max-[620px]:size-4"
          strokeWidth={1.3}
          aria-hidden="true"
        />
        <ChevronDown
          className="absolute bottom-[7%] left-1/2 size-5 -translate-x-1/2 translate-y-1/2 text-[#dedee5] max-[620px]:bottom-[8%] max-[620px]:size-4"
          strokeWidth={1.3}
          aria-hidden="true"
        />

        <span className={`${axisLabelClassName} absolute left-[calc(50%+18px)] top-[7%] -translate-y-1/2 max-[620px]:left-[calc(50%+12px)]`}>
          <Eye className={axisIconClassName} strokeWidth={1.8} aria-hidden="true" />
          Known to You
        </span>
        <span className={`${axisLabelClassName} absolute bottom-[7%] left-[calc(50%+18px)] translate-y-1/2 max-[620px]:bottom-[8%] max-[620px]:left-[calc(50%+12px)]`}>
          <EyeOff className={axisIconClassName} strokeWidth={1.8} aria-hidden="true" />
          Hidden from You
        </span>
        <span className={`${axisLabelClassName} absolute left-[5%] top-[calc(50%-24px)] max-[620px]:left-[6%] max-[620px]:top-[calc(50%-18px)]`}>
          <EyeOff className={axisIconClassName} strokeWidth={1.8} aria-hidden="true" />
          Hidden from Friends
        </span>
        <span className={`${axisLabelClassName} absolute right-[5%] top-[calc(50%-24px)] max-[620px]:right-[6%] max-[620px]:top-[calc(50%-18px)]`}>
          <Eye className={axisIconClassName} strokeWidth={1.8} aria-hidden="true" />
          Visible to Friends
        </span>

        <div className="absolute inset-x-[8%] inset-y-[12%] grid grid-cols-2 grid-rows-2 max-[620px]:inset-x-[8%] max-[620px]:inset-y-[14%]">
          {matrixItems.map((item) => (
            <article
              className={`grid content-center grid-rows-[auto_minmax(4.4em,auto)] justify-items-center gap-4 px-[clamp(12px,3vw,48px)] text-center text-foreground max-[620px]:grid-rows-[auto_minmax(5.2em,auto)] max-[620px]:gap-2 max-[620px]:px-2 ${item.placement}`}
              key={item.key}
            >
              <h3 className="mb-0 max-w-[390px] text-[clamp(1.65rem,3vw,2.55rem)] font-light leading-[1.03] tracking-normal max-[620px]:text-[clamp(0.98rem,4.2vw,1.25rem)]">
                {item.title}
              </h3>
              <p className="mb-0 max-w-[360px] text-[clamp(0.9rem,1.55vw,1.08rem)] leading-[1.45] text-muted-foreground max-[620px]:text-[clamp(0.66rem,2.75vw,0.82rem)] max-[620px]:leading-[1.32]">
                {item.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </ContentBand>
  );
}
