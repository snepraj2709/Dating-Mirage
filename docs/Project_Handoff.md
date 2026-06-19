# AI Handoff Specification: Dating Mirror 360 SPA (Vite + React + TS) & Python Backend

## 1. Project Context & Objectives

You are building the official landing page and interactive sandbox for Dating Mirror 360—a psychological dating diagnostic.

| Area | Details |
| --- | --- |
| Core Concept | A digital Johari Window for modern romance. It maps three distinct data vectors across 8 dimensions: Stated Ideal, Real Swiping History, and Friend (Social) Observations to highlight relationship gaps. |
| Demographic | Mobile-first, design-literate 20s-30s singles in the USA. |
| Frontend Stack | Vite + React + TypeScript SPA. |
| Backend Stack | Separate Python Backend (FastAPI recommended for auto-generated OpenAPI/Swagger schemas matching TypeScript types). |
| Visual Direction | "Electric Crush" Theme (Light Mode Only). A clean, ultra-soft cream baseline (`#FFF9FA`) contrasted with pillowy bubblegum cards, high-voltage electric pink interactive components, and premium heart/love emojis. |

## 2. Directory Structure (Vite SPA)

Build modularly according to this exact component tree inside a Vite template:

```text
src/
├── api/
│   └── client.ts           # Axios / Fetch client matching backend routes
├── components/
│   ├── ui/                 # Shadcn standard installs
│   ├── RadarChart.tsx      # Custom SVG Radar matching dating_mirror.png but styled in light-mode pink
│   ├── Navigation.tsx      # Frosted heart glass header nav
│   ├── Hero.tsx            # Headline and interactive floating card
│   ├── MirrorStepper.tsx   # "How Your Mirror is Formed" interactive stepper
│   ├── JohariMatrix.tsx    # Interactive 2x2 clickable Grid & Detail Panel
│   ├── Sandbox.tsx         # Live simulation sliders and gap output cards
│   └── FAQ.tsx             # Shadcn Accordion component
├── types/
│   └── dating-mirror.ts    # Shared TypeScript types
├── App.tsx                 # Core single-page router and layout wrapper
└── main.tsx                # Entry mount
```

## 3. Tailwind Configuration Extensions

Extend your `tailwind.config.js` to support the custom color scheme, shadows, and animations:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        crush: {
          primary: '#EB48DD',     // Electric Crush Pink
          secondary: '#FF85B3',   // Cotton Candy Pink
          bg: '#FFF9FA',          // Sweet Cream Base
          card: '#FFF2F6',        // Bubblegum Container Base
          darkText: '#2A1B24',    // Deep Plum text
          subText: '#6E5564',     // Subdued slate-plum text
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'pink-glow': '0 10px 30px -5px rgba(235, 72, 221, 0.25)',
        'pink-soft': '0 20px 40px -15px rgba(235, 72, 221, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    }
  }
}
```

## 4. TypeScript Interfaces & Data Types

Create a file named `src/types/dating-mirror.ts`:

```ts
export type DimensionKey = 'CON' | 'INT' | 'AUT' | 'VAL' | 'GOC' | 'VUL' | 'REA' | 'RWO';

export interface Dimension {
  key: DimensionKey;
  name: string;
  leftLabel: string;
  rightLabel: string;
}

export interface VectorProfile {
  CON: number; // Consistency
  INT: number; // Intensity
  AUT: number; // Autonomy
  VAL: number; // Validation-Seeking
  GOC: number; // Growth/Comm
  VUL: number; // Vulnerability
  REA: number; // Emotional Reactivity
  RWO: number; // Relational Worth
}

export type QuadrantKey = 'guilty-pleasure' | 'true-blindspot' | 'the-facade' | 'deep-void';

export interface QuadrantDetail {
  icon: string;
  title: string;
  badge: string;
  badgeClass: string;
  description: string;
  vibe: string;
}

export interface UserSession {
  id: string;
  idealProfile: VectorProfile | null;
  actualProfile: VectorProfile | null;
  friendCount: number;
}
```

## 5. Python Backend Integration (FastAPI Spec)

To support decoupling, the API contract uses strict JSON payloads. Provide this Pydantic and Router blueprint directly to the Python developer.

### A. Python Pydantic Models (Schemas)

```py
from pydantic import BaseModel, Field
from typing import Optional, Dict

class VectorProfileSchema(BaseModel):
    CON: float = Field(..., ge=1.0, le=10.0, description="Consistency")
    INT: float = Field(..., ge=1.0, le=10.0, description="Intensity")
    AUT: float = Field(..., ge=1.0, le=10.0, description="Autonomy")
    VAL: float = Field(..., ge=1.0, le=10.0, description="Validation-Seeking")
    GOC: float = Field(..., ge=1.0, le=10.0, description="Growth/Comm")
    VUL: float = Field(..., ge=1.0, le=10.0, description="Vulnerability")
    REA: float = Field(..., ge=1.0, le=10.0, description="Emotional Reactivity")
    RWO: float = Field(..., ge=1.0, le=10.0, description="Relational Worth")

