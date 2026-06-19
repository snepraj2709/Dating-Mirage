# AI Handoff Specification: Dating Mirror  

## 1. Source Documents & Precedence

This handoff is the implementation-facing synthesis for Dating Mirror. It must stay aligned with:

| Source | Role |
| --- | --- |
| `docs/Product_PRD.md` | Controls product scope, journey, acceptance criteria, privacy rules, and KPIs. |
| `docs/Questionaire.md` | Controls exact questionnaire prompts, response copy, step-by-step scoring content, and Johari matrix language. |
| `docs/Design_system.md` | Controls visual styling, color tokens, component treatment, and Light Electric Crush UI direction. |

When the docs conflict, use this V1 decision order:

1. Product scope and acceptance criteria come from `Product_PRD.md`.
2. Step copy and scoring prompts come from `Questionaire.md`.
3. Visual implementation stays Light Electric Crush, including the reveal and Share Card.
4. Step 2 V1 is the 16-card Swipe Matrix.
5. Step 3 V1 is the 8-question friend Rapid-Fire Deck.

## 2. Project Context & Objective

Dating Mirror is a mobile-first psychological dating diagnostic for singles in their 20s and 30s experiencing dating fatigue.

The product should feel like a viral "Spotify Wrapped for your love life": users compare what they say they want, what they actually choose, and what their friends observe.

| Area | Requirement |
| --- | --- |
| Core Concept | A digital Johari Window for modern romance across 8 dating dimensions. |
| Frontend Stack | Vite + React + TypeScript SPA. |
| Backend Stack | Separate Python backend; FastAPI is recommended for OpenAPI schemas and type generation. |
| Visual Direction | Light Electric Crush only: `#FFF9FA` cream base, frosted white/pink cards, electric pink actions, Deep Plum text. |
| Primary Outcome | A personalized top-2 blind spot analysis and downloadable PNG/JPEG Share Card. |

## 3. V1 Journey Overview

| Step | Name | V1 Implementation |
| --- | --- | --- |
| 1 | Who I Say I Want | 8 stacked-card continuous sliders for the user's ideal profile (`idealProfile` / $I_d$). |
| 2 | Who I Actually Choose | 16-card Swipe Matrix for historical behavior (`actualProfile` / $A_d$). |
| 3 | What Friends Notice | Share-link friend flow with relationship selection and 8 binary Rapid-Fire Deck questions (`socialProfile` / $S_d$). |
| 4 | The Mirror Analysis | Johari calculation, top-2 dimensions, Light Electric Crush story reveal, and downloadable Share Card. |

The homepage should explain this flow at a high level: ideal choices, dating history rapid-fire round, social circle feedback, then a Johari-based analysis of gaps people close to the user can see.

## 4. Recommended Frontend Structure

Build modularly inside the Vite app:

```text
src/
├── api/
│   └── client.ts
├── components/
│   ├── ui/
│   ├── Navigation.tsx
│   ├── Hero.tsx
│   ├── MirrorStepper.tsx
│   ├── RadarChart.tsx
│   ├── Step1IdealFlow.tsx
│   ├── Step2SwipeMatrix.tsx
│   ├── FriendRapidFireDeck.tsx
│   ├── JohariMatrix.tsx
│   ├── JohariReveal.tsx
│   ├── ShareCard.tsx
│   ├── Sandbox.tsx
│   └── FAQ.tsx
├── types/
│   └── dating-mirror.ts
├── App.tsx
└── main.tsx
```

`Sandbox.tsx` is optional demo/simulation support. It is not the core user journey.

## 5. Shared Dimensions

All user and friend interactions feed into the same 8-dimensional profile. Scores are continuous floats from `1.0` to `10.0`.

