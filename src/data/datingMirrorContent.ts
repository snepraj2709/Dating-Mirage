import type {
  Dimension,
  DimensionKey,
  FriendRapidFireQuestion,
  QuadrantDetail,
  RelationshipType,
  SliderQuestion,
  SwipeStatement,
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
  { key: 'GOC', name: 'Growth/Comm', leftLabel: 'Avoidant/Silent', rightLabel: 'Confronts/Processes' },
  { key: 'VUL', name: 'Vulnerability', leftLabel: 'Guarded/Mysterious', rightLabel: 'Open/Raw' },
  { key: 'REA', name: 'Reactivity', leftLabel: 'Emotionally Sovereign', rightLabel: "Absorbs Partner's Mood" },
  { key: 'RWO', name: 'Relational Worth', leftLabel: 'Accommodates/Settles', rightLabel: 'Firm Boundaries' },
];

export const sliderQuestions: SliderQuestion[] = [
  {
    key: 'CON',
    title: 'Consistency',
    scenario: "It's a hectic Tuesday. Your ideal partner's baseline communication looks like...",
    leftAnchor:
      'Spontaneous and erratic. They might drop off the grid for 8 hours, but they surprise me with a wild late-night plan.',
    centerAnchor:
      'Steady but independent. Balanced check-ins throughout the day, but their primary focus is their work.',
    rightAnchor:
      'Highly predictable. Regular, comforting updates; I always know exactly where I stand with them.',
  },
  {
    key: 'INT',
    title: 'Intensity',
    scenario: 'The feeling you want to experience by the end of date number two is...',
    leftAnchor:
      'A calm, comfortable, easy burn. It feels safe, grounded, and low-pressure - like catching up with an old friend.',
    centerAnchor: 'Engaging and clear. Solid physical attraction mixed with easy, laughing conversation flow.',
    rightAnchor: 'An all-consuming whirlwind. Electric, magnetic chemistry that keeps us up talking until 4 AM.',
  },
  {
    key: 'AUT',
    title: 'Autonomy',
    scenario: 'It is a completely free Saturday. How are you two spending it?',
    leftAnchor: 'Glued at the hip. Errands, gym, cooking - we do absolutely everything as a joint unit.',
    centerAnchor:
      'Connected flexibility. Separate hobbies or friend hangouts during the day, meeting back up for date night.',
    rightAnchor:
      'Total personal sovereignty. They go on a weekend trip with their friends while I relish having the entire house to myself.',
  },
  {
    key: 'VAL',
    title: 'Validation-Seeking',
    scenario: 'You bring them out to a party with your friends. What makes you feel proudest?',
    leftAnchor: 'How warm, unassuming, and deeply attentive they are to the people around them.',
    centerAnchor: 'Their easy social confidence; they blend in seamlessly and make great small talk.',
    rightAnchor:
      'Their undeniable magnetism. They are high-status, striking, or hard-to-attain; everyone wants to know who they are.',
  },
  {
    key: 'GOC',
    title: 'Growth & Communication',
    scenario: 'An uncomfortable social tension or misunderstanding happens between you. Your ideal way to resolve it is...',
    leftAnchor: 'Let it drop. We sleep it off, and it naturally evaporates by morning without digging it back up.',
    centerAnchor: "A quick temperature check. A brief 'We good?' 'Yeah, we're good,' and we move past it.",
    rightAnchor: 'A deep dive. We sit down immediately, unpack the emotional root causes, and process it completely.',
  },
  {
    key: 'VUL',
    title: 'Vulnerability',
    scenario: 'When it comes to seeing their raw fears, flaws, and messy emotional side, your preference is...',
    leftAnchor:
      'A slow, highly protected burn. I want them to maintain a cool, composed, slightly mysterious edge for a long time.',
    centerAnchor: 'Natural pacing. Peeling back the defensive layers gradually over several months as trust builds.',
    rightAnchor: 'Raw transparency on day one. Show me your baggage, your anxieties, and your real self immediately.',
  },
  {
    key: 'REA',
    title: 'Emotional Reactivity',
    scenario: 'You walk through the door completely overwhelmed, anxious, and venting about a horrible day. You need them to...',
    leftAnchor: 'Be an unshakeable anchor. Stay perfectly calm, objective, and detached from my emotional storm.',
    centerAnchor: 'Be a supportive listener. Offer comfort and a sounding board while keeping their own mood steady.',
    rightAnchor:
      'Be an emotional mirror. Absorb my mood, match my high energy, and get passionately invested in the situation alongside me.',
  },
  {
    key: 'RWO',
    title: 'Relational Worth',
    scenario:
      'If your partner gets deeply swept up in a massive career sprint or a personal passion project, what baseline do you claim you require?',
    leftAnchor:
      'Complete understanding. I am fine being a lower priority or taking a back seat while they chase their dreams.',
    centerAnchor:
      'A compromise. As long as we have structured, scheduled quality time once or twice a week, I feel secure.',
    rightAnchor:
      "Uncompromised priority. If they can't actively maintain our connection as a front-row focus, I am walking away.",
  },
];

