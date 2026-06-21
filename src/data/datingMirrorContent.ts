import type {
  Dimension,
  DimensionKey,
  FriendRapidFireQuestion,
  IdealQuestion,
  RelationshipType,
  IntrospectionCard,
} from '../types/dating-mirror';

export const dimensionOrder: DimensionKey[] = [
  'CON',
  'INT',
  'AUT',
  'VAL',
  'GOC',
  'VUL',
  'REA',
  'RWO',
];

export const dimensions: Dimension[] = [
  {
    key: 'CON',
    name: 'Consistency',
    leftLabel: 'Erratic/Hot-and-Cold',
    rightLabel: 'Steady/Predictable',
  },
  { key: 'INT', name: 'Intensity', leftLabel: 'Slow-Burn', rightLabel: 'High-Speed Whirlwind' },
  { key: 'AUT', name: 'Autonomy', leftLabel: 'Enmeshed/Codependent', rightLabel: 'Fiercely Independent' },
  { key: 'VAL', name: 'Validation-Seeking', leftLabel: 'Character-Driven', rightLabel: 'Status/Trophy-Driven' },
  { key: 'GOC', name: 'Communication', leftLabel: 'Avoidant/Silent', rightLabel: 'Confronts/Processes' },
  { key: 'VUL', name: 'Vulnerability', leftLabel: 'Guarded/Mysterious', rightLabel: 'Open/Raw' },
  { key: 'REA', name: 'Reactivity', leftLabel: 'Emotionally Sovereign', rightLabel: "Absorbs Partner's Mood" },
  { key: 'RWO', name: 'Relational Worth', leftLabel: 'Accommodates/Settles', rightLabel: 'Firm Boundaries' },
];

export const idealQuestions: IdealQuestion[] = [
  {
    key: 'CON',
    title: 'Consistency',
    scenario: "It's a hectic Tuesday. Your ideal partner's baseline communication looks like...",
    options: [
      { score: 1, label: 'Their spontaneity - replies come in bursts, and plans can change fast.' },
      { score: 4, label: 'Their independence - they check in, but their day stays their own.' },
      { score: 7, label: 'Their steadiness - you hear from them in ways that feel easy to trust.' },
      { score: 10, label: 'Their predictability - you always know where you stand without guessing.' },
    ],
  },
  {
    key: 'INT',
    title: 'Intensity',
    scenario: 'The feeling you want to experience by the end of date number two is...',
    options: [
      { score: 1, label: 'The calm - it feels safe, grounded, and low-pressure.' },
      { score: 4, label: 'The spark - there is clear attraction without pressure to rush.' },
      { score: 7, label: 'The pull - you both want more time together and it is hard to ignore.' },
      { score: 10, label: 'The obsession - electric chemistry keeps you talking until 4 AM.' },
    ],
  },
  {
    key: 'AUT',
    title: 'Autonomy',
    scenario: 'It is a completely free Saturday. How are you two spending it?',
    options: [
      { score: 1, label: 'The closeness - you do most things as a unit.' },
      { score: 4, label: 'The balance - separate plans still lead back to each other.' },
      { score: 7, label: 'The independence - each of you protects your own routines and people.' },
      { score: 10, label: 'The sovereignty - solo weekends and separate worlds feel natural, not threatening.' },
    ],
  },
  {
    key: 'VAL',
    title: 'Validation-Seeking',
    scenario: 'You bring them out to a party with your friends. What makes you feel proudest?',
    options: [
      { score: 1, label: "Their warmth - people are drawn to them and it's effortless." },
      { score: 4, label: 'Their social ease - they blend in, make good conversation, no awkwardness.' },
      { score: 7, label: 'Their confidence - people notice them, and you notice people noticing.' },
      { score: 10, label: "That they're rare - the room does not quite know what to make of them yet." },
    ],
  },
  {
    key: 'GOC',
    title: 'Growth & Communication',
    scenario: 'An uncomfortable social tension or misunderstanding happens between you. Your ideal way to resolve it is...',
    options: [
      { score: 1, label: 'The reset - you let it cool off and move on without digging.' },
      { score: 4, label: 'The check-in - a quick honest read is enough to feel okay.' },
      { score: 7, label: 'The conversation - you talk through what happened and adjust.' },
      { score: 10, label: 'The deep dive - you unpack the roots until it feels fully understood.' },
    ],
  },
  {
    key: 'VUL',
    title: 'Vulnerability',
    scenario: 'When it comes to seeing their raw fears, flaws, and messy emotional side, your preference is...',
    options: [
      { score: 1, label: 'The mystery - they stay composed and reveal themselves slowly.' },
      { score: 4, label: 'The pacing - trust builds before the messier parts come out.' },
      { score: 7, label: 'The openness - they can name fears and flaws without making it a performance.' },
      { score: 10, label: 'The rawness - they show the unfiltered version early and directly.' },
    ],
  },
  {
    key: 'REA',
    title: 'Emotional Reactivity',
    scenario: 'You walk through the door completely overwhelmed, anxious, and venting about a horrible day. You need them to...',
    options: [
      { score: 1, label: 'The anchor - they stay calm and do not absorb your storm.' },
      { score: 4, label: 'The listener - they comfort you while keeping their own mood steady.' },
      { score: 7, label: 'The investment - they feel with you and want to help fix the moment.' },
      { score: 10, label: 'The mirror - they match your emotional volume and get fully pulled in.' },
    ],
  },
  {
    key: 'RWO',
    title: 'Relational Worth',
    scenario:
      'If your partner gets deeply swept up in a massive career sprint or a personal passion project, what baseline do you claim you require?',
    options: [
      { score: 1, label: 'The patience - you can accept being a lower priority during a big season.' },
      { score: 4, label: 'The agreement - scheduled quality time is enough to feel secure.' },
      { score: 7, label: 'The standard - they need to show active effort even when life gets full.' },
      { score: 10, label: 'The boundary - if connection stops being a real priority, you walk.' },
    ],
  },
];

