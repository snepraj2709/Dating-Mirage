# Dating Mirror 360 Product PRD

| Field | Details |
| --- | --- |
| Product Name | Dating Mirror 360 |
| Feature Set | The Core Johari Engine (V1.0) |
| Target Audience | Singles in their 20s and 30s experiencing dating fatigue. |
| Objective | Deliver a viral, highly shareable "Spotify Wrapped for your love life" by quantifying the gap between a user's stated desires, their historical choices, and their friends' observations. |

## Experience Overview

User Comes on the Landing page, it has a impactful mirror cum mirage illustration and animation highlighting the gap between a person’s desired partner and their actual choices with a CTA to ask user to find their dating mirror “Show me Mirror” (a bold ask preparing the user to be mentally ready to digest the harsh truth about their dating history and ideal partner)

Next landing page has an animation of step by step flow of how the mirror gets generated with Step 1 being user’s ideal partner choices, step 2 being user’s dating history rapid fire round, step 3 to share social circle feedback link with friends or people who have closely observed their dating behavior (show a preview of how it will look to their friends ), then a curated mixture of all the responses getting cooked like a luxury dish and a final outcome/analysis using Johari window algorithm to highlight the blindspots of user highlighted by their social circle feedback.

Highlight how the gap is so evident to people who know you, but you can’t see them.

## 1. Data Architecture: The 8 Core Dimensions

All user and friend interactions feed into a centralized schema based on 8 psychological vectors. Every dimension is scored on a continuous float scale from 1.0 to 10.0.

| Dimension | Low Endpoint | High Endpoint |
| --- | --- | --- |
| Consistency (`CON`) | Erratic/Hot-and-Cold (1.0) | Steady/Predictable (10.0) |
| Intensity (`INT`) | Slow-Burn (1.0) | High-Speed Whirlwind (10.0) |
| Autonomy (`AUT`) | Enmeshed/Codependent (1.0) | Fiercely Independent (10.0) |
| Validation-Seeking (`VAL`) | Character-Driven (1.0) | Status/Trophy-Driven (10.0) |
| Growth/Comm (`GOC`) | Avoidant/Silent (1.0) | Confronts/Processes (10.0) |
| Vulnerability (`VUL`) | Guarded/Mysterious (1.0) | Open/Raw (10.0) |
| Reactivity (`REA`) | Emotionally Sovereign (1.0) | Absorbs Partner's Mood (10.0) |
| Relational Worth (`RWO`) | Accommodates/Settles (1.0) | Firm Boundaries (10.0) |

## 2. Feature Specifications: The 4-Step Journey

### Phase 1: User Step 1 — "Who I Say I Want" (The Ideal)

#### Objective

Capture the user's aspirational dating profile ($I_d$ Vector) without triggering cognitive fatigue or numerical bias.

#### UX Mechanism

"Vivid Anchors" Continuous Sliders.

#### UI/UX Flow

- User is presented with 8 sequential screens, one for each dimension.
- Instead of numbers, the UI features a draggable slider positioned between two hyper-specific, relatable text scenarios (e.g., "A calm, slow burn" vs. "An electric 4 AM whirlwind").
- As the user drags the slider, the text dynamically highlights to reinforce their choice.

#### Backend Logic

- Slider position maps silently to a 1.0 - 10.0 value.
- Data is stored as `step_1_ideal` vector in the user's JSONB profile.

#### Acceptance Criteria

- Numbers must be completely hidden from the user interface.
- Must include a progress indicator (e.g., "2/8").
- State must auto-save in case of app drop-off.

### Phase 2: User Step 2 — "Who I Actually Choose" (The Reality)

#### Objective

Capture the user's actual behavioral history ($A_d$ Vector).

#### UX Mechanism

Swipe Matrix (16 Cards).

#### UI/UX Flow

- Transition Screen: "Aspirations are beautiful, but patterns live in our history. Let's look at your last 3 dating experiences. No judgment, just data."
- User is presented with a Tinder-style stack of 16 statement cards (2 per dimension).
- Action: Swipe Right if the statement happened frequently; Swipe Left if it rarely happened.

#### Backend Logic

- Initialize the $A_d$ vector array at 5.5 for all dimensions.
- If user swipes Right on a "1.0 endpoint" statement, subtract 2.25 from that dimension.
- If user swipes Right on a "10.0 endpoint" statement, add 2.25 to that dimension.