export const swipeStatements: SwipeStatement[] = [
  {
    id: 'CON-low',
    key: 'CON',
    endpoint: 1,
    scoreEffect: -2.25,
    statement:
      'I spent significant time wondering where I stood, decoding text response times, or waiting for them to make plans.',
    swipeRightLabel: 'CON maps toward 1.0',
  },
  {
    id: 'CON-high',
    key: 'CON',
    endpoint: 10,
    scoreEffect: 2.25,
    statement: "I felt a steady sense of security, knowing exactly when I'd hear from them or see them next without guessing.",
    swipeRightLabel: 'CON maps toward 10.0',
  },
  {
    id: 'INT-high',
    key: 'INT',
    endpoint: 10,
    scoreEffect: 2.25,
    statement:
      'The connection felt like an absolute whirlwind - constant texting, heavy romantic promises, and deep attachment within the first two weeks.',
    swipeRightLabel: 'INT maps toward 10.0',
  },
  {
    id: 'INT-low',
    key: 'INT',
    endpoint: 1,
    scoreEffect: -2.25,
    statement:
      "The beginning was quiet and low-pressure, to the point where I secretly worried if there was enough of a 'spark' or chemistry.",
    swipeRightLabel: 'INT maps toward 1.0',
  },
  {
    id: 'AUT-low',
    key: 'AUT',
    endpoint: 1,
    scoreEffect: -2.25,
    statement: 'Once we started seeing each other, my friends joke that I completely dropped off the grid and paused my own life.',
    swipeRightLabel: 'AUT maps toward 1.0',
  },
  {
    id: 'AUT-high',
    key: 'AUT',
    endpoint: 10,
    scoreEffect: 2.25,
    statement: 'Even deep into the connection, we maintained completely separate friend groups, independent hobbies, and solo weekends.',
    swipeRightLabel: 'AUT maps toward 10.0',
  },
  {
    id: 'VAL-high',
    key: 'VAL',
    endpoint: 10,
    scoreEffect: 2.25,
    statement:
      'Winning their attention felt like a major victory because they seemed slightly out of my league, highly sought-after, or socially popular.',
    swipeRightLabel: 'VAL maps toward 10.0',
  },
  {
    id: 'VAL-low',
    key: 'VAL',
    endpoint: 1,
    scoreEffect: -2.25,
    statement:
      'I was drawn to how safe, accessible, and genuinely kind they were, completely separate from their social status or what others thought.',
    swipeRightLabel: 'VAL maps toward 1.0',
  },
  {
    id: 'GOC-low',
    key: 'GOC',
    endpoint: 1,
    scoreEffect: -2.25,
    statement:
      'When things got tense or awkward, one or both of us would go silent, shut down, or pretend everything was totally fine to avoid a fight.',
    swipeRightLabel: 'GOC maps toward 1.0',
  },
  {
    id: 'GOC-high',
    key: 'GOC',
    endpoint: 10,
    scoreEffect: 2.25,
    statement:
      'We actively sat down, had long uncomfortable talks to unpack our feelings, and actually adjusted our real-world behavior afterward.',
    swipeRightLabel: 'GOC maps toward 10.0',
  },
  {
    id: 'VUL-low',
    key: 'VUL',
    endpoint: 1,
    scoreEffect: -2.25,
    statement: 'Months into dating, I still felt like they were keeping up a cool, polished guard or maintaining a sense of mystery.',
    swipeRightLabel: 'VUL maps toward 1.0',
  },
  {
    id: 'VUL-high',
    key: 'VUL',
    endpoint: 10,
    scoreEffect: 2.25,
    statement: 'They let me see their raw anxieties, family baggage, or messy emotional moments incredibly early on in the connection.',
    swipeRightLabel: 'VUL maps toward 10.0',
  },
  {
    id: 'REA-high',
    key: 'REA',
    endpoint: 10,
    scoreEffect: 2.25,
    statement:
      'If they sent a blunt text, went quiet for a day, or seemed in a bad mood, my own day was totally derailed and my anxiety spiked.',
    swipeRightLabel: 'REA maps toward 10.0',
  },
  {
    id: 'REA-low',
    key: 'REA',
    endpoint: 1,
    scoreEffect: -2.25,
    statement:
      'When they pulled back or needed space, I could easily shrug it off and stay fully focused on my own life, friends, and career.',
    swipeRightLabel: 'REA maps toward 1.0',
  },
  {
    id: 'RWO-low',
    key: 'RWO',
    endpoint: 1,
    scoreEffect: -2.25,
    statement:
      "I've stayed in a situationship or relationship for months, making excuses for their lack of commitment, hoping they'd finally change.",
    swipeRightLabel: 'RWO maps toward 1.0',
  },
  {
    id: 'RWO-high',
    key: 'RWO',
    endpoint: 10,
    scoreEffect: 2.25,
    statement:
      'The moment someone consistently treated me like an option rather than a priority, I cleanly cut the connection and walked away.',
    swipeRightLabel: 'RWO maps toward 10.0',
  },
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

export const quadrantDetails: Record<string, QuadrantDetail> = {
  'guilty-pleasure': {
    icon: '🍿',
    title: 'The Guilty Pleasure',
    badge: 'Guilty Secret',
    description: "You know the pattern is messy, your friends can see it too, and somehow it still has a reserved seat in your love life.",
    vibe: "You are not confused. You're just negotiating with the part of you that likes the chaos.",
  },
  'total-disconnect': {
    icon: '🪞',
    title: 'The Total Disconnect',
    badge: 'Mirror Shock',
    description: "You know your choices are drifting from your standards, but the social mirror says the gap is louder than you think.",
    vibe: 'This is the part where the group chat gently takes the wheel.',
  },
  'true-blindspot': {
    icon: '🎭',
    title: 'The True Blind Spot',
    badge: 'Unconscious Pattern',
    description: "You think your behavior matches your ideal, but people close to you are seeing a very different edit.",
    vibe: 'The plot twist was visible to everyone sitting in the front row.',
  },
  aligned: {
    icon: '💗',
    title: 'The Aligned State',
    badge: 'Vibe Alignment',
    description: 'What you want, what you choose, and what your friends observe are finally speaking the same language.',
    vibe: 'No major contradiction here. The mirror is mostly behaving.',
  },
};

export const relationshipContext: Record<RelationshipType, string> = {
  best_friend: 'in the group chat',
  roommate: 'around the apartment',
  cousin: 'in family updates',
  work_friend: 'around work and after-hours plans',
  others: 'from up close',
};