export const swipeStatements: IntrospectionCard[] = [
  // ==========================================
  // CONSISTENCY (CON)
  // ==========================================
  {
    id: 'CON-low',
    key: 'CON',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "When dating someone whose communication patterns or schedule felt unpredictable and erratic...",
    subtext: "Look back at the raw daily reality, not how you handled it later.",
    options: [
      { weight: 1.0, label: "That was my normal. I spent significant time decoding text timing and waiting around for plans." },
      { weight: 0.66, label: "I frequently caught myself overanalyzing their rhythm, though I tried to play it cool." },
      { weight: 0.33, label: "It happened occasionally, but I typically pulled back if it felt like an inconsistent game." },
      { weight: 0.0, label: "Not my pattern. If their baseline wasn't steady from the start, I naturally lost interest." }
    ]
  },
  {
    id: 'CON-high',
    key: 'CON',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "In my past relationships, experiencing a highly predictable, reliable routine with a partner felt like...",
    subtext: "Be honest about whether safety feels like comfort or boredom.",
    options: [
      { weight: 1.0, label: "A massive relief. I felt a steady sense of security, knowing exactly where I stood without guessing." },
      { weight: 0.66, label: "Comfortable and preferred. It allowed me to naturally integrate them into my life." },
      { weight: 0.33, label: "Nice initially, but over time it started to feel a bit too routine or lacked an edge." },
      { weight: 0.0, label: "Rarely my reality. Honestly, perfectly predictable connections usually bore me." }
    ]
  },

  // ==========================================
  // INTENSITY (INT)
  // ==========================================
  {
    id: 'INT-high',
    key: 'INT',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "Looking at the first two weeks of my most memorable or frequent connections, the energy...",
    subtext: "Is your baseline sparked by gradual curiosity or an emotional landslide?",
    options: [
      { weight: 1.0, label: "Was an absolute whirlwind—constant texting, heavy romantic declarations, and fast attachment." },
      { weight: 0.66, label: "Accelerated quite quickly. We skipped the casual phase and jumped straight into the deep end." },
      { weight: 0.33, label: "Had a strong spark, but we managed to keep our individual lives moving forward." },
      { weight: 0.0, label: "Was quiet and measured. Fast-paced whirlwind energy actually sets off alarm bells for me." }
    ]
  },
  {
    id: 'INT-low',
    key: 'INT',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "If the beginning of a connection felt quiet, safe, grounded, and low-pressure...",
    subtext: "How does your nervous system interpret a lack of early relationship drama?",
    options: [
      { weight: 1.0, label: "I panicked or checked out. I secretly worried if a lack of a crazy 'spark' meant there was zero chemistry." },
      { weight: 0.66, label: "I overanalyzed it, wondering if we were drifting into a friendship rather than a romance." },
      { weight: 0.33, label: "I noticed the slow pace but intentionally gave the chemistry room to build naturally." },
      { weight: 0.0, label: "I loved it. A quiet, safe beginning is exactly what I actively look for." }
    ]
  },

  // ==========================================
  // AUTONOMY (AUT)
  // ==========================================
  {
    id: 'AUT-low',
    key: 'AUT',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "When a new relationship finally became official and exciting, my external world...",
    subtext: "Think about your group chats, hobbies, and family obligations.",
    options: [
      { weight: 1.0, label: "Completely evaporated. My friends joke that I dropped off the grid and paused my own life." },
      { weight: 0.66, label: "Shifted significantly. My personal routines and friendships definitely took a major backseat." },
      { weight: 0.33, label: "Bent a little bit, but I still made sure to show up for my people and maintain my hobbies." },
      { weight: 0.0, label: "Stayed perfectly intact. I never let a connection disrupt my core personal life or schedule." }
    ]
  },
  {
    id: 'AUT-high',
    key: 'AUT',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "Deep into a relationship, the separation of friend groups, independent hobbies, and solo weekends feels...",
    subtext: "Is independence a functional choice or an emotional protective shield?",
    options: [
      { weight: 1.0, label: "Essential. We maintained completely separate social worlds, parallel lives, and distinct routines." },
      { weight: 0.66, label: "Highly important. We kept clear boundaries around our individual time and friend circles." },
      { weight: 0.33, label: "Like a balance. We had our own things but heavily blended our core lives and friends." },
      { weight: 0.0, label: "Unnatural. I prefer a shared world where we do almost everything as an integrated unit." }
    ]
  },

  // ==========================================
  // VALIDATION-SEEKING (VAL)
  // ==========================================
  {
    id: 'VAL-high',
    key: 'VAL',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "When capturing the attention of someone who felt out of my league, highly sought-after, or socially popular...",
    subtext: "Be honest about the ego rush of winning a prize.",
    options: [
      { weight: 1.0, label: "It felt like a massive psychological victory. The social validation of winning them was intoxicating." },
      { weight: 0.66, label: "It definitely intensified my attraction. I loved knowing they were highly desired by others." },
      { weight: 0.33, label: "It was a nice ego boost, but it didn't change how I felt about them on a human level." },
      { weight: 0.0, label: "Didn't matter at all. Social status or what others think of my partner holds zero weight for me." }
    ]
  },
  {
    id: 'VAL-low',
    key: 'VAL',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "When I evaluate what actually pulled me toward my past partners, the core attraction was based on...",
    subtext: "Strip away the external resume and look at your real romantic triggers.",
    options: [
      { weight: 1.0, label: "How safe, accessible, and genuinely kind they were, completely separate from social status." },
      { weight: 0.66, label: "Their stability and warmth, even if they weren't the flashiest person in the room." },
      { weight: 0.33, label: "A mix, but I need a little bit of edge or social presence to keep from losing romantic interest." },
      { weight: 0.0, label: "Honestly, flash and status. Pure kindness without social gravity rarely keeps me hooked." }
    ]
  },

  // ==========================================
  // GROWTH & COMMUNICATION (GOC)
  // ==========================================
  {
    id: 'GOC-low',
    key: 'GOC',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "When sharp tension, an awkward misunderstanding, or a minor conflict occurred in the relationship...",
    subtext: "Think of your default panic reaction, not what you wished you'd said later.",
    options: [
      { weight: 1.0, label: "We completely froze up. One or both of us went silent, shut down, or pretended things were fine to avoid a fight." },
      { weight: 0.66, label: "We defaulted to passive-aggressive hints or icy distance rather than putting cards on the table." },
      { weight: 0.33, label: "We dodged it temporarily to cool down, but eventually brushed past it without a deep resolution." },
      { weight: 0.0, label: "We never let it fester. We addressed the tension immediately and transparently." }
    ]
  },
  {
    id: 'GOC-high',
    key: 'GOC',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "When handling relational friction, our approach to emotional processing sessions was...",
    subtext: "Did your conversations yield behavioral changes or just temporary emotional exhaustion?",
    options: [
      { weight: 1.0, label: "Active and highly intentional. We sat down, unpacked deep feelings, and adjusted real-world behaviors afterward." },
      { weight: 0.66, label: "Conversational. We talked through the core issues clearly and made genuine efforts to improve." },
      { weight: 0.33, label: "Cyclical. We talked a lot and cried a lot, but our actual dynamic didn't change much in the long run." },
      { weight: 0.0, label: "Non-existent. We rarely had structured emotional deep-dives; we just waited for the bad mood to pass." }
    ]
  },

  // ==========================================
  // VULNERABILITY (VUL)
  // ==========================================
  {
    id: 'VUL-low',
    key: 'VUL',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "Months into dating someone, if I realized they were still keeping up a cool, polished guard or an air of mystery...",
    subtext: "Are you drawn to emotional availability or do you accidentally chase a wall?",
    options: [
      { weight: 1.0, label: "I stayed hooked. I consistently found myself sticking around trying to decode or unlock them." },
      { weight: 0.66, label: "I accepted it for way too long, confusing their emotional distance with strength or maturity." },
      { weight: 0.33, label: "I noticed it, felt frustrated by the barrier, and started checking out of the connection." },
      { weight: 0.0, label: "I bounced. If a partner doesn't show real emotional transparency after a few months, I leave." }
    ]
  },
  {
    id: 'VUL-high',
    key: 'VUL',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "In my history, seeing a partner's raw anxieties, deep family baggage, or unpolished emotional meltdowns happened...",
    subtext: "Think about the timeline of the emotional unmasking.",
    options: [
      { weight: 1.0, label: "Incredibly early on. We regularly dropped our deepest armor and heaviest baggage within the first few dates." },
      { weight: 0.66, label: "Fairly fast. The messy, unfiltered realities of life were shared without waiting for long-term safety." },
      { weight: 0.33, label: "Gradually. The heavier emotional realities came out steadily as earned trust built over time." },
      { weight: 0.0, label: "Very late or never. My relationships typically remained highly curated and composed for a long duration." }
    ]
  },

  // ==========================================
  // EMOTIONAL REACTIVITY (REA)
  // ==========================================
  {
    id: 'REA-high',
    key: 'REA',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "If my partner sent a blunt text, went suddenly quiet for a day, or seemed in an unexplainably bad mood...",
    subtext: "Answer with what your nervous system did, not your logical mind.",
    options: [
      { weight: 1.0, label: "My nervous system went into full crisis. My day was totally derailed and my anxiety spiked." },
      { weight: 0.66, label: "I spun straight into obsessive overthinking, repeatedly checking my phone and running scenarios." },
      { weight: 0.33, label: "I felt a temporary sting of worry, but I could quickly ground myself and go about my day." },
      { weight: 0.0, label: "I shrugged it off instantly. Their mood belonged to them, and my emotional stability stayed mine." }
    ]
  },
  {
    id: 'REA-low',
    key: 'REA',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "When past partners pulled back, requested space, or disconnected to focus on their own lives...",
    subtext: "Did you genuinely lean back, or did you just pretend to be unbothered?",
    options: [
      { weight: 1.0, label: "I easily shrugged it off, completely untethered. I stayed fully focused on my own life, friends, and career." },
      { weight: 0.66, label: "I accepted it smoothly. I naturally redirected my focus to my own schedule without internal panic." },
      { weight: 0.33, label: "On the outside I looked unbothered, but internally I was quietly keeping score and tracking their distance." },
      { weight: 0.0, label: "Space felt like an active threat. It triggered an immediate, intense urge to chase them or fix it." }
    ]
  },

  // ==========================================
  // RELATIONAL WORTH (RWO)
  // ==========================================
  {
    id: 'RWO-low',
    key: 'RWO',
    endpoint: 1,
    scoreEffect: -2.25,
    situation: "When looking back at dynamics where someone clearly wasn't matching my investment or commitment level...",
    subtext: "This cuts to the heart of dating fatigue.",
    options: [
      { weight: 1.0, label: "I stayed for months. I routinely minimized my needs and made excuses for them, hoping they'd finally change." },
      { weight: 0.66, label: "I lingered way longer than I should have, trying to optimize the situationship before giving up." },
      { weight: 0.33, label: "I gave them a couple of chances to correct course, but cut it off if the investment remained one-sided." },
      { weight: 0.0, label: "I left immediately. I have a zero-tolerance policy for lukewarm commitment or mixed signals." }
    ]
  },
  {
    id: 'RWO-high',
    key: 'RWO',
    endpoint: 10,
    scoreEffect: 2.25,
    situation: "The moment I explicitly felt like someone was treating me like a backup option rather than a real priority...",
    subtext: "Did you execute a clean break or an emotional negotiation?",
    options: [
      { weight: 1.0, label: "I cleanly cut the connection and walked away without a second thought or looking back." },
      { weight: 0.66, label: "I initiated a firm split, dealing with the heartbreak privately instead of begging for worth." },
      { weight: 0.33, label: "I tried to walk away cleanly, but often got sucked back in by an explanatory text or breadcrumbs." },
      { weight: 0.0, label: "I couldn't just walk. I bargained, over-explained my worth, and held on even while feeling devalued." }
    ]
  }
];