| Key | Dimension | Low Endpoint | High Endpoint |
| --- | --- | --- | --- |
| `CON` | Consistency | Erratic/Hot-and-Cold | Steady/Predictable |
| `INT` | Intensity | Slow-Burn | High-Speed Whirlwind |
| `AUT` | Autonomy | Enmeshed/Codependent | Fiercely Independent |
| `VAL` | Validation-Seeking | Character-Driven | Status/Trophy-Driven |
| `GOC` | Growth/Comm | Avoidant/Silent | Confronts/Processes |
| `VUL` | Vulnerability | Guarded/Mysterious | Open/Raw |
| `REA` | Reactivity | Emotionally Sovereign | Absorbs Partner's Mood |
| `RWO` | Relational Worth | Accommodates/Settles | Firm Boundaries |

## 6. TypeScript Data Contracts

Create or align `src/types/dating-mirror.ts` around these interfaces:

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

export interface SliderQuestion {
  key: DimensionKey;
  title: string;
  scenario: string;
  leftAnchor: string;
  centerAnchor: string;
  rightAnchor: string;
}

export interface SwipeStatement {
  id: string;
  key: DimensionKey;
  statement: string;
  endpoint: 1 | 10;
  scoreEffect: -2.25 | 2.25;
  swipeRightLabel: string;
}

export interface FriendRapidFireQuestion {
  id: string;
  key: DimensionKey;
  prompt: string;
  optionA: { label: string; score: 1 | 10 };
  optionB: { label: string; score: 1 | 10 };
}

export interface DimensionJohariResult {
  key: DimensionKey;
  consciousGap: number;
  blindSpotGap: number;
  rawSeverity: number;
  severityPercentage: number;
  quadrant: QuadrantKey;
}

export interface JohariReport {
  userId: string;
  friendCount: number;
  dimensions: Record<DimensionKey, DimensionJohariResult>;
  featuredDimensions: DimensionJohariResult[];
  shareCardUrl?: string;
}

