import { Info, LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react';
import { ContentBand, SectionHeading } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';

const privacyItems = [
  {
    icon: ShieldCheck,
    title: 'Friends stay anonymous',
    copy: 'You see the count and the aggregate pattern, not who said what.',
  },
  {
    icon: LockKeyhole,
    title: 'Reports are gated',
    copy: 'Friends cannot open your final read unless you send them the card.',
  },
  {
    icon: Trash2,
    title: 'Burn My Data',
    copy: 'A one-tap delete clears your profile, feedback, reports, and assets.',
  },
  {
    icon: Info,
    title: 'Deep Void is not scored',
    copy: 'The app avoids diagnosing what behavior and friend feedback cannot reliably measure.',
  },
  {
    icon: LockKeyhole,
    title: 'No named friend answers',
    copy: 'The final report shows aggregate direction and response count, not who said what.',
  },
];

export function PrivacyStrip() {
  return (
    <ContentBand
      className="grid content-center gap-5 py-[clamp(34px,6svh,56px)] max-[620px]:content-start max-[620px]:gap-4 max-[620px]:py-5"
      id="privacy"
    >
      <SectionHeading
        centered
        className="mb-0 max-w-none [&_h2]:text-[clamp(1.55rem,2.7vw,2.2rem)] max-[620px]:[&_h2]:text-[1.42rem] max-[620px]:[&_p]:text-[0.88rem] lg:[&_h2]:whitespace-nowrap"
        eyebrow="Privacy and boundaries"
        title="The mirror stays behavioral, scoped, and removable."
        description={<>Built for trust. Your data is yours &mdash; always.</>}
      />

      <div
        className="mobile-snap-row grid grid-cols-5 gap-3 max-[960px]:grid-cols-3 max-[620px]:grid-cols-none"
        aria-label="Privacy principles"
        tabIndex={0}
      >
        {privacyItems.map((item) => {
          const Icon = item.icon;
          return (
            <Surface
              asChild
              className="mobile-snap-item grid min-h-[176px] content-start gap-3 p-4 text-foreground max-[620px]:min-h-[230px] max-[620px]:w-[min(82vw,312px)]"
              key={item.title}
            >
              <article tabIndex={0}>
                <Icon size={20} />
                <div>
                  <h3 className="mb-2 text-[1rem] leading-[1.2] text-foreground">{item.title}</h3>
                  <p className="mb-0 text-[0.84rem] leading-[1.42]">{item.copy}</p>
                </div>
              </article>
            </Surface>
          );
        })}
      </div>
    </ContentBand>
  );
}