export const relationshipLabels: Record<RelationshipType, string> = {
  best_friend: 'Best Friend',
  roommate: 'Roommate',
  cousin: 'Cousin',
  work_friend: 'Work Friend',
  others: 'Other',
};

export const friendRapidFireQuestions: FriendRapidFireQuestion[] = [
  {
    id: 'friend-CON',
    key: 'CON',
    prompt: 'When [User] gives you an update on their dating life, it usually sounds like...',
    optionA: { score: 1, label: 'An emotional psychological thriller with weekly cliffhangers.' },
    optionB: { score: 10, label: 'A wholesome sitcom - perfectly steady, cozy, and predictable.' },
  },
  {
    id: 'friend-INT',
    key: 'INT',
    prompt: 'Two weeks into seeing someone new, [User] is usually...',
    optionA: { score: 10, label: "Convinced they've met their absolute cosmic soulmate." },
    optionB: { score: 1, label: "Still trying to remember the person's middle name and if a spark exists." },
  },
  {
    id: 'friend-AUT',
    key: 'AUT',
    prompt: "When a relationship gets official, [User]'s presence in the group chat...",
    optionA: { score: 1, label: 'Goes completely radio silent. They disappear into the relationship nebula.' },
    optionB: { score: 10, label: 'Stays exactly the same. They treat their social calendar like sacred text.' },
  },
  {
    id: 'friend-VAL',
    key: 'VAL',
    prompt: 'Honestly, [User] is secretly way more attracted to...',
    optionA: { score: 10, label: 'The mysterious, hard-to-read person everyone at the party wants.' },
    optionB: { score: 1, label: 'The stable, accessible person who treats them like a priority.' },
  },
  {
    id: 'friend-GOC',
    key: 'GOC',
    prompt: 'If their partner does something that hurts their feelings, [User] will...',
    optionA: { score: 1, label: "Vent to you for 3 hours but act completely fine to their partner's face." },
    optionB: { score: 10, label: 'Initiate a mandatory, deep-dive emotional processing meeting with them.' },
  },
  {
    id: 'friend-VUL',
    key: 'VUL',
    prompt: "How easy is it for a new partner to see [User]'s real, raw insecurities?",
    optionA: { score: 1, label: 'Incredibly hard. They keep an elite, unbothered, protective guard up.' },
    optionB: { score: 10, label: 'Extremely easy. They lay their deepest baggage on the table by date three.' },
  },
  {
    id: 'friend-REA',
    key: 'REA',
    prompt: "If their partner leaves them on read or gets moody, [User]'s vibe becomes...",
    optionA: { score: 10, label: "A total nervous system crisis. They spiral until it's fixed." },
    optionB: { score: 1, label: 'Completely unbothered. They keep living their life regardless.' },
  },
  {
    id: 'friend-RWO',
    key: 'RWO',
    prompt: 'When a partner treats them like a secondary option, [User] typically...',
    optionA: { score: 1, label: "Stays way too long, making excuses and hoping they'll change." },
    optionB: { score: 10, label: 'Hits the eject button cleanly and walks away without a second thought.' },
  },
];

export const relationshipContext: Record<RelationshipType, string> = {
  best_friend: 'in the group chat',
  roommate: 'around the apartment',
  cousin: 'in family updates',
  work_friend: 'around work and after-hours plans',
  others: 'from up close',
};