export interface UserSession {
  id: string;
  idealProfile: VectorProfile | null;
  actualProfile: VectorProfile | null;
  socialProfile: VectorProfile | null;
  friendCount: number;
  reportUnlocked: boolean;
}
```

## 7. Step 1: Ideal Partner Flow

Component: `Step1IdealFlow.tsx`

Use stacked cards with one continuous slider per dimension. Hide all numbers from the user. Show progress such as `2/8`. Auto-save state after each slider update.

Persist output as `idealProfile`.

| Key | Scenario | Left Anchor | Center Anchor | Right Anchor |
| --- | --- | --- | --- | --- |
| `CON` | "It’s a hectic Tuesday. Your ideal partner's baseline communication looks like..." | "Spontaneous and erratic. They might drop off the grid for 8 hours, but they surprise me with a wild late-night plan." | "Steady but independent. Balanced check-ins throughout the day, but their primary focus is their work." | "Highly predictable. Regular, comforting updates; I always know exactly where I stand with them." |
| `INT` | "The feeling you want to experience by the end of date number two is..." | "A calm, comfortable, easy burn. It feels safe, grounded, and low-pressure—like catching up with an old friend." | "Engaging and clear. Solid physical attraction mixed with easy, laughing conversation flow." | "An all-consuming whirlwind. Electric, magnetic chemistry that keeps us up talking until 4 AM." |
| `AUT` | "It is a completely free Saturday. How are you two spending it?" | "Glued at the hip. Errands, gym, cooking—we do absolutely everything as a joint unit." | "Connected flexibility. Separate hobbies or friend hangouts during the day, meeting back up for date night." | "Total personal sovereignty. They go on a weekend trip with their friends while I relish having the entire house to myself." |
| `VAL` | "You bring them out to a party with your friends. What makes you feel proudest?" | "How warm, unassuming, and deeply attentive they are to the people around them." | "Their easy social confidence; they blend in seamlessly and make great small talk." | "Their undeniable magnetism. They are high-status, striking, or hard-to-attain; everyone wants to know who they are." |
| `GOC` | "An uncomfortable social tension or misunderstanding happens between you. Your ideal way to resolve it is..." | "Let it drop. We sleep it off, and it naturally evaporates by morning without digging it back up." | "A quick temperature check. A brief 'We good?' 'Yeah, we're good,' and we move past it." | "A deep dive. We sit down immediately, unpack the emotional root causes, and process it completely." |
| `VUL` | "When it comes to seeing their raw fears, flaws, and messy emotional side, your preference is..." | "A slow, highly protected burn. I want them to maintain a cool, composed, slightly mysterious edge for a long time." | "Natural pacing. Peeling back the defensive layers gradually over several months as trust builds." | "Raw transparency on day one. Show me your baggage, your anxieties, and your real self immediately." |
| `REA` | "You walk through the door completely overwhelmed, anxious, and venting about a horrible day. You need them to..." | "Be an unshakeable anchor. Stay perfectly calm, objective, and detached from my emotional storm." | "Be a supportive listener. Offer comfort and a sounding board while keeping their own mood steady." | "Be an emotional mirror. Absorb my mood, match my high energy, and get passionately invested in the situation alongside me." |
| `RWO` | "If your partner gets deeply swept up in a massive career sprint or a personal passion project, what baseline do you claim you require?" | "Complete understanding. I am fine being a lower priority or taking a back seat while they chase their dreams." | "A compromise. As long as we have structured, scheduled quality time once or twice a week, I feel secure." | "Uncompromised priority. If they can't actively maintain our connection as a front-row focus, I am walking away." |

Transition copy into Step 2:

> "Aspirations are beautiful, but patterns live in our history. Let’s look at your last 2–3 relationships or situationships. No judgment, just data."

## 8. Step 2: Swipe Matrix Reality Check

Component: `Step2SwipeMatrix.tsx`

Use a Tinder-style 16-card stack: two cards per dimension. Right swipe means the behavior happened frequently. Left swipe means it rarely or never happened.

Scoring rules:

- Initialize every `actualProfile` dimension at `5.5`.
- Right swipe on a `1.0` endpoint statement subtracts `2.25`.
- Right swipe on a `10.0` endpoint statement adds `2.25`.
- Left swipe is neutral and applies no math.
- Clamp final values to `1.0` through `10.0`.
- Persist output as `step_2_actual` / `actualProfile`.
- Include haptic feedback on supported devices.

| Key | Endpoint | Statement | Swipe Right Effect |
| --- | --- | --- | --- |
| `CON` | `1.0` | "I spent significant time wondering where I stood, decoding text response times, or waiting for them to make plans." | `CON maps toward 1.0` |
| `CON` | `10.0` | "I felt a steady sense of security, knowing exactly when I’d hear from them or see them next without guessing." | `CON maps toward 10.0` |
| `INT` | `10.0` | "The connection felt like an absolute whirlwind—constant texting, heavy romantic promises, and deep attachment within the first two weeks." | `INT maps toward 10.0` |
| `INT` | `1.0` | "The beginning was quiet and low-pressure, to the point where I secretly worried if there was enough of a 'spark' or chemistry." | `INT maps toward 1.0` |
| `AUT` | `1.0` | "Once we started seeing each other, my friends joke that I completely dropped off the grid and paused my own life." | `AUT maps toward 1.0` |
| `AUT` | `10.0` | "Even deep into the connection, we maintained completely separate friend groups, independent hobbies, and solo weekends." | `AUT maps toward 10.0` |
| `VAL` | `10.0` | "Winning their attention felt like a major victory because they seemed slightly out of my league, highly sought-after, or socially popular." | `VAL maps toward 10.0` |
| `VAL` | `1.0` | "I was drawn to how safe, accessible, and genuinely kind they were, completely separate from their social status or what others thought." | `VAL maps toward 1.0` |
| `GOC` | `1.0` | "When things got tense or awkward, one or both of us would go silent, shut down, or pretend everything was totally fine to avoid a fight." | `GOC maps toward 1.0` |
| `GOC` | `10.0` | "We actively sat down, had long uncomfortable talks to unpack our feelings, and actually adjusted our real-world behavior afterward." | `GOC maps toward 10.0` |
| `VUL` | `1.0` | "Months into dating, I still felt like they were keeping up a cool, polished guard or maintaining a sense of mystery." | `VUL maps toward 1.0` |
| `VUL` | `10.0` | "They let me see their raw anxieties, family baggage, or messy emotional moments incredibly early on in the connection." | `VUL maps toward 10.0` |
| `REA` | `10.0` | "If they sent a blunt text, went quiet for a day, or seemed in a bad mood, my own day was totally derailed and my anxiety spiked." | `REA maps toward 10.0` |
| `REA` | `1.0` | "When they pulled back or needed space, I could easily shrug it off and stay fully focused on my own life, friends, and career." | `REA maps toward 1.0` |
| `RWO` | `1.0` | "I’ve stayed in a situationship or relationship for months, making excuses for their lack of commitment, hoping they’d finally change." | `RWO maps toward 1.0` |
| `RWO` | `10.0` | "The moment someone consistently treated me like an option rather than a priority, I cleanly cut the connection and walked away." | `RWO maps toward 10.0` |

The alternate Step 2 long-form questionnaire in `Questionaire.md` is reference-only for copy and product understanding. It is not part of the V1 implementation flow.

## 9. Step 3: Social Mirror Friend Flow

Component: `FriendRapidFireDeck.tsx`

The friend flow is a web-based no-download share-link experience. It must feel like a casual "vibe check," not a formal evaluation.

Friend onboarding requirements:

- Friend opens a unique share link.
- Friend selects relationship type: `best_friend`, `roommate`, `cousin`, `work_friend`, or `others`.
- Persistent privacy header says: "Your answers are anonymized and aggregated."
- Onboarding reassurance says: "Your individual responses are completely private and aggregated into a high-level report. Be as honest as a true friend should be."
- Completion target is under 60 seconds.

The detailed friend questionnaire in `Questionaire.md` can be used for preview/help/contextual flavor copy. The scored V1 flow is the Rapid-Fire Deck below.

| Key | Prompt | Option A | Option B |
| --- | --- | --- | --- |
| `CON` | "When [User] gives you an update on their dating life, it usually sounds like..." | `1.0`: "An emotional psychological thriller with weekly cliffhangers." | `10.0`: "A wholesome sitcom—perfectly steady, cozy, and predictable." |
| `INT` | "Two weeks into seeing someone new, [User] is usually..." | `10.0`: "Convinced they've met their absolute cosmic soulmate." | `1.0`: "Still trying to remember the person's middle name and if a spark exists." |
| `AUT` | "When a relationship gets official, [User]'s presence in the group chat..." | `1.0`: "Goes completely radio silent. They disappear into the relationship nebula." | `10.0`: "Stays exactly the same. They treat their social calendar like sacred text." |
| `VAL` | "Honestly, [User] is secretly way more attracted to..." | `10.0`: "The mysterious, hard-to-read person everyone at the party wants." | `1.0`: "The stable, accessible person who treats them like a priority." |
| `GOC` | "If their partner does something that hurts their feelings, [User] will..." | `1.0`: "Vent to you for 3 hours but act completely fine to their partner's face." | `10.0`: "Initiate a mandatory, deep-dive emotional processing meeting with them." |
| `VUL` | "How easy is it for a new partner to see [User]’s real, raw insecurities?" | `1.0`: "Incredibly hard. They keep an elite, unbothered, protective guard up." | `10.0`: "Extremely easy. They lay their deepest baggage on the table by date three." |
| `REA` | "If their partner leaves them on read or gets moody, [User]’s vibe becomes..." | `10.0`: "A total nervous system crisis. They spiral until it's fixed." | `1.0`: "Completely unbothered. They keep living their life regardless." |
| `RWO` | "When a partner treats them like a secondary option, [User] typically..." | `1.0`: "Stays way too long, making excuses and hoping they’ll change." | `10.0`: "Hits the eject button cleanly and walks away without a second thought." |

Aggregation requirements:

- Each friend answer locks one dimension to either `1.0` or `10.0`.
- Average all completed friend vectors into `socialProfile`.
- Minimum 2 friend responses are required to unlock the final report.
- The user can see friend response count, but never individual friend answers.

## 10. Step 4: Johari Engine & Reveal

Components: `JohariReveal.tsx`, `JohariMatrix.tsx`, `ShareCard.tsx`

Use Light Electric Crush styling for the full reveal. Keep the interaction story-like and tap-through, but do not introduce a dark theme.

Reveal sequence:

| Screen | Content |
| --- | --- |
| 1: The Magnet | What friends consistently observe. |
| 2: The Mirage | The gap between what the user wants and what they choose. |
| 3: The Breakdown | The top 2 dimensions with the highest severity scores, translated into human language. |
| 4: Next Move | A 30-day micro-habit challenge. |
| 5: The Share Card | A high-contrast, formatted summary image ready to export to Instagram/TikTok. |

Algorithm:

```ts
const HIGH_GAP_THRESHOLD = 3.0;
const MAX_DISTANCE = Math.sqrt(9 ** 2 + 9 ** 2);

