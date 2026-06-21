import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section
      className="landing-section relative isolate bg-[#050608] before:absolute before:inset-0 before:-z-10 before:bg-black/35 before:content-[''] after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.7)_100%)] after:content-['']"
      id="top"
    >
      <div className="landing-container grid min-h-[100svh] grid-cols-[minmax(0,0.9fr)_minmax(300px,0.82fr)] items-center gap-[clamp(24px,4vw,48px)] pt-[88px] pb-[clamp(24px,5svh,52px)] max-[960px]:grid-cols-1 max-[960px]:content-start max-[960px]:items-start max-[620px]:gap-4 max-[620px]:pt-[76px] max-[620px]:pb-5">
        <div className="w-[min(620px,100%)] text-left text-white">
          <h1 className="mb-4 max-w-[700px] text-[clamp(3rem,5vw,4.35rem)] leading-[0.98] tracking-normal text-white max-[960px]:text-[3.25rem] max-[620px]:text-[clamp(2.05rem,9vw,2.55rem)]">
            Dating is not just your preference.{' '}
            <span className="text-white underline decoration-primary decoration-[0.08em] underline-offset-[0.12em]">
              It is your pattern.
            </span>
          </h1>
          <p className="mb-5 max-w-[620px] text-[clamp(1rem,1.6vw,1.16rem)] leading-[1.55] text-white/80 max-[620px]:mb-4 max-[620px]:text-[0.95rem] max-[620px]:leading-[1.45]">
            You know how your Ideal partner should be and who you actually date. 
            The gap between the two causes friction. Dating Mirage shows your blindspots and facade.
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
          className="flex h-[min(56svh,520px)] min-h-[340px] w-full items-center justify-center justify-self-end max-[960px]:h-[min(34svh,300px)] max-[960px]:min-h-[230px] max-[960px]:justify-self-start max-[620px]:h-[min(24svh,170px)] max-[620px]:min-h-[150px]"
          aria-hidden="true"
        >
          <img
            className="aspect-[4/5] size-full object-cover object-center max-[620px]:aspect-[16/10]"
            src="/images/hero-mirror-mirage.png"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
