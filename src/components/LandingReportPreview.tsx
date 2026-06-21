import { Activity, ArrowRight, Brain, Flame, ShieldCheck, Target, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eyebrow, Pill } from '@/components/ui/pill';
import { ContentBand } from '@/components/ui/section';
import { dimensions } from '@/data/datingMirrorContent';
import dummyReportJson from '@/data/dummy-llm-report.json';
import type { DiagnosticReportSection, DimensionKey, MirrorReport } from '@/types/dating-mirror';

const dummyReport = dummyReportJson as MirrorReport;

interface MatrixPreviewItem {
  key: keyof MirrorReport['diagnostic_matrix'];
  label: string;
  icon: LucideIcon;
  section: DiagnosticReportSection;
}

function dimensionName(key: DimensionKey) {
  return dimensions.find((dimension) => dimension.key === key)?.name ?? key;
}

function EvidencePills({ dimensionKeys }: { dimensionKeys: DimensionKey[] }) {
  return (
    <div className="flex min-w-0 flex-wrap justify-end gap-1">
      {dimensionKeys.map((dimensionKey) => (
        <Pill
          className="max-w-full border-white/80 bg-white/78 px-2 py-0.5 text-center text-[0.64rem] leading-tight tracking-normal text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-12px_18px_rgba(232,62,140,0.07),0_10px_22px_rgba(17,17,17,0.12),0_2px_8px_rgba(232,62,140,0.12)] backdrop-blur-xl"
          key={dimensionKey}
        >
          {dimensionName(dimensionKey)}
        </Pill>
      ))}
    </div>
  );
}

function ScoreMeter({ score }: { score: number }) {
  const boundedScore = Math.min(10, Math.max(1, score));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-border" aria-label={`Score ${boundedScore} out of 10`}>
      <div className="h-full rounded-full bg-primary" style={{ width: `${boundedScore * 10}%` }} />
    </div>
  );
}

function AxisPreview({
  label,
  score,
  analysis,
  icon: Icon,
}: {
  label: string;
  score: number;
  analysis: string;
  icon: LucideIcon;
}) {
  const boundedScore = Math.min(10, Math.max(1, score));

  return (
    <article className="grid gap-2">
      <div className="flex items-start justify-between gap-3 text-foreground">
        <div className="flex items-center gap-2">
          <Icon size={18} />
          <h3 className="mb-0 text-[0.9rem] leading-[1.16]">{label}</h3>
        </div>
        <strong className="text-[1.28rem] leading-none text-foreground">{boundedScore}/10</strong>
      </div>
      <ScoreMeter score={boundedScore} />
      <p className="mb-0 text-[0.77rem] leading-[1.28]">{analysis}</p>
    </article>
  );
}

interface LandingReportPreviewProps {
  onStart: () => void;
}