function calculateDimensionJohari(
  key: DimensionKey,
  ideal: VectorProfile,
  actual: VectorProfile,
  social: VectorProfile,
): DimensionJohariResult {
  const consciousGap = Math.abs(ideal[key] - actual[key]);
  const blindSpotGap = Math.abs(actual[key] - social[key]);
  const rawSeverity = Math.sqrt(consciousGap ** 2 + blindSpotGap ** 2);
  const severityPercentage = (rawSeverity / MAX_DISTANCE) * 100;

  let quadrant: QuadrantKey = 'aligned';

  if (consciousGap >= HIGH_GAP_THRESHOLD && blindSpotGap < HIGH_GAP_THRESHOLD) {
    quadrant = 'guilty-pleasure';
  } else if (consciousGap >= HIGH_GAP_THRESHOLD && blindSpotGap >= HIGH_GAP_THRESHOLD) {
    quadrant = 'total-disconnect';
  } else if (consciousGap < HIGH_GAP_THRESHOLD && blindSpotGap >= HIGH_GAP_THRESHOLD) {
    quadrant = 'true-blindspot';
  }

  return {
    key,
    consciousGap,
    blindSpotGap,
    rawSeverity,
    severityPercentage,
    quadrant,
  };
}
```

Matrix copy:

| Conscious Gap / Blind Spot | Low Blind Spot (`< 3.0`) | High Blind Spot (`>= 3.0`) |
| --- | --- | --- |
| High Conscious Gap (`>= 3.0`) | **The Guilty Pleasure**: The user is fully aware they are making bad choices, and their friends agree. They just lack the discipline to stop. | **The Total Disconnect**: The user knows they aren't choosing what they want, but they severely underestimate how bad it actually is. |
| Low Conscious Gap (`< 3.0`) | **The Aligned State**: The user wants it, chooses it, and friends confirm it. No gap to report. | **The True Blind Spot**: The user thinks their actions match their ideals, but their friends see a completely different reality. |

Final report requirements:

- Calculate all 8 dimension results.
- Sort by `rawSeverity` or `severityPercentage`.
- Feature only the top 2 dimensions to avoid overwhelming the user.
- Render the Share Card as a downloadable PNG/JPEG.
- Avoid clinical labels such as "anxious attachment"; use empathetic friend-style copy.

## 11. Backend API Contract

Use strict JSON payloads and generate OpenAPI schemas through FastAPI.

### Pydantic Models

```py
from pydantic import BaseModel, Field
from typing import Dict, List, Literal, Optional

