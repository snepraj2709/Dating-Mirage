import { useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Brain,
  Download,
  Flame,
  Share2,
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

const storyWidth = 1080;
const storyHeight = 1920;
const storyPink = '#e83e8c';
const storyText = '#111111';
const storyMuted = '#666666';
const storyBg = '#fff4f9';

function dimensionName(key: DimensionKey) {
  return dimensions.find((dimension) => dimension.key === key)?.name ?? key;
}

function roundedRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const boundedRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + boundedRadius, y);
  context.lineTo(x + width - boundedRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + boundedRadius);
  context.lineTo(x + width, y + height - boundedRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - boundedRadius, y + height);
  context.lineTo(x + boundedRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - boundedRadius);
  context.lineTo(x, y + boundedRadius);
  context.quadraticCurveTo(x, y, x + boundedRadius, y);
  context.closePath();
}

function fillRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string,
) {
  roundedRectPath(context, x, y, width, height, radius);
  context.fillStyle = fillStyle;
  context.fill();
}

function getWrappedLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines = Number.POSITIVE_INFINITY,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';
  let truncated = false;

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      lines.push(word);
      currentLine = '';
    }

    if (lines.length >= maxLines) {
      truncated = true;
      break;
    }
  }

  if (!truncated && currentLine) {
    lines.push(currentLine);
  }

  if (lines.length > maxLines) {
    lines.length = maxLines;
    truncated = true;
  }

  if (truncated && lines.length > 0) {
    let lastLine = lines[lines.length - 1];
    while (lastLine.length > 0 && context.measureText(`${lastLine}...`).width > maxWidth) {
      lastLine = lastLine.slice(0, lastLine.lastIndexOf(' '));
    }
    lines[lines.length - 1] = `${lastLine || lines[lines.length - 1].slice(0, 16)}...`;
  }

  return lines;
}

function drawWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines?: number,
) {
  const lines = getWrappedLines(context, text, maxWidth, maxLines);
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function drawStoryPill(context: CanvasRenderingContext2D, text: string, x: number, y: number) {
  context.font = '600 30px Arial, sans-serif';
  const width = context.measureText(text).width + 48;
  fillRoundedRect(context, x, y, width, 62, 31, '#ffffff');
  context.fillStyle = storyPink;
  context.fillText(text, x + 24, y + 41);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 400);
}

function storyFileName(title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48);

  return `dating-mirror-${slug || 'report'}-story.png`;
}

async function createStoryImageBlob(report: MirrorReport, session: UserSession) {
  const canvas = document.createElement('canvas');
  canvas.width = storyWidth;
  canvas.height = storyHeight;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas is not supported in this browser.');
  }

  const { shareable_card: shareableCard, diagnostic_matrix: diagnosticMatrix } = report;
  const strongestReads = [
    ['Facade', diagnosticMatrix.facade],
    ['Guilty Pleasure', diagnosticMatrix.guilty_pleasure],
    ['Blindspots', diagnosticMatrix.blindspots],
    ['Deep Void', diagnosticMatrix.deep_void],
  ] as Array<[string, DiagnosticReportSection]>;

  context.fillStyle = storyBg;
  context.fillRect(0, 0, storyWidth, storyHeight);
  fillRoundedRect(context, 64, 64, storyWidth - 128, storyHeight - 128, 54, '#ffffff');

  context.fillStyle = storyMuted;
  context.font = '700 34px Arial, sans-serif';
  context.fillText('DATING MIRROR', 116, 150);
  drawStoryPill(context, `${session.friendCount} friend responses`, 656, 106);

  let y = 280;
  context.fillStyle = storyPink;
  context.font = '700 92px Arial, sans-serif';
  y = drawWrappedText(context, shareableCard.archetype_title, 116, y, 848, 104, 3) + 26;

  context.fillStyle = storyText;
  context.font = '700 46px Arial, sans-serif';
  y = drawWrappedText(context, shareableCard.tagline, 116, y, 848, 58, 2) + 28;

  context.fillStyle = storyMuted;
  context.font = '500 34px Arial, sans-serif';
  y = drawWrappedText(context, shareableCard.core_conflict, 116, y, 848, 48, 4) + 54;

  fillRoundedRect(context, 116, y, 848, 850, 34, storyBg);
  context.fillStyle = storyText;
  context.font = '700 40px Arial, sans-serif';
  context.fillText('The strongest reads', 156, y + 76);

  strongestReads.forEach(([label, section], index) => {
    const readX = 156;
    const readY = y + 122 + index * 166;
    fillRoundedRect(context, readX, readY, 768, 132, 28, '#ffffff');
    context.fillStyle = storyPink;
    context.font = '700 28px Arial, sans-serif';
    context.fillText(`${index + 1}`, readX + 30, readY + 52);
    context.fillStyle = storyText;
    context.font = '700 32px Arial, sans-serif';
    context.fillText(label, readX + 82, readY + 48);
    context.fillStyle = storyMuted;
    context.font = '500 22px Arial, sans-serif';
    const evidence = section.evidence_dimensions.map(dimensionName).join(' + ');
    drawWrappedText(context, evidence, readX + 82, readY + 82, 620, 28, 1);
    context.font = '500 24px Arial, sans-serif';
    drawWrappedText(context, section.insight, readX + 82, readY + 114, 620, 32, 1);
  });

  context.fillStyle = storyPink;
  context.font = '700 34px Arial, sans-serif';
  context.fillText('Build your Dating Mirror', 116, storyHeight - 170);
  context.fillStyle = storyMuted;
  context.font = '500 28px Arial, sans-serif';
  context.fillText('Private by default. Friend-powered perspective.', 116, storyHeight - 122);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Could not create story image.'));
      }
    }, 'image/png');
  });
}

