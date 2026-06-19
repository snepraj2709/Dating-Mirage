import { LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react';
import { ContentBand, SectionHeading } from '@/components/ui/section';
import { Surface } from '@/components/ui/surface';

const trustItems = [
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
];

export function PrivacyStrip() {
  return (
    <ContentBand className="pt-[72px]" id="privacy">
      <SectionHeading
        centered
        eyebrow="Privacy and boundaries"
        title="The mirror stays behavioral, scoped, and removable."
      />

      <div className="grid grid-cols-3 gap-3.5 max-[960px]:grid-cols-1">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <Surface asChild className="grid min-h-[136px] grid-cols-[auto_1fr] gap-3.5 p-5 text-foreground" key={item.title}>
              <article>
              <Icon size={22} />
              <div>
                <h3 className="mb-2.5 text-xl leading-[1.2] text-foreground">{item.title}</h3>
                <p className="mb-0 text-[0.95rem]">{item.copy}</p>
              </div>
              </article>
            </Surface>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3.5 max-[960px]:grid-cols-1">
        <Surface asChild className="p-[22px]">
          <article>
          <h3 className="mb-0 text-xl leading-[1.2] text-foreground">What is the Deep Void and why is it not scored?</h3>
          <p className="mb-0">
            It represents the deeper unconscious layer that surface behavior and friend feedback cannot
            reliably measure. Dating Mirror leaves it out instead of pretending to diagnose it.
          </p>
          </article>
        </Surface>
        <Surface asChild className="p-[22px]">
          <article>
          <h3 className="mb-0 text-xl leading-[1.2] text-foreground">Can friends identify themselves in the final report?</h3>
          <p className="mb-0">
            No. The report uses aggregate friend signal. You see pattern direction and response count, not
            who gave a specific answer.
          </p>
          </article>
        </Surface>
      </div>
    </ContentBand>
  );
}
