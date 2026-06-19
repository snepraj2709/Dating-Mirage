# Dating Mirror Design System

## Direction

Dating Mirror uses a restrained light-mode interface: white surfaces, black text, thin gray structure, and one pink accent used sparingly for the most important actions or moments.

The product should feel clear, direct, and modern. Avoid decorative romance styling, heavy gradients, glass effects, card shadows, and pink-heavy layouts.

## Core Principles

- Light mode only.
- Default UI is black, white, and gray.
- Pink is reserved for primary CTAs, critical active states, and the single most important emphasis on a screen.
- Cards and panels use borders, not shadows.
- Layouts should feel calm and spacious, not decorative.
- Interface copy should be plain, useful, and confident.
- Visual hierarchy should come from spacing, typography, contrast, and layout before color.

## Color System

### Neutral Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-bg` | `#FFFFFF` | App background and main page canvas. |
| `--color-surface` | `#FFFFFF` | Panels, cards, form surfaces, and tool areas. |
| `--color-surface-muted` | `#F7F7F7` | Subtle section bands and inactive surfaces. |
| `--color-border` | `#E6E6E6` | Default borders, dividers, and chart grid lines. |
| `--color-border-strong` | `#B8B8B8` | Focused or selected neutral borders. |
| `--color-text` | `#111111` | Primary headings and important UI text. |
| `--color-text-secondary` | `#555555` | Body text, descriptions, and captions. |
| `--color-text-muted` | `#8A8A8A` | Disabled or supporting labels. |
| `--color-black` | `#000000` | Highest contrast text or icon-only emphasis. |

### Accent Palette

| Token | Hex | Usage |
| --- | --- | --- |
| `--color-accent` | `#E83E8C` | Primary CTA, current step, critical highlight. |
| `--color-accent-hover` | `#C92774` | Primary CTA hover/pressed state. |

### Pink Usage Rules

Use pink only when it answers one of these questions:

- What is the primary action on this screen?
- What is the current step or most important active state?
- What critical result should the user notice first?

Do not use pink for:

- Page backgrounds.
- Panel or card backgrounds.
- Decorative gradients.
- Card shadows.
- Standard borders.
- Secondary buttons.
- Body copy.
- Generic icons.
- Chart grid lines.
- Multiple competing highlights on the same screen.

If more than one element on a screen is pink, decide which one matters most and return the rest to black, white, or gray.

## Typography

### Font Family

Use a clean sans-serif stack:

```css
font-family: Inter, "Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Weight

- Default text: `500`.
- Headings: `500` or `600` only when extra hierarchy is needed.
- Avoid heavy weights like `800` or `900` unless used for a single product title or a one-off display moment.

### Scale

| Role | Size Guidance |
| --- | --- |
| Page title | `clamp(2.5rem, 7vw, 5rem)` |
| Section title | `clamp(1.75rem, 4vw, 3rem)` |
| Card or panel title | `1.05rem` to `1.35rem` |
| Body | `1rem` |
| Caption / metadata | `0.82rem` to `0.9rem` |

Use `letter-spacing: 0`. Do not use negative tracking.

## Layout

### Page Structure

- Use a white page background.
- Use full-width sections with constrained inner content.
- Prefer simple grids and generous whitespace.
- Avoid floating decorative sections.
- Avoid nested cards.

### Spacing

Use an 8px spacing rhythm:

```text
4, 8, 12, 16, 24, 32, 48, 64
```

### Borders and Radius

- Default border: `1px solid #E6E6E6`.
- Strong border: `1px solid #B8B8B8`.
- Default radius: `8px`.
- Pills may use `999px` radius when the control is naturally pill-shaped.
- Do not use large rounded cards unless the interaction requires a soft touch target.

### Shadows

No shadows in product UI.

Allowed exceptions:

- Native focus rings.
- Browser default form focus if not customized.

Use borders, overlays, and spacing instead of shadows to separate layers.

## Components

### Primary CTA

Use pink for the single primary action on a screen.

```html
<button class="primary-button">Show me Mirror</button>
```

```css
.primary-button {
  min-height: 44px;
  border: 1px solid #E83E8C;
  border-radius: 999px;
  background: #E83E8C;
  color: #FFFFFF;
  font-weight: 500;
}

.primary-button:hover {
  border-color: #C92774;
  background: #C92774;
}
```

### Secondary Button

Secondary actions stay neutral.

```css
.secondary-button {
  min-height: 44px;
  border: 1px solid #D4D4D4;
  border-radius: 999px;
  background: #FFFFFF;
  color: #111111;
  font-weight: 500;
}

.secondary-button:hover {
  border-color: #111111;
  background: #F7F7F7;
}
```

### Cards and Panels

Cards are plain containers with a border. They do not float.

```css
.panel {
  border: 1px solid #E6E6E6;
  border-radius: 8px;
  background: #FFFFFF;
  padding: 24px;
  box-shadow: none;
}
```

### Forms

Inputs should be quiet and readable.

```css
.text-field input {
  min-height: 44px;
  border: 1px solid #D4D4D4;
  border-radius: 8px;
  background: #FFFFFF;
  color: #111111;
}

.text-field input:focus {
  border-color: #111111;
  outline: 2px solid #E6E6E6;
  outline-offset: 2px;
}
```

### Navigation

Navigation should feel utilitarian:

- White background.
- Thin gray border.
- Black text.
- Pink only for the main start CTA.
- No blur, glass, gradients, or shadow.

## Data Visualization

Charts should not use pink unless the chart is the primary CTA or the chart is explicitly highlighting one critical insight.

Use semantic chart colors that are distinct from CTA pink:

| Series | Color | Usage |
| --- | --- | --- |
| Ideal | `#2F9E44` | Green line/fill. |
| Actual | `#D94841` | Red line/fill. |
| Friend Feedback | `#F59E0B` | Yellow-orange line/fill. |
| Grid | `#E6E6E6` | Radar web and axis lines. |
| Labels | `#555555` | Chart labels and legend text. |

Radar chart rules:

- Show full dimension names, not acronyms.
- Keep grid lines light gray.
- Keep labels dark gray.
- Use checkboxes to let users show or hide each vector.
- Keep all vectors enabled by default.

## Interaction States

### Hover

Hover states should change border color, background shade, or text color. Avoid glow effects.

### Active

Use small scale or background changes only when useful. Avoid animated stamps or effects that compete with the task.

### Focus

Keyboard focus must be visible. Use neutral outlines by default:

```css
:focus-visible {
  outline: 2px solid #111111;
  outline-offset: 3px;
}
```

Pink focus rings are reserved for primary CTA controls only.

## Motion

Motion should be functional and brief:

- Use `120ms` to `180ms` transitions.
- Animate opacity, transform, or border color.
- Avoid floating hearts, sparkle effects, or decorative loops.
- Loading states should be plain text or a simple spinner.

## Content Tone

Keep the voice direct and self-aware without becoming noisy.

Prefer:

- "Compare your ideal, your choices, and friend feedback."
- "Waiting for two friend responses."
- "Reveal my mirror."

Avoid:

- Emoji-heavy copy.
- Roast-style labels.
- Overly cute metaphors.
- Repeated references to hearts, crushes, glow, or magic.

## Implementation Checklist

Before shipping a UI change, confirm:

- The page works in light mode.
- The main UI is black, white, and gray.
- Pink appears only on the primary CTA or one critical highlight.
- Cards have borders and no shadows.
- No decorative gradients are used.
- Text remains readable on mobile and desktop.
- Buttons and controls have visible focus states.
- Charts do not use pink by default.