DimensionKey = Literal["CON", "INT", "AUT", "VAL", "GOC", "VUL", "REA", "RWO"]
QuadrantKey = Literal["guilty-pleasure", "total-disconnect", "true-blindspot", "aligned"]

class VectorProfileSchema(BaseModel):
    CON: float = Field(..., ge=1.0, le=10.0)
    INT: float = Field(..., ge=1.0, le=10.0)
    AUT: float = Field(..., ge=1.0, le=10.0)
    VAL: float = Field(..., ge=1.0, le=10.0)
    GOC: float = Field(..., ge=1.0, le=10.0)
    VUL: float = Field(..., ge=1.0, le=10.0)
    REA: float = Field(..., ge=1.0, le=10.0)
    RWO: float = Field(..., ge=1.0, le=10.0)

class CreateOrUpdateSessionRequest(BaseModel):
    ideal_profile: VectorProfileSchema

class SubmitActualProfileRequest(BaseModel):
    actual_profile: VectorProfileSchema

class SubmitFriendRapidFireRequest(BaseModel):
    relationship_type: Literal["best_friend", "roommate", "cousin", "work_friend", "others"]
    is_anonymous: bool = True
    feedback_profile: VectorProfileSchema

class DimensionJohariResultSchema(BaseModel):
    key: DimensionKey
    conscious_gap: float
    blind_spot_gap: float
    raw_severity: float
    severity_percentage: float
    quadrant: QuadrantKey

