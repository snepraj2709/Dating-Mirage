# Dating Mirror Design System

## Theme: Electric Crush 💖

**Mode:** Light mode only

This document defines the visual identity, UI components, interaction design, and emotional design guidelines for Dating Mirror.

The system is optimized for a Gen-Z and Millennial US audience in their 20s and 30s who appreciate modern aesthetic trends, self-awareness diagnostics, and lighthearted relational self-deprecation.

## 1. Brand Personality & Voice 🧠✨

### The Vibe

Best-friend-holding-up-a-mirror: highly empathetic, witty, supportive, and unapologetically honest.

The experience should feel like a fun psychological assessment mixed with a late-night group chat roast.

### Emoji Guidelines

Use emojis heavily to break cognitive friction and add personality.

### Core Symbols

| Symbol | Meaning |
| --- | --- |
| 💖 | Electric Heart |
| 💕 | Spiraling Gaps |
| 🧠 | The Psychological Engine |
| 🪞 | The Mirror |
| 💗 | Vibe Alignment |
| 🦄 | The Theoretical Ideal |

### Tone Rule

Avoid dry, clinical language.

Instead of:

> Attachment Anxiety Triggered

Write:

> Your inner love-alarm starts ringing at 100% volume 🚨

## 2. Color Palette 🎨

This is a light-mode-only application. The visual direction uses soft, pillowy blush backgrounds contrasted with high-voltage electric pink interactive elements.

```text
                  [#EB48DD] - PRIMARY ACCENT (Electric Crush)
                                     |
    [#FFF9FA] -----------------------+----------------------- [#2A1B24]
  BG BASE (Sweet Cream)                                   TEXT MAIN (Deep Plum)
```

### A. Brand Colors

| Token | Hex | Usage |
| --- | --- | --- |
| Primary Accent, "Electric Crush" | `#EB48DD` | Interactive sliders, primary buttons, dynamic highlights, active radar vectors, and key alert text. |
| Secondary Sweetener, "Pink Cotton Candy" | `#FF85B3` | Hover states, secondary metrics, and decorative gradients. |
| Warm Blush Glow, "Bubblegum Cloud" | `#FFF2F6` | Neutral container backgrounds, form fields, and subtle card borders. |

### B. Functional Backgrounds

| Token | Value | Usage |
| --- | --- | --- |
| App Canvas Base | `#FFF9FA` | A clean, ultra-soft cream with a faint pink undertone that avoids sterile clinical whites. |
| Glass Panel Base | `rgba(255, 255, 255, 0.75)` | Use with `backdrop-blur: 16px` and `border-color: rgba(235, 72, 221, 0.15)`. |

### C. Text Hierarchy Colors

| Token | Hex | Usage |
| --- | --- | --- |
| Primary Text, "Deep Plum" | `#2A1B24` | Highly legible, ultra-dark warm plum that replaces harsh absolute black. |
| Secondary Body Text | `#6E5564` | Soft plum-slate for descriptions and helper text. |
| Muted/Disabled Text | `#A38C9B` | Inactive indicators and labels. |

## 3. Typography 🗣️

Use modern, readable, rounded geometric typefaces to maintain an approachable and friendly visual hierarchy.

### Primary Sans

**Use for:** Headings and large callouts

**Fonts:** Plus Jakarta Sans or Fredoka

**Aesthetic:** Soft, friendly curves that feel relatable on mobile.

### Secondary Sans

**Use for:** Body text and UI form elements

**Fonts:** Inter or Plus Jakarta Sans

**Weights:** Medium to Semibold

### Letter Spacing

Keep tracking tight for large headings, such as `tracking-tight`, to make the copy feel punched-up and modern.

## 4. Light-Mode Frosted Heart Glass Components

### A. Action Button

Buttons should look tactile, edible, and rewarding to tap.

```html
<button
  class="bg-[#EB48DD] hover:bg-[#FF85B3] text-white font-bold px-8 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(235,72,221,0.4)] transition-all duration-300 transform active:scale-95"
>
  Mirror My Heart 💖
</button>
```

### B. Frosted Heart Glass Card

Cards should hover over the soft cream background with dynamic pink shadows.

```html
<div
  class="bg-white/80 backdrop-blur-md border border-[#EB48DD]/15 shadow-[0_15px_35px_rgba(235,72,221,0.06)] rounded-[2rem] p-6"
>
  <!-- Card Content -->
</div>
```