class CreateUserSessionRequest(BaseModel):
    ideal_profile: VectorProfileSchema

class SubmitActualProfileRequest(BaseModel):
    actual_profile: VectorProfileSchema

class SubmitFriendFeedbackRequest(BaseModel):
    relationship_type: str  # 'best_friend', 'roommate', 'cousin', 'work_friend', 'others'
    is_anonymous: bool
    feedback_profile: VectorProfileSchema
```

### B. Python FastAPI Core Calculation Engine

This script handles the core Johari Window formulation natively on the Python backend:

```py
import math
from fastapi import FastAPI, HTTPException, Depends
from typing import List, Dict, Any

app = FastAPI(title="Dating Mirror 360 Core Engine")

def calculate_johari_metrics(ideal: Dict[str, float], actual: Dict[str, float], social: Dict[str, float]) -> Dict[str, Any]:
    dimensions = ["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
    result_report = {}

    for dim in dimensions:
        i_val = ideal[dim]
        a_val = actual[dim]
        s_val = social[dim]

        # Calculate individual deltas
        conscious_gap = abs(i_val - a_val)
        blind_spot_gap = abs(a_val - s_val)

        # Calculate severity (hypotenuse of 2D coordinates)
        max_possible_distance = math.sqrt(9.0**2 + 9.0**2) # ~12.72
        raw_severity = math.sqrt(conscious_gap**2 + blind_spot_gap**2)
        severity_percentage = (raw_severity / max_possible_distance) * 100.0

        # Determine Quadrant Placement
        if conscious_gap >= 3.0 and blind_spot_gap < 3.0:
            quadrant = "guilty-pleasure"
        elif conscious_gap < 3.0 and blind_spot_gap >= 3.0:
            quadrant = "true-blindspot"
        elif conscious_gap >= 3.0 and blind_spot_gap >= 3.0:
            quadrant = "the-facade"
        else:
            quadrant = "aligned"

        result_report[dim] = {
            "conscious_gap": round(conscious_gap, 2),
            "blind_spot_gap": round(blind_spot_gap, 2),
            "severity_score": round(severity_percentage, 1),
            "quadrant": quadrant
        }

    return result_report
```

## 6. Implementation Specifications for Complex Frontend Components

### A. The Custom SVG Radar Chart (`src/components/RadarChart.tsx`)

Create a responsive, inline SVG radar chart mapping directly to the shape of `dating_mirror.png` but restyled to match the "Electric Crush" Pink design system.

#### Coordinate Dimensions

Center is at `(250, 250)`. Polygon points are mapped radially with a max radius of 200 pixels.

#### 8 Axes Coordinates (at max range)

| Dimension | Coordinate |
| --- | --- |
| Consistency (`CON`) | `(250, 50)` |
| Intensity (`INT`) | `(391.4, 108.6)` |
| Autonomy (`AUT`) | `(450, 250)` |
| Validation-Seeking (`VAL`) | `(391.4, 391.4)` |
| Growth/Comm (`GOC`) | `(250, 450)` |
| Vulnerability (`VUL`) | `(108.6, 391.4)` |
| Reactivity (`REA`) | `(50, 250)` |
| Relational Worth (`RWO`) | `(108.6, 108.6)` |

#### Dynamic Properties (Props)

```ts
highlightedLayer: 'ideal' | 'actual' | 'social' | 'all'
```

#### Radar Grid Lines

Crisp, soft rose-gold lines (`stroke="rgba(235, 72, 221, 0.1)"` and `#FFCAD4`).

#### Layers Representation

| Layer | Style |
| --- | --- |
| Layer 1 (Ideal) | Filled polygon (`fill="rgba(255, 133, 179, 0.15)"`, `stroke="#FF85B3"`, `strokeWidth="3"`). Vertices rendered as pink heart nodes (💗) or matching solid Cotton Candy Pink `#FF85B3` circles (`r="4.5"`). |
| Layer 2 (Actual) | Deep pink filled polygon (`fill="rgba(235, 72, 221, 0.1)"`, `stroke="#EB48DD"`, `strokeWidth="3"`). Vertices rendered as solid Electric Pink `#EB48DD` circles (`r="4"`). |
| Layer 3 (Social) | Unfilled dashed stroke (`fill="none"`, `stroke="#2A1B24"`, `strokeWidth="2.5"`, `strokeDasharray="6 4"`). Vertices rendered as bold, solid Deep Plum `#2A1B24` circles (`r="5.5"`). |

#### Layer Opacity Control

When a specific layer is highlighted, set its sibling layers' opacities to `0.25` (using Tailwind transition classes for smooth morphing). When `all` is active, set Ideal/Actual to `0.75` and Social to `1.0`.

### B. The Interactive Stepper (`src/components/MirrorStepper.tsx`)

| Area | Requirement |
| --- | --- |
| Left Column | A vertical list of 4 buttons (Steps 1, 2, 3, and 4) which updates local state `activeStep: number` (1 to 4). Style with active state borders in `#EB48DD` and soft pink glows. |
| Right Column | Houses `<RadarChart highlightedLayer={mapStepToLayer(activeStep)} />` along with a floating "Frosted Heart Glass" contextual card containing descriptions for each triangulation phase. |

### C. The Interactive Johari Matrix (`src/components/JohariMatrix.tsx`)

Build the 2x2 clickable matrix styled in soft, friendly pink tones.

#### Grid Panels

| Panel | Label | Visual |
| --- | --- | --- |
| Q1 (Conscious/Known) | Guilty Secret 💕 ("I know they're toxic, but..."). | Peach outlines (`border-[#FF85B3]`), light pink glow. |
| Q2 (Unconscious/Visible to Social) | Unconscious Pattern 🔮 ("I only date stable people!"). | Soft electric pink flashing border (`border-[#EB48DD]`). |
| Q3 (Unconscious/Hidden by User) | The Shield 🛡️ ("Everything is completely fine!"). | Solid bubblegum container (`bg-[#FFF2F6]`). |
| Q4 (Unconscious/Invisible to All) | Untouched Space 🔒. | Left plain with soft gray/plum texture and lock icon. Must state clearly that this represents deep psychological trauma/conditioning that neither the user nor friends can directly calculate, leaving it explicitly untouched by the application algorithm. |

#### Detail Panel

Selecting a quadrant loads detailed descriptions into a smoothly animated block using framer-motion's scale-up or fade-in transitions.

### D. The Real-time Sandbox (`src/components/Sandbox.tsx`)

Build an active mathematical simulator to let users see vector transformations in real time.

#### Inputs

3 continuous shadcn sliders representing a focal dimension (e.g., Intensity):

| Input | Default | Style |
| --- | --- | --- |
| `idealIntensity` | `5.0` | Styled with Cotton Candy Pink `#FF85B3` thumb. |
| `actualIntensity` | `5.0` | Styled with Electric Pink `#EB48DD` thumb. |
| `friendObservation` | `5.0` | Styled with Deep Plum `#2A1B24` thumb. |

#### Logic Model (Based on Johari Window Gap Formulation)

- Calculate $Gap_1 = | \text{Ideal} - \text{Actual} |$ (Conscious Self-Sabotage)
- Calculate $Gap_2 = | \text{Actual} - \text{Friends} |$ (Social Blind Spot)
- If $Gap_1 \ge 3.0$ and $Gap_2 < 3.0$ $\rightarrow$ Route result card copy to: Q1: The Guilty Pleasure Pattern.
- If $Gap_1 < 3.0$ and $Gap_2 \ge 3.0$ $\rightarrow$ Route result card copy to: Q2: True Blind Spot Mismatch.
- If $Gap_1 \ge 3.0$ and $Gap_2 \ge 3.0$ $\rightarrow$ Route result card copy to: Q3: Total Disconnect (Facade & Blindspot).
- Otherwise $\rightarrow$ Route result card copy to: Aligned Balance Profile.

#### Aesthetics

Display active metric bars for Conscious Self-Sabotage and Social Blind Spot matching the color scheme (Electric Pink `#EB48DD` for actual, Deep Plum `#2A1B24` for social).

## 7. Psychological Writing Style Guidelines

To fit the "Electric Crush" vibe, write diagnostic strings that read like an empathetic, highly intelligent friend checking in.

### Strict Anti-Diagnostic Rule

Never output clinical psychology words (e.g., avoidant, anxious attachment, narcissistic, borderline).

### Social Replacements

| Instead of | Write |
| --- | --- |
| "Anxious" | "Your inner love-alarm starts ringing at 100% volume 🚨" |
| "Avoidant" | "Maintaining a protective, cool shield." |
| "Codependent" | "Fully merging your separate lives." |

## 8. Best Practices Checklist for Development

| Item | Requirement |
| --- | --- |
| Theme Integrity | This is a light-mode-only app. Do not inject dark-mode colors or baseline gray slates. Make heavy use of pink shadows, frosted card layers, and geometric shapes. |
| State Colocation | Keep the simulation slider states inside `Sandbox.tsx` to prevent unnecessary root-level re-renders. |
| Performance Optimization | Wrap the SVG polygons mapping coordinates in a `useMemo` hook triggered by parent updates. |
| Adaptive Layout | Sliders and grid matrix MUST transition from a stacked 1-column layout on mobile (`grid-cols-1`) to double-column boards on desktops (`md:grid-cols-2`). Ensure that tap targets on sliders and buttons are at least 44px on touch devices. |
