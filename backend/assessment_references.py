DIMENSION_REFERENCE = [
    {
        "key": "CON",
        "name": "Consistency",
        "left_label": "Erratic/Hot-and-Cold",
        "right_label": "Steady/Predictable",
    },
    {
        "key": "INT",
        "name": "Intensity",
        "left_label": "Slow-Burn",
        "right_label": "High-Speed Whirlwind",
    },
    {
        "key": "AUT",
        "name": "Autonomy",
        "left_label": "Enmeshed/Codependent",
        "right_label": "Fiercely Independent",
    },
    {
        "key": "VAL",
        "name": "Validation-Seeking",
        "left_label": "Character-Driven",
        "right_label": "Status/Trophy-Driven",
    },
    {
        "key": "GOC",
        "name": "Growth/Communication",
        "left_label": "Avoidant/Silent",
        "right_label": "Confronts/Processes",
    },
    {
        "key": "VUL",
        "name": "Vulnerability",
        "left_label": "Guarded/Mysterious",
        "right_label": "Open/Raw",
    },
    {
        "key": "REA",
        "name": "Reactivity",
        "left_label": "Emotionally Sovereign",
        "right_label": "Absorbs Partner's Mood",
    },
    {
        "key": "RWO",
        "name": "Relational Worth",
        "left_label": "Accommodates/Settles",
        "right_label": "Firm Boundaries",
    },
]

IDEAL_QUESTIONS_REFERENCE = [
    {
        "key": "CON",
        "title": "Consistency",
        "scenario": "It's a hectic Tuesday. Your ideal partner's baseline communication looks like...",
        "options": [
            {"score": 1, "label": "Their spontaneity - replies come in bursts, and plans can change fast."},
            {"score": 4, "label": "Their independence - they check in, but their day stays their own."},
            {"score": 7, "label": "Their steadiness - you hear from them in ways that feel easy to trust."},
            {"score": 10, "label": "Their predictability - you always know where you stand without guessing."},
        ],
    },
    {
        "key": "INT",
        "title": "Intensity",
        "scenario": "The feeling you want to experience by the end of date number two is...",
        "options": [
            {"score": 1, "label": "The calm - it feels safe, grounded, and low-pressure."},
            {"score": 4, "label": "The spark - there is clear attraction without pressure to rush."},
            {"score": 7, "label": "The pull - you both want more time together and it is hard to ignore."},
            {"score": 10, "label": "The obsession - electric chemistry keeps you talking until 4 AM."},
        ],
    },
    {
        "key": "AUT",
        "title": "Autonomy",
        "scenario": "It is a completely free Saturday. How are you two spending it?",
        "options": [
            {"score": 1, "label": "The closeness - you do most things as a unit."},
            {"score": 4, "label": "The balance - separate plans still lead back to each other."},
            {"score": 7, "label": "The independence - each of you protects your own routines and people."},
            {"score": 10, "label": "The sovereignty - solo weekends and separate worlds feel natural, not threatening."},
        ],
    },
    {
        "key": "VAL",
        "title": "Validation-Seeking",
        "scenario": "You bring them out to a party with your friends. What makes you feel proudest?",
        "options": [
            {"score": 1, "label": "Their warmth - people are drawn to them and it's effortless."},
            {"score": 4, "label": "Their social ease - they blend in, make good conversation, no awkwardness."},
            {"score": 7, "label": "Their confidence - people notice them, and you notice people noticing."},
            {"score": 10, "label": "That they're rare - the room does not quite know what to make of them yet."},
        ],
    },
    {
        "key": "GOC",
        "title": "Growth & Communication",
        "scenario": "An uncomfortable social tension or misunderstanding happens between you. Your ideal way to resolve it is...",
        "options": [
            {"score": 1, "label": "The reset - you let it cool off and move on without digging."},
            {"score": 4, "label": "The check-in - a quick honest read is enough to feel okay."},
            {"score": 7, "label": "The conversation - you talk through what happened and adjust."},
            {"score": 10, "label": "The deep dive - you unpack the roots until it feels fully understood."},
        ],
    },
    {
        "key": "VUL",
        "title": "Vulnerability",
        "scenario": "When it comes to seeing their raw fears, flaws, and messy emotional side, your preference is...",
        "options": [
            {"score": 1, "label": "The mystery - they stay composed and reveal themselves slowly."},
            {"score": 4, "label": "The pacing - trust builds before the messier parts come out."},
            {"score": 7, "label": "The openness - they can name fears and flaws without making it a performance."},
            {"score": 10, "label": "The rawness - they show the unfiltered version early and directly."},
        ],
    },
    {
        "key": "REA",
        "title": "Emotional Reactivity",
        "scenario": "You walk through the door completely overwhelmed, anxious, and venting about a horrible day. You need them to...",
        "options": [
            {"score": 1, "label": "The anchor - they stay calm and do not absorb your storm."},
            {"score": 4, "label": "The listener - they comfort you while keeping their own mood steady."},
            {"score": 7, "label": "The investment - they feel with you and want to help fix the moment."},
            {"score": 10, "label": "The mirror - they match your emotional volume and get fully pulled in."},
        ],
    },
    {
        "key": "RWO",
        "title": "Relational Worth",
        "scenario": "If your partner gets deeply swept up in a massive career sprint or a personal passion project, what baseline do you claim you require?",
        "options": [
            {"score": 1, "label": "The patience - you can accept being a lower priority during a big season."},
            {"score": 4, "label": "The agreement - scheduled quality time is enough to feel secure."},
            {"score": 7, "label": "The standard - they need to show active effort even when life gets full."},
            {"score": 10, "label": "The boundary - if connection stops being a real priority, you walk."},
        ],
    },
]

