Dating Mirror 360: Design System & UI Guidelines💖 Theme: "Electric Crush" (Light Mode Only)This document defines the visual identity, UI components, interaction design, and emotional design guidelines for Dating Mirror 360. It is optimized for a Gen-Z and Millennial US audience (20s-30s) who appreciate modern aesthetic trends, self-awareness diagnostics, and lighthearted, relational self-deprecation.1. Brand Personality & Voice 🧠✨The Vibe: Best-friend-holding-up-a-mirror. Highly empathetic, witty, supportive, and unapologetically honest. It should feel like a fun psychological assessment mixed with a late-night group chat roast.Emoji Guidelines: Use emojis heavily to break cognitive friction and add personality.Core Symbols: 💖 (Electric Heart), 💕 (Spiraling Gaps), 🧠 (The Psychological Engine), 🪞 (The Mirror), 💗 (Vibe Alignment), 🦄 (The Theoretical Ideal).Tone Rule: Avoid dry, clinical language. Instead of "Attachment Anxiety Triggered", write: "Your inner love-alarm starts ringing at 100% volume 🚨".2. Color Palette 🎨This is a Light Mode Only application. The visual direction utilizes soft, pillowy, blush backgrounds contrasted with high-voltage electric pink interactive elements.                  [#EB48DD] - PRIMARY ACCENT (Electric Crush)
                                     |
    [#FFF9FA] -----------------------+----------------------- [#2A1B24]
  BG BASE (Sweet Cream)                                   TEXT MAIN (Deep Plum)
A. Brand ColorsPrimary Accent ("Electric Crush"): #EB48DDUsage: Interactive sliders, primary buttons, dynamic highlights, active radar vectors, and key alert text.Secondary Sweetener ("Pink Cotton Candy"): #FF85B3Usage: Hover states, secondary metrics, and decorative gradients.Warm Blush Glow ("Bubblegum Cloud"): #FFF2F6Usage: Neutral container backgrounds, form fields, and subtle card borders.B. Functional Backgrounds (Light Mode Baseline)App Canvas Base: #FFF9FA (A clean, ultra-soft cream with a faint pink undertone, avoiding sterile clinical whites).Glass Panel Base: rgba(255, 255, 255, 0.75) with a backdrop blur of 16px and border color rgba(235, 72, 221, 0.15).C. Text Hierarchy ColorsPrimary Text ("Deep Plum"): #2A1B24 (A highly legible, ultra-dark warm plum that replaces harsh absolute black to keep the layout feeling organic).Secondary Body Text: #6E5564 (Soft plum-slate for descriptions and helper text).Muted/Disabled Text: #A38C9B (For inactive indicators and labels).3. Typography 🗣️We use modern, highly readable, rounded geometric typefaces to maintain an approachable, friendly visual hierarchy.Primary Sans (Headings & Large Callouts): Plus Jakarta Sans or FredokaAesthetic: Soft, friendly curves, extremely relatable on mobile.Secondary Sans (Body & UI Form Elements): Inter or Plus Jakarta Sans (Medium to Semibold).Letter Spacing: Keep tracking tight for large headings (tracking-tight) to make the copy look punched-up and modern.4. Light-Mode "Frosted Heart Glass" UI ComponentsA. The Action Button (Vibrancy & Depth)Buttons should look tactile, edible, and rewarding to tap.Tailwind Class Blueprint:<button class="bg-[#EB48DD] hover:bg-[#FF85B3] text-white font-bold px-8 py-4 rounded-2xl shadow-[0_10px_25px_-5px_rgba(235,72,221,0.4)] transition-all duration-300 transform active:scale-95">
  Mirror My Heart 💖
</button>
B. The Frosted Heart Glass CardCards should hover over the soft cream background with dynamic pink shadows.Tailwind Class Blueprint:<div class="bg-white/80 backdrop-blur-md border border-[#EB48DD]/15 shadow-[0_15px_35px_rgba(235,72,221,0.06)] rounded-[2rem] p-6">
  <!-- Card Content -->
</div>
5. Visual Asset Guidelines (Radar & Matrix Updates)To keep the application cohesive with dating_mirror.png while adopting the pink light mode design system, we transform the visual assets as follows:A. The Radar Chart Style Translation (dating_mirror.png Light-Pink Palette)When rendering the custom radar chart overlaying the 3 vectors, translate the design tokens to match the light-mode vibe:Radar Grid lines: Crisp, soft rose-gold lines (stroke="rgba(235, 72, 221, 0.1)" and #FFCAD4).Layer 1 Vector: Ideal (Aspiration)Color: Deep Peach-Pink (#FF85B3).Styling: Semi-transparent fill (fill="rgba(255, 133, 179, 0.15)"), solid stroke (stroke="#FF85B3"), and distinct pink heart nodes (💗) or matching solid circular dots on vertices.Layer 2 Vector: Actual (History)Color: Vibrant Electric Pink (#EB48DD).Styling: Deep fill (fill="rgba(235, 72, 221, 0.1)"), thick stroke (stroke="#EB48DD", stroke-width="3"), with solid Electric Pink circular dots.Layer 3 Vector: Social (Friend View)Color: Deep Plum / Dark Charcoal (#2A1B24).Styling: Clean, high-contrast dashed stroke (stroke="#2A1B24", stroke-dasharray="6 4"), with bold solid plum dots to stand out.                  [CON]
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
B. The 2x2 Johari Grid Matrix (Light-Mode Translation)
The interactive Johari matrix grid is redesigned with sweet-pink status alerts rather than dark slate:Quadrant 1: The Guilty Pleasure 🍿Visual: Highlighted with soft peach outlines (border-[#FF85B3]), light pink glow.State Label: "Guilty Secret 💕"Quadrant 2: The True Blind Spot 🎭Visual: Soft electric pink flashing border (border-[#EB48DD]).State Label: "Unconscious Pattern 🔮"Quadrant 3: The Facade 🧱Visual: Solid bubblegum background (bg-[#FFF2F6]).State Label: "The Shield 🛡️"Quadrant 4: The Deep Void 🌌Visual: Left completely plain, utilizing a soft gray/light plum texture with an explicit lock symbol (🔒) to denote it is untouched.State Label: "Untouched Space 🔒"6. Micro-Interactions & Gamification 🕹️To maintain high engagement levels for young users, keep these transitions active:Dopamine Slider Pop: As users slide values toward 10.0 (high intensity or high reactivity), let a small floating bubblegum pink heart (💖) float upwards and fade out above their thumb.Interactive Swipes: The swipe action cards in Step 2 should display a bold pink "HELL YES! 💘" stamp when swiped right, and a soft gray-plum "THANK U, NEXT 💔" stamp when swiped left.Result Reveal Page: Before showing the final Dating Mirror card, display a dynamic 3-second animated "Polishing your mirror..." loader featuring a rotating heart-shaped glass compact (🪞💞).7. Tailwind Configuration Extension for DevelopmentSupply this to your frontend agent to seamlessly integrate the light-pink theme:module.exports = {
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
      boxShadow: {
        'pink-glow': '0 10px 30px -5px rgba(235, 72, 221, 0.25)',
        'pink-soft': '0 20px 40px -15px rgba(235, 72, 221, 0.1)',
      }
    }
  }
}