#### Acceptance Criteria

- Haptic feedback on swipes.
- Left swipes register as null/neutral (no math applied) to maintain baseline.
- Output is saved as `step_2_actual` vector.

### Phase 3: The Social Mirror — "What Friends Notice"

#### Objective

Gather brutal, ground-truth data from the user's social circle ($S_d$ Vector) with zero onboarding friction.

#### UX Mechanism

Web-based "This or That" Rapid-Fire Deck.

#### UI/UX Flow

- User generates a unique share link.
- Friend clicks link, opens a mobile-web view (no app download required).
- Friend selects their relationship to the user (Best Friend, Roommate, Colleague).
- Privacy Shield UI: Persistent header states, "Your answers are anonymized and aggregated."
- Friend plays a rapid-fire game, tapping between two binary extremes (e.g., "Wholesome Sitcom" vs "Psychological Thriller").

#### Backend Logic

- Each tap locks in either a 1.0 or a 10.0 for that specific dimension.
- Algorithm aggregates all friend responses into a single average `social_feedback` vector ($S_d$). Minimum 2 friend responses required to unlock the final report.

#### Acceptance Criteria

- Dynamic text insertion: Questions must change flavor based on the relationship selected (e.g., "in the group chat" vs. "around the apartment").
- Must take under 60 seconds to complete.

### Phase 4: The Johari Engine — Gap Calculation & Reveal

#### Objective

Synthesize the 3 vectors ($I_d, A_d, S_d$) into a personalized, highly shareable diagnostic card.

#### Algorithm Logic

For each of the 8 dimensions, calculate two Deltas:

- Conscious Gap (Self-Sabotage): $\Delta_{Conscious} = | I_d - A_d |$
- Blind Spot (Delusion): $\Delta_{Blind} = | A_d - S_d |$
- Severity Score: $\sqrt{(\Delta_{Conscious})^2 + (\Delta_{Blind})^2}$

#### The 2x2 Output Matrix Mapping

If $\Delta \ge 3.0$, it triggers a specific copy block:

| Trigger | Copy Block |
| --- | --- |
| High Conscious + Low Blind | The Guilty Pleasure (You know you do it, friends see it, you just can't stop). |
| Low Conscious + High Blind | The True Blind Spot (You think you are healthy, friends know you are spiraling). |
| High Conscious + High Blind | The Total Disconnect (You know it's bad, but you have no idea how bad). |

#### UI/UX Flow: The Reveal

Light mode, Instagram Story-style tap-through reveal.

| Screen | Description |
| --- | --- |
| Screen 1: The Magnet | What friends consistently observe. |
| Screen 2: The Mirage | The gap between what they want and what they choose. |
| Screen 3: The Breakdown | The top 2 dimensions with the highest Severity Scores translated into human language (No clinical jargon like "anxious attachment"). |
| Screen 4: Next Move | A 30-day micro-habit challenge. |
| Screen 5: The Share Card | A beautifully formatted, high-contrast summary image ready to export to Instagram/TikTok. |

#### Acceptance Criteria

- Algorithm must select the top 2 highest-tension dimensions to feature; discard the rest to avoid overwhelming the user.
- "Share Card" must automatically render as a downloadable PNG/JPEG.

## 3. Privacy & Trust Architecture (Strict Guidelines)

| Guideline | Requirement |
| --- | --- |
| Anonymity Rule | Users can see how many friends voted, but the backend must mathematically obscure individual friend inputs. The user only ever sees the aggregated $S_d$ vector. |
| Data Deletion | A one-tap "Burn My Data" button in settings that instantly clears the JSONB profile from the database. |
| Gated Access | Friends who submit feedback cannot see the user's final gap report unless the user explicitly texts them the Share Card. |

## 4. Key Performance Indicators (KPIs)

| KPI | Target |
| --- | --- |
| Completion Rate (Step 1 to Step 2) | Target >85%. (Measured to ensure the swipe matrix reduces friction). |
| K-Factor (Virality) | Average number of friend links completed per user. Target: 3.5. |
| Share Rate | Percentage of users who export/share their final Dating Mirror Card to social media. Target: >40%. |