export function LandingReportPreview({ onStart }: LandingReportPreviewProps) {
  const { shareable_card: shareableCard, diagnostic_matrix: diagnosticMatrix, friction_map: frictionMap } = dummyReport;
  const matrixItems: MatrixPreviewItem[] = [
    { key: 'facade', label: 'Facade', icon: ShieldCheck, section: diagnosticMatrix.facade },
    { key: 'guilty_pleasure', label: 'Guilty Pleasure', icon: Flame, section: diagnosticMatrix.guilty_pleasure },
    { key: 'blindspots', label: 'Blindspots', icon: Target, section: diagnosticMatrix.blindspots },
    { key: 'deep_void', label: 'Deep Void', icon: Brain, section: diagnosticMatrix.deep_void },
  ];

  return (
    <ContentBand
      className="grid content-center bg-[#fffaf6] py-[clamp(12px,2svh,24px)] max-[620px]:py-3"
      id="sample-report"
    >
      <article className="relative mx-auto grid h-[min(560px,calc(100svh-64px))] w-full grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] gap-[clamp(14px,2vw,24px)] overflow-hidden rounded-lg bg-white p-[clamp(14px,2.2vw,24px)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_8px_24px_rgba(17,17,17,0.035),0_1px_8px_rgba(232,62,140,0.03)] max-[980px]:h-[calc(100svh-64px)] max-[980px]:grid-cols-1">
        <div className="grid min-h-0 content-start gap-[clamp(14px,2.2svh,22px)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>Final report</Eyebrow>
            <Pill className="border-white/80 bg-white px-4 text-[0.86rem] tracking-normal text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-12px_18px_rgba(232,62,140,0.07),0_12px_30px_rgba(17,17,17,0.14),0_2px_8px_rgba(232,62,140,0.12)] backdrop-blur-xl">
              2 friend responses
            </Pill>
          </div>
          <div className="grid gap-3">
            <h2 className="mb-0 text-[clamp(2.35rem,4.45vw,4.35rem)] leading-[0.96] tracking-normal text-primary max-[620px]:text-[clamp(2.1rem,12vw,3.6rem)]">
              {shareableCard.archetype_title}
            </h2>
            <p className="mb-0 text-[clamp(1.08rem,1.75vw,1.35rem)] font-medium leading-[1.24] text-foreground">
              {shareableCard.tagline}
            </p>
            <p className="mb-0 text-[clamp(0.9rem,1.15vw,1rem)] leading-[1.45]">
              {shareableCard.core_conflict}
            </p>
          </div>

          <section className="grid gap-3">
            <h2 className="mb-0 text-[clamp(1.28rem,1.85vw,1.62rem)] leading-[1.08] text-foreground">
              What to practice next
            </h2>
            <div className="grid gap-2.5 rounded-lg bg-card p-3">
              {shareableCard.actionable_interventions.map((intervention, index) => (
                <article className="grid grid-cols-[auto_1fr] gap-2.5" key={intervention}>
                  <span className="grid size-7 place-items-center rounded-full bg-primary text-[0.78rem] font-medium text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="mb-0 text-[0.8rem] font-medium leading-[1.28] text-foreground">{intervention}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="grid min-h-0 grid-cols-[1.18fr_0.82fr] content-start gap-3 max-[900px]:grid-cols-1">
          <section className="grid min-h-0 content-start gap-2.5">
            <h2 className="mb-0 text-[clamp(1.28rem,1.85vw,1.62rem)] leading-[1.08] text-foreground">
              The four strongest reads
            </h2>
            <div className="grid gap-2.5 rounded-lg bg-card p-3">
              {matrixItems.map(({ key, label, icon: Icon, section }, index) => (
                <article className="grid gap-2.5" key={key}>
                  {index > 0 && <div className="h-px bg-primary" aria-hidden="true" />}
                  <div className="grid grid-cols-[auto_1fr] gap-2.5">
                    <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Icon size={14} />
                    </span>
                    <div className="grid gap-1.5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="mb-0 text-[0.9rem] leading-[1.14] text-foreground">{label}</h3>
                        <EvidencePills dimensionKeys={section.evidence_dimensions} />
                      </div>
                      <p className="mb-0 text-[0.76rem] leading-[1.25]">{section.insight}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid min-h-0 content-start gap-3">
            <section className="grid gap-2.5">
              <h2 className="mb-0 text-[clamp(1.28rem,1.85vw,1.62rem)] leading-[1.08] text-foreground">
                Dating fatigue patterns
              </h2>
              <div className="grid gap-3 rounded-lg bg-card p-3">
                <AxisPreview
                  label="Burnout fatigue"
                  score={frictionMap.burnout_axis.score}
                  analysis={frictionMap.burnout_axis.analysis}
                  icon={Flame}
                />
                <AxisPreview
                  label="Autonomy armor"
                  score={frictionMap.armor_axis.score}
                  analysis={frictionMap.armor_axis.analysis}
                  icon={Activity}
                />
              </div>
            </section>
          </div>
        </div>
        <Button
          className="absolute right-[clamp(14px,2.2vw,24px)] bottom-[clamp(14px,2.2vw,24px)] min-h-11 rounded-full px-6 text-[0.95rem] shadow-[0_16px_36px_rgba(232,62,140,0.26)]"
          onClick={onStart}
        >
          Show Mine
          <ArrowRight size={17} />
        </Button>
      </article>
    </ContentBand>
  );
}
