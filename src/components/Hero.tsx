import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section
      className="relative isolate grid min-h-[calc(100svh_-_132px)] w-full grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] items-start gap-[clamp(32px,6vw,96px)] overflow-hidden bg-[#050608] px-[clamp(24px,5vw,72px)] pb-12 before:absolute before:inset-0 before:-z-10 before:bg-black/35 before:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.7)_100%)] after:content-[''] max-[960px]:grid-cols-1 max-[620px]:min-h-auto max-[620px]:gap-7 max-[620px]:px-4 max-[620px]:pb-9"
      id="top"
    >
      <div className="w-[min(720px,100%)] self-start justify-self-start pt-[clamp(88px,13vh,136px)] text-left text-white max-[960px]:pt-12 max-[620px]:pt-7">
        <p className="mb-4 text-[0.86rem] font-medium uppercase tracking-normal text-white/75 max-[620px]:text-[0.78rem]">
          A cognitive psychology dating diagnostic
        </p>
        <h1 className="mb-5 max-w-[760px] text-[clamp(3.35rem,5vw,4.85rem)] leading-[0.98] tracking-normal text-white max-[960px]:text-[3.7rem] max-[620px]:text-[2.8rem]">
          Dating is not just your preference.{' '}
          <span className="text-white underline decoration-primary decoration-[0.08em] underline-offset-[0.12em]">
            It is your pattern.
          </span>
        </h1>
        <p className="mb-[26px] max-w-[690px] text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.6] text-white/80 max-[620px]:text-base">
          You know what you claim to want. Your friends know who you actually choose. Dating Mirror
          compares both before the pattern repeats.
        </p>
        <div className="flex flex-wrap items-center justify-start gap-3 max-[620px]:flex-col max-[620px]:items-stretch">
          <Button className="min-w-[min(100%,280px)] max-[620px]:w-full" onClick={onStart}>
            Start your mirror
            <ArrowRight size={18} />
          </Button>
          <Button
            asChild
            variant="secondaryPill"
            className="border-white/50 bg-white/90 max-[620px]:w-full"
          >
            <a href="#how-it-works">
              How it works
            </a>
          </Button>
        </div>
      </div>
      <div
        className="flex min-h-[clamp(420px,62vh,720px)] w-[min(100%,760px)] items-center justify-center justify-self-end max-[960px]:min-h-[360px] max-[960px]:w-[min(100%,620px)] max-[620px]:min-h-[280px] max-[620px]:w-full"
        aria-hidden="true"
      >
        <img
          className="aspect-[4/5] size-full object-cover object-center max-[620px]:aspect-[16/10]"
          src="/images/hero-mirror-mirage.png"
          alt=""
        />
      </div>
    </section>
  );
}