function EvidencePills({ dimensions: evidenceDimensions }: { dimensions: DimensionKey[] }) {
  return (
    <div className="flex min-w-0 flex-wrap justify-end gap-1.5">
      {evidenceDimensions.map((dimension) => (
        <Pill
          className="max-w-full border-border/70 bg-muted/70 px-3.5 py-1.5 text-center text-[0.82rem] leading-tight tracking-normal text-muted-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_12px_30px_rgba(17,17,17,0.08)] backdrop-blur-xl"
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
  const [storyAction, setStoryAction] = useState<'share' | 'download' | null>(null);
  const [storyMessage, setStoryMessage] = useState<string | null>(null);
  const { shareable_card: shareableCard, diagnostic_matrix: diagnosticMatrix, friction_map: frictionMap } = report;
  const matrixItems: MatrixItem[] = [
    { key: 'facade', label: 'Facade', icon: ShieldCheck, section: diagnosticMatrix.facade },
    { key: 'guilty_pleasure', label: 'Guilty Pleasure', icon: Flame, section: diagnosticMatrix.guilty_pleasure },
    { key: 'blindspots', label: 'Blindspots', icon: Target, section: diagnosticMatrix.blindspots },
    { key: 'deep_void', label: 'Deep Void', icon: Brain, section: diagnosticMatrix.deep_void },
  ];
  const isCreatingStory = storyAction !== null;

  const createStoryFile = async () => {
    const blob = await createStoryImageBlob(report, session);
    const fileName = storyFileName(shareableCard.archetype_title);
    return {
      blob,
      fileName,
      file: new File([blob], fileName, { type: 'image/png' }),
    };
  };

  const handleDownloadStory = async () => {
    setStoryAction('download');
    setStoryMessage(null);
    try {
      const { blob, fileName } = await createStoryFile();
      downloadBlob(blob, fileName);
      setStoryMessage('Story image downloaded.');
    } catch (error) {
      setStoryMessage(error instanceof Error ? error.message : 'Could not download the story image.');
    } finally {
      setStoryAction(null);
    }
  };

  const handleShareStory = async () => {
    setStoryAction('share');
    setStoryMessage(null);
    try {
      const { blob, fileName, file } = await createStoryFile();
      const navigatorWithShare = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
        share?: (data: ShareData) => Promise<void>;
      };
      const shareData: ShareData = {
        files: [file],
        title: 'My Dating Mirror',
        text: shareableCard.archetype_title,
      };

      if (navigatorWithShare.share && (!navigatorWithShare.canShare || navigatorWithShare.canShare(shareData))) {
        await navigatorWithShare.share(shareData);
        setStoryMessage('Story image ready to share.');
      } else {
        downloadBlob(blob, fileName);
        setStoryMessage('Sharing is not available here, so the story image was downloaded.');
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setStoryMessage(null);
      } else {
        setStoryMessage(error instanceof Error ? error.message : 'Could not share the story image.');
      }
    } finally {
      setStoryAction(null);
    }
  };

  return (
    <main className="mx-auto grid min-h-screen w-[min(1120px,calc(100%_-_32px))] gap-5 py-5 pb-12 max-[620px]:w-[min(100%_-_24px,520px)]">
      <div className="grid gap-2">
        <div className="flex min-h-10 items-center justify-between gap-4">
          <Button variant="ghostPill" size="compact" onClick={onBack}>
            <ArrowLeft size={18} />
            Back
          </Button>
          <div className="flex items-center justify-end gap-2 max-[620px]:flex-wrap">
            <Button
              aria-label="Share story image"
              className="size-11 rounded-full px-0"
              disabled={isCreatingStory}
              onClick={handleShareStory}
              size="compact"
              title="Share story image"
              variant="ghostPill"
            >
              <Share2 size={18} />
            </Button>
            <Button
              aria-label="Download story image"
              className="size-11 rounded-full px-0"
              disabled={isCreatingStory}
              onClick={handleDownloadStory}
              size="compact"
              title="Download story image"
              variant="ghostPill"
            >
              <Download size={18} />
            </Button>
            <Button variant="dangerGhost" size="compact" onClick={onBurnData}>
              <Trash2 size={17} />
              Burn My Data
            </Button>
          </div>
        </div>
        {storyMessage && (
          <p className="mb-0 justify-self-end text-[0.9rem] font-medium text-primary" role="status">
            {storyMessage}
          </p>
        )}
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