ACTUAL_HISTORY_REFERENCE = [
    {
        "id": "CON-low",
        "key": "CON",
        "endpoint": 1,
        "statement": "I spent significant time wondering where I stood, decoding text response times, or waiting for them to make plans.",
    },
    {
        "id": "CON-high",
        "key": "CON",
        "endpoint": 10,
        "statement": "I felt a steady sense of security, knowing exactly when I'd hear from them or see them next without guessing.",
    },
    {
        "id": "INT-high",
        "key": "INT",
        "endpoint": 10,
        "statement": "The connection felt like an absolute whirlwind - constant texting, heavy romantic promises, and deep attachment within the first two weeks.",
    },
    {
        "id": "INT-low",
        "key": "INT",
        "endpoint": 1,
        "statement": "The beginning was quiet and low-pressure, to the point where I secretly worried if there was enough of a 'spark' or chemistry.",
    },
    {
        "id": "AUT-low",
        "key": "AUT",
        "endpoint": 1,
        "statement": "Once we started seeing each other, my friends joke that I completely dropped off the grid and paused my own life.",
    },
    {
        "id": "AUT-high",
        "key": "AUT",
        "endpoint": 10,
        "statement": "Even deep into the connection, we maintained completely separate friend groups, independent hobbies, and solo weekends.",
    },
    {
        "id": "VAL-high",
        "key": "VAL",
        "endpoint": 10,
        "statement": "Winning their attention felt like a major victory because they seemed slightly out of my league, highly sought-after, or socially popular.",
    },
    {
        "id": "VAL-low",
        "key": "VAL",
        "endpoint": 1,
        "statement": "I was drawn to how safe, accessible, and genuinely kind they were, completely separate from their social status or what others thought.",
    },
    {
        "id": "GOC-low",
        "key": "GOC",
        "endpoint": 1,
        "statement": "When things got tense or awkward, one or both of us would go silent, shut down, or pretend everything was totally fine to avoid a fight.",
    },
    {
        "id": "GOC-high",
        "key": "GOC",
        "endpoint": 10,
        "statement": "We actively sat down, had long uncomfortable talks to unpack our feelings, and actually adjusted our real-world behavior afterward.",
    },
    {
        "id": "VUL-low",
        "key": "VUL",
        "endpoint": 1,
        "statement": "Months into dating, I still felt like they were keeping up a cool, polished guard or maintaining a sense of mystery.",
    },
    {
        "id": "VUL-high",
        "key": "VUL",
        "endpoint": 10,
        "statement": "They let me see their raw anxieties, family baggage, or messy emotional moments incredibly early on in the connection.",
    },
    {
        "id": "REA-high",
        "key": "REA",
        "endpoint": 10,
        "statement": "If they sent a blunt text, went quiet for a day, or seemed in a bad mood, my own day was totally derailed and my anxiety spiked.",
    },
    {
        "id": "REA-low",
        "key": "REA",
        "endpoint": 1,
        "statement": "When they pulled back or needed space, I could easily shrug it off and stay fully focused on my own life, friends, and career.",
    },
    {
        "id": "RWO-low",
        "key": "RWO",
        "endpoint": 1,
        "statement": "I've stayed in a situationship or relationship for months, making excuses for their lack of commitment, hoping they'd finally change.",
    },
    {
        "id": "RWO-high",
        "key": "RWO",
        "endpoint": 10,
        "statement": "The moment someone consistently treated me like an option rather than a priority, I cleanly cut the connection and walked away.",
    },
]

