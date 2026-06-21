import {
  Activity,
  ArrowLeft,
  Brain,
  Flame,
  ShieldCheck,
  Target,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Eyebrow, Pill } from '@/components/ui/pill';
import { Surface } from '@/components/ui/surface';
import { dimensions } from '@/data/datingMirrorContent';
import type { DiagnosticReportSection, DimensionKey, MirrorReport, UserSession } from '@/types/dating-mirror';

interface FinalReportProps {
  report: MirrorReport;
  session: UserSession;
  onBack: () => void;
  onBurnData: () => void;
}

interface MatrixItem {
  key: keyof MirrorReport['diagnostic_matrix'];
  label: string;
  icon: LucideIcon;
  section: DiagnosticReportSection;
}

function dimensionName(key: DimensionKey) {
  return dimensions.find((dimension) => dimension.key === key)?.name ?? key;
}

function EvidencePills({ dimensions: evidenceDimensions }: { dimensions: DimensionKey[] }) {
  return (
    <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
      {evidenceDimensions.map((dimension) => (
        <Pill
          className="max-w-full border-white/80 bg-white/78 px-3.5 py-1.5 text-center text-[0.82rem] leading-tight tracking-normal text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-12px_18px_rgba(232,62,140,0.07),0_12px_30px_rgba(17,17,17,0.14),0_2px_8px_rgba(232,62,140,0.12)] backdrop-blur-xl"
          key={dimension}
        >
          {dimensionName(dimension)}
        </Pill>
      ))}
    </div>
  );
}

function ScoreMeter({ score }: { score: number }) {
  const boundedScore = Math.min(10, Math.max(1, score));

  return (
    <div className="grid gap-2" aria-label={`Score ${boundedScore} out of 10`}>
      <div className="h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${boundedScore * 10}%` }} />
      </div>
    </div>
  );
}

