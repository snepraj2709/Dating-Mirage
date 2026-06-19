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
    <section className="privacy-strip" id="privacy">
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
    </section>
  );
}