SOCIAL_OBSERVATION_REFERENCE = [
    {
        "id": "friend-CON",
        "key": "CON",
        "prompt": "When [User] gives you an update on their dating life, it usually sounds like...",
        "optionA": {"score": 1, "label": "An emotional psychological thriller with weekly cliffhangers."},
        "optionB": {"score": 10, "label": "A wholesome sitcom - perfectly steady, cozy, and predictable."},
    },
    {
        "id": "friend-INT",
        "key": "INT",
        "prompt": "Two weeks into seeing someone new, [User] is usually...",
        "optionA": {"score": 10, "label": "Convinced they've met their absolute cosmic soulmate."},
        "optionB": {"score": 1, "label": "Still trying to remember the person's middle name and if a spark exists."},
    },
    {
        "id": "friend-AUT",
        "key": "AUT",
        "prompt": "When a relationship gets official, [User]'s presence in the group chat...",
        "optionA": {"score": 1, "label": "Goes completely radio silent. They disappear into the relationship nebula."},
        "optionB": {"score": 10, "label": "Stays exactly the same. They treat their social calendar like sacred text."},
    },
    {
        "id": "friend-VAL",
        "key": "VAL",
        "prompt": "Honestly, [User] is secretly way more attracted to...",
        "optionA": {"score": 10, "label": "The mysterious, hard-to-read person everyone at the party wants."},
        "optionB": {"score": 1, "label": "The stable, accessible person who treats them like a priority."},
    },
    {
        "id": "friend-GOC",
        "key": "GOC",
        "prompt": "If their partner does something that hurts their feelings, [User] will...",
        "optionA": {"score": 1, "label": "Vent to you for 3 hours but act completely fine to their partner's face."},
        "optionB": {"score": 10, "label": "Initiate a mandatory, deep-dive emotional processing meeting with them."},
    },
    {
        "id": "friend-VUL",
        "key": "VUL",
        "prompt": "How easy is it for a new partner to see [User]'s real, raw insecurities?",
        "optionA": {"score": 1, "label": "Incredibly hard. They keep an elite, unbothered, protective guard up."},
        "optionB": {"score": 10, "label": "Extremely easy. They lay their deepest baggage on the table by date three."},
    },
    {
        "id": "friend-REA",
        "key": "REA",
        "prompt": "If their partner leaves them on read or gets moody, [User]'s vibe becomes...",
        "optionA": {"score": 10, "label": "A total nervous system crisis. They spiral until it's fixed."},
        "optionB": {"score": 1, "label": "Completely unbothered. They keep living their life regardless."},
    },
    {
        "id": "friend-RWO",
        "key": "RWO",
        "prompt": "When a partner treats them like a secondary option, [User] typically...",
        "optionA": {"score": 1, "label": "Stays way too long, making excuses and hoping they'll change."},
        "optionB": {"score": 10, "label": "Hits the eject button cleanly and walks away without a second thought."},
    },
]