export function FinalReport({ report, session, onBack, onBurnData }: FinalReportProps) {
  const { shareable_card: shareableCard, diagnostic_matrix: diagnosticMatrix, friction_map: frictionMap } = report;
  const matrixItems: MatrixItem[] = [
    { key: 'facade', label: 'Facade', icon: ShieldCheck, section: diagnosticMatrix.facade },
    { key: 'guilty_pleasure', label: 'Guilty Pleasure', icon: Flame, section: diagnosticMatrix.guilty_pleasure },
    { key: 'blindspots', label: 'Blindspots', icon: Target, section: diagnosticMatrix.blindspots },
    { key: 'deep_void', label: 'Deep Void', icon: Brain, section: diagnosticMatrix.deep_void },
  ];

  return (
    <main className="mx-auto grid min-h-screen w-[min(1120px,calc(100%_-_32px))] gap-5 py-5 pb-12 max-[620px]:w-[min(100%_-_24px,520px)]">
      <div className="flex min-h-10 items-center justify-between gap-4">
        <Button variant="ghostPill" size="compact" onClick={onBack}>
          <ArrowLeft size={18} />
          Back
        </Button>
        <Button variant="dangerGhost" size="compact" onClick={onBurnData}>
          <Trash2 size={17} />
          Burn My Data
        </Button>
      </div>

      <Surface asChild className="grid gap-[clamp(28px,4vw,44px)] bg-[#fff4f9]" variant="muted">
        <section>
          <article className="grid gap-[clamp(18px,3vw,28px)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Eyebrow>Final report</Eyebrow>
              <Pill className="border-white/80 bg-white px-4 text-[0.86rem] tracking-normal text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),inset_0_-12px_18px_rgba(232,62,140,0.07),0_12px_30px_rgba(17,17,17,0.14),0_2px_8px_rgba(232,62,140,0.12)] backdrop-blur-xl">
                {session.friendCount} friend responses
              </Pill>
            </div>
            <div className="grid max-w-[840px] gap-4">
              <h1 className="mb-0 text-[clamp(2.35rem,5vw,5rem)] leading-[0.98] tracking-normal text-primary">
                {shareableCard.archetype_title}
              </h1>
              <p className="mb-0 text-[clamp(1.2rem,2.2vw,1.7rem)] font-medium leading-[1.24] text-foreground">
                {shareableCard.tagline}
              </p>
              <p className="mb-0 max-w-[760px] text-[clamp(1rem,1.45vw,1.14rem)] leading-[1.52]">
                {shareableCard.core_conflict}
              </p>
            </div>
          </article>

          <div className="grid grid-cols-[1.05fr_0.95fr] gap-5 max-[900px]:grid-cols-1">
            <section className="grid content-start gap-4">
              <div>
                {/* <Eyebrow>Diagnostic matrix</Eyebrow> */}
                <h2 className="mb-0 text-[clamp(1.5rem,2.5vw,2.1rem)] leading-[1.08] text-foreground">
                  The four strongest reads
                </h2>
              </div>
                <div className="grid gap-4 rounded-lg bg-card p-4">
                  {matrixItems.map(({ key, label, icon: Icon, section }, index) => (
                    <article className="grid gap-4" key={key}>
                      {index > 0 && <div className="h-px bg-primary" aria-hidden="true" />}
                      <div className="grid grid-cols-[auto_1fr] gap-4 py-1.5">
                        <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Icon size={19} />
                        </span>
                        <div className="grid gap-3">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="mb-0 text-[1.08rem] leading-[1.18] text-foreground">{label}</h3>
                            <EvidencePills dimensions={section.evidence_dimensions} />
                          </div>
                          <p className="mb-0 leading-[1.45]">{section.insight}</p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

            <div className="grid content-start gap-5">
              <section className="grid gap-4">
                <div>
                  {/* <Eyebrow>Actionable interventions</Eyebrow> */}
                  <h2 className="mb-0 text-[clamp(1.5rem,2.5vw,2.1rem)] leading-[1.08] text-foreground">
                    What to practice next
                  </h2>
                </div>
                <div className="grid gap-4 rounded-lg bg-card p-4">
                  {shareableCard.actionable_interventions.map((intervention, index) => (
                    <article className="grid grid-cols-[auto_1fr] gap-3" key={intervention}>
                      <span className="grid size-9 place-items-center rounded-full bg-primary text-[0.95rem] font-medium text-primary-foreground">
                        {index + 1}
                      </span>
                      <p className="mb-0 text-[1rem] font-medium leading-[1.42] text-foreground">{intervention}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="grid gap-4">
                <div>
                  {/* <Eyebrow>Friction map</Eyebrow> */}
                  <h2 className="mb-0 text-[clamp(1.5rem,2.5vw,2.1rem)] leading-[1.08] text-foreground">
                    Dating fatigue patterns
                  </h2>
                </div>
                <div className="grid gap-5 rounded-lg bg-card p-4">
                  <article className="grid gap-3">
                    <div className="flex items-start justify-between gap-3 text-foreground">
                      <div className="flex items-center gap-2">
                        <Flame size={19} />
                        <h3 className="mb-0 text-[1.08rem] leading-[1.18]">Burnout fatigue</h3>
                      </div>
                      <strong className="text-[1.6rem] leading-none text-foreground">
                        {Math.min(10, Math.max(1, frictionMap.burnout_axis.score))}/10
                      </strong>
                    </div>
                    <ScoreMeter score={frictionMap.burnout_axis.score} />
                    <p className="mb-0 leading-[1.45]">{frictionMap.burnout_axis.analysis}</p>
                  </article>
                  <article className="grid gap-3">
                    <div className="flex items-start justify-between gap-3 text-foreground">
                      <div className="flex items-center gap-2">
                        <Activity size={19} />
                        <h3 className="mb-0 text-[1.08rem] leading-[1.18]">Autonomy armor</h3>
                      </div>
                      <strong className="text-[1.6rem] leading-none text-foreground">
                        {Math.min(10, Math.max(1, frictionMap.armor_axis.score))}/10
                      </strong>
                    </div>
                    <ScoreMeter score={frictionMap.armor_axis.score} />
                    <p className="mb-0 leading-[1.45]">{frictionMap.armor_axis.analysis}</p>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>
      </Surface>
    </main>
  );
}