## 5. Visual Asset Guidelines

To keep the application cohesive with `dating_mirror.png` while adopting the pink light-mode design system, transform the visual assets as follows.

### A. Radar Chart Style Translation

When rendering the custom radar chart that overlays the three vectors, translate the design tokens to match the light-mode vibe.

#### Radar Grid

| Element | Style |
| --- | --- |
| Grid lines | Crisp, soft rose-gold lines |
| Stroke examples | `rgba(235, 72, 221, 0.1)` and `#FFCAD4` |

#### Layer 1: Ideal, Aspiration

| Property | Value |
| --- | --- |
| Color | Deep Peach-Pink, `#FF85B3` |
| Fill | `rgba(255, 133, 179, 0.15)` |
| Stroke | `#FF85B3` |
| Nodes | Pink heart nodes, `💗`, or matching solid circular dots on vertices |

#### Layer 2: Actual, History

| Property | Value |
| --- | --- |
| Color | Vibrant Electric Pink, `#EB48DD` |
| Fill | `rgba(235, 72, 221, 0.1)` |
| Stroke | `#EB48DD` |
| Stroke width | `3` |
| Nodes | Solid Electric Pink circular dots |

#### Layer 3: Social, Friend View

| Property | Value |
| --- | --- |
| Color | Deep Plum / Dark Charcoal, `#2A1B24` |
| Stroke | `#2A1B24` |
| Stroke dash array | `6 4` |
| Nodes | Bold solid plum dots |

```text
                  [CON]
                    |      --- Ideal (Aspiration) [#FF85B3]
         [RWO]      |      [INT]
             \      |      /
              \   💗|  💗 /   === Actual (History) [#EB48DD]
               \    |    /
       [REA]--------+--------[AUT]
               /    |    \    - - - Social (Friend View) [#2A1B24]
              /   💗|  💗 \
             /      |      \
         [VUL]      |      [VAL]
                    |
                  [GOC]
```

### B. 2x2 Johari Grid Matrix

The interactive Johari matrix grid should use sweet-pink status alerts instead of dark slate.

| Quadrant | Name | Visual Treatment | State Label |
| --- | --- | --- | --- |
| 1 | The Guilty Pleasure 🍿 | Highlighted with soft peach outlines, `border-[#FF85B3]`, and a light pink glow. | Guilty Secret 💕 |
| 2 | The True Blind Spot 🎭 | Soft electric pink flashing border, `border-[#EB48DD]`. | Unconscious Pattern 🔮 |
| 3 | The Facade 🧱 | Solid bubblegum background, `bg-[#FFF2F6]`. | The Shield 🛡️ |
| 4 | The Deep Void 🌌 | Plain soft gray/light plum texture with an explicit lock symbol, `🔒`, to show it is untouched. | Untouched Space 🔒 |

## 6. Micro-Interactions & Gamification 🕹️

To maintain high engagement levels for young users, keep these transitions active.

### Dopamine Slider Pop

As users slide values toward `10.0`, such as high intensity or high reactivity, let a small floating bubblegum pink heart, `💖`, float upward and fade out above the thumb.

### Interactive Swipes

The swipe action cards in Step 2 should display:

- A bold pink `HELL YES! 💘` stamp when swiped right.
- A soft gray-plum `THANK U, NEXT 💔` stamp when swiped left.

### Result Reveal Page

Before showing the final Dating Mirror card, display a dynamic 3-second animated loader:

> Polishing your mirror...

The loader should feature a rotating heart-shaped glass compact, `🪞💞`.

## 7. Tailwind Configuration Extension

Supply this to the frontend agent to integrate the light-pink theme.

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        crush: {
          primary: '#EB48DD', // Electric Crush Pink
          secondary: '#FF85B3', // Cotton Candy Pink
          bg: '#FFF9FA', // Sweet Cream Base
          card: '#FFF2F6', // Bubblegum Container Base
          darkText: '#2A1B24', // Deep Plum text
          subText: '#6E5564', // Subdued slate-plum text
        },
      },
      boxShadow: {
        'pink-glow': '0 10px 30px -5px rgba(235, 72, 221, 0.25)',
        'pink-soft': '0 20px 40px -15px rgba(235, 72, 221, 0.1)',
      },
    },
  },
};
```
