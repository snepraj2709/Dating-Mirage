import { LockKeyhole, ShieldCheck, Trash2 } from 'lucide-react';

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
    <section className="content-band privacy-section" id="privacy">
      <div className="section-heading centered-heading">
        <p className="eyebrow">Privacy and boundaries</p>
        <h2>The mirror stays behavioral, scoped, and removable.</h2>
      </div>

      <div className="privacy-strip">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="trust-item">
              <Icon size={22} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="faq-list">
        <article>
          <h3>What is the Deep Void and why is it not scored?</h3>
          <p>
            It represents the deeper unconscious layer that surface behavior and friend feedback cannot
            reliably measure. Dating Mirror leaves it out instead of pretending to diagnose it.
          </p>
        </article>
        <article>
          <h3>Can friends identify themselves in the final report?</h3>
          <p>
            No. The report uses aggregate friend signal. You see pattern direction and response count, not
            who gave a specific answer.
          </p>
        </article>
      </div>
    </section>
  );
}