class JohariReportResponse(BaseModel):
    user_id: str
    friend_count: int
    report_unlocked: bool
    dimensions: Dict[DimensionKey, DimensionJohariResultSchema]
    featured_dimensions: List[DimensionJohariResultSchema]
    share_card_url: Optional[str] = None
```

### Required Endpoints

| Method | Route | Behavior |
| --- | --- | --- |
| `POST` | `/sessions` | Create or update a user session with `ideal_profile`. |
| `POST` | `/sessions/{session_id}/actual-profile` | Save the Step 2 swipe-derived `actual_profile`. |
| `POST` | `/sessions/{session_id}/friend-feedback` | Save one anonymized friend Rapid-Fire response. |
| `GET` | `/sessions/{session_id}/report` | Return final report only when minimum 2 friend responses are complete. |
| `DELETE` | `/sessions/{session_id}` | Implements "Burn My Data" by deleting the user profile, vectors, friend feedback, and generated report assets. |

## 12. Existing Visual Components

### `MirrorStepper.tsx`

Use this for the landing-page "How Your Mirror is Formed" explainer. It should summarize the 4-step journey, not replace the actual onboarding flow.

### `RadarChart.tsx`

Use this for previewing the three vectors: Ideal, Actual, and Social. Keep the light-pink radar styling from `Design_system.md`.

### `JohariMatrix.tsx`

Use the V1 quadrants from Step 4:

- Guilty Pleasure
- Total Disconnect
- Aligned State
- True Blind Spot

### `Sandbox.tsx`

Optional interactive educational demo. Keep it out of the required completion path.

## 13. Privacy & Trust Requirements

| Rule | Implementation Requirement |
| --- | --- |
| Aggregated social vector only | Users see `friendCount` and aggregated `socialProfile`; they never see individual friend submissions. |
| Gated access | Friends cannot see the user's final report unless the user explicitly sends the Share Card. |
| Burn My Data | Provide a one-tap "Burn My Data" action that deletes session data, vectors, friend feedback, reports, and generated assets. |
| Friend anonymity | Friend responses are stored as anonymized inputs and only contribute to aggregate scoring. |

## 14. Acceptance Criteria

### Step 1

- Numbers are hidden from the user.
- Progress is visible.
- State auto-saves after each user input.
- Output persists as `idealProfile`.

### Step 2

- 16 cards are present, two per dimension.
- Right swipes adjust score by `2.25`.
- Left swipes are neutral.
- Haptic feedback is triggered where supported.
- Output persists as `step_2_actual` / `actualProfile`.

### Step 3

- Friend flow requires relationship selection.
- Rapid-Fire Deck has 8 binary questions.
- Completion target is under 60 seconds.
- Minimum 2 friend responses are required to unlock the final report.
- User sees count only, not individual friend answers.

### Step 4

- Report calculates conscious gap, blind spot gap, raw severity, and normalized severity percentage.
- Report selects top 2 highest-severity dimensions.
- Reveal uses Light Electric Crush story-style screens.
- Share Card renders as downloadable PNG/JPEG.

## 15. Development Checklist

| Item | Requirement |
| --- | --- |
| Theme Integrity | Keep the app light-mode-only with Electric Crush pinks, frosted card layers, and Deep Plum text. |
| State Colocation | Keep step-specific UI state inside each step component and persist completed vectors through API/session state. |
| Touch Ergonomics | Use at least 44px tap targets for sliders, cards, and friend deck choices. |
| Performance | Memoize radar polygon coordinates and derived Johari results. |
| Copy Tone | Keep diagnostic language witty, empathetic, and non-clinical. |
