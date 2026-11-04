import {
  MoodEntry,
  ChatSession,
  ComebackGoal,
  SubjectRecovery,
  AffirmationCard,
  DailyChallenge,
  StudentProfile,
} from '../types';

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Maya',
  gradeLevel: 'Undergraduate',
  avatarId: 'sprout',
  dailyStreak: 4,
  themePreference: 'lavender',
  enableAmbientSounds: true,
  dailyGoalHours: 3.5,
};

export const INITIAL_MOOD_ENTRIES: MoodEntry[] = [
  {
    id: 'm-1',
    date: '2026-11-03',
    time: '21:15',
    mood: 'overwhelmed',
    intensity: 8,
    tags: ['Midterms', 'Sleep Deficit', 'Exams'],
    note: 'Spent 5 hours looking at lecture slides without retaining much. Felt a wave of panic when seeing how much material is left.',
    promptQuestion: 'What took the most energy today?',
  },
  {
    id: 'm-2',
    date: '2026-11-02',
    time: '18:30',
    mood: 'neutral',
    intensity: 5,
    tags: ['Study Group', 'Library'],
    note: 'Worked with Sarah on chemistry problem sets. Not completely confident yet, but better than yesterday.',
    promptQuestion: 'What is one small thing you survived or accomplished?',
  },
  {
    id: 'm-3',
    date: '2026-11-01',
    time: '22:00',
    mood: 'content',
    intensity: 7,
    tags: ['Rest', 'Walk', 'Friends'],
    note: 'Took Sunday evening completely off. Walked through the campus arboretum and called my brother.',
    promptQuestion: 'What gave your mind a moment of peace today?',
  },
  {
    id: 'm-4',
    date: '2026-10-31',
    time: '19:40',
    mood: 'exhausted',
    intensity: 8,
    tags: ['Deadlines', 'All-nighter'],
    note: 'Turned in the lab report at 4 AM. Body feels heavy and eyes hurt.',
    promptQuestion: 'How can you be gentler with your body tonight?',
  },
  {
    id: 'm-5',
    date: '2026-10-30',
    time: '16:20',
    mood: 'radiant',
    intensity: 9,
    tags: ['Quiz Passed', 'Confidence'],
    note: 'Got 88% on the surprise quiz I was dreading! Proves that the comeback method works when I take small steps.',
    promptQuestion: 'What strength surprised you today?',
  },
  {
    id: 'm-6',
    date: '2026-10-29',
    time: '20:10',
    mood: 'neutral',
    intensity: 6,
    tags: ['Reading', 'Routine'],
    note: 'Finished 3 chapters of history reading with the 25/5 gentle pacing timer.',
  },
  {
    id: 'm-7',
    date: '2026-10-28',
    time: '21:00',
    mood: 'content',
    intensity: 7,
    tags: ['Music', 'Good Sleep'],
    note: 'Feeling grounded. Started breaking my assignments into 15-minute micro tasks.',
  },
];

export const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    title: 'Midterm Panic De-escalation',
    date: 'Today',
    preview: "Let's break down the next 20 minutes...",
    messages: [
      {
        id: 'msg-1',
        sender: 'ai',
        text: "Hi Maya, I'm right here with you. Take a slow, unhurried breath. You don't have to fix your entire semester right now. How are you feeling in this exact moment?",
        timestamp: '10:14 AM',
        tone: 'comfort',
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: "I have an Organic Chemistry midterm in 3 days and I feel completely frozen. Every time I open my binder my chest tightens.",
        timestamp: '10:15 AM',
      },
      {
        id: 'msg-3',
        sender: 'ai',
        text: "That chest tightening is your nervous system going into fight-or-flight because it cares deeply about your future. It's not a sign that you're incapable—it's a sign that you're overloaded.\n\nLet's do a 'Lower the Bar' sprint: Instead of studying for 6 hours, can we commit to just opening 1 page of reaction mechanisms and drinking a glass of water? You have full permission to close it after 15 minutes if you need to.",
        timestamp: '10:16 AM',
        tone: 'action',
      },
      {
        id: 'msg-4',
        sender: 'user',
        text: "15 minutes feels doable. I kept thinking I had to pull an all-nighter.",
        timestamp: '10:18 AM',
      },
      {
        id: 'msg-5',
        sender: 'ai',
        text: "All-nighters steal tomorrow's cognition to feed today's panic. Slow and steady retention will serve you much better. I'll be right here when your 15 minutes is up. You are bigger than this exam.",
        timestamp: '10:19 AM',
        tone: 'comfort',
      },
    ],
  },
  {
    id: 'session-2',
    title: 'Imposter Syndrome in Seminars',
    date: 'Yesterday',
    preview: 'Everyone else seems so articulate...',
    messages: [
      {
        id: 'msg-201',
        sender: 'user',
        text: "In my literature seminar, everyone was quoting secondary sources effortlessly and I couldn't speak up once.",
        timestamp: '3:45 PM',
      },
      {
        id: 'msg-202',
        sender: 'ai',
        text: "Comparison in seminars is so painful because you are comparing your messy internal doubts to other people's curated verbal performances. You were accepted into this program because your unique perspective belongs there.",
        timestamp: '3:46 PM',
        tone: 'clarity',
      },
    ],
  },
  {
    id: 'session-3',
    title: 'Sunday Academic Reset',
    date: 'Oct 31',
    preview: 'Setting up an unburdensome week...',
    messages: [
      {
        id: 'msg-301',
        sender: 'ai',
        text: "Happy Sunday reset. Let's make sure your week is designed for a human being, not an industrial machine.",
        timestamp: '6:00 PM',
        tone: 'comfort',
      },
    ],
  },
];

export const CONVERSATION_STARTERS = [
  {
    category: 'Crisis / Freeze',
    prompt: "I feel paralyzed and have so much homework due tonight. Where do I even begin?",
  },
  {
    category: 'Post-Exam Blues',
    prompt: "I just got a terrible grade back and I'm questioning if I'm cut out for this major.",
  },
  {
    category: 'Burnout Recovery',
    prompt: "I've been working non-stop for two weeks and my brain literally feels like static.",
  },
  {
    category: 'Gentle Pacing',
    prompt: "Can you help me design a low-stress 90-minute study recovery plan for today?",
  },
  {
    category: 'Self-Doubt',
    prompt: "Everyone around me seems to have their life and internships figured out except me.",
  },
];

export const INITIAL_COMEBACK_GOALS: ComebackGoal[] = [
  {
    id: 'goal-1',
    title: 'Organic Chemistry Midterm Comeback',
    challengeType: 'Recovering from poor test scores & exam dread',
    targetDate: 'Nov 12, 2026',
    progressPercent: 62,
    emotionalFocus: 'Moving from avoidance to 20-minute daily micro-sprints',
    tasks: [
      {
        id: 't-1',
        title: '3-minute physiological sigh breathing before touching the textbook',
        category: 'grounding',
        energyLevel: 'low',
        completed: true,
        estimatedMinutes: 3,
      },
      {
        id: 't-2',
        title: 'Review Electrophilic Addition reaction diagrams (Chapter 6)',
        category: 'study',
        energyLevel: 'medium',
        completed: true,
        estimatedMinutes: 25,
      },
      {
        id: 't-3',
        title: 'Work through 3 practice problems from Prof. Chen’s worksheet',
        category: 'study',
        energyLevel: 'high',
        completed: false,
        estimatedMinutes: 30,
      },
      {
        id: 't-4',
        title: 'Drink 500ml water and step away from laptop for 10 min',
        category: 'selfcare',
        energyLevel: 'low',
        completed: true,
        estimatedMinutes: 10,
      },
      {
        id: 't-5',
        title: 'Flashcard review of functional groups before sleep (no screen)',
        category: 'winddown',
        energyLevel: 'low',
        completed: false,
        estimatedMinutes: 15,
      },
    ],
  },
  {
    id: 'goal-2',
    title: 'Calculus II Attendance & Confidence Reboot',
    challengeType: 'Overcoming lecture anxiety & missed classes',
    targetDate: 'Nov 20, 2026',
    progressPercent: 40,
    emotionalFocus: 'Forgiving past absences and stepping back into the lecture hall',
    tasks: [
      {
        id: 't-201',
        title: 'Email teaching assistant for lecture slide notes without shame',
        category: 'study',
        energyLevel: 'medium',
        completed: true,
        estimatedMinutes: 10,
      },
      {
        id: 't-202',
        title: 'Watch 1 Khan Academy video on Integration by Parts',
        category: 'study',
        energyLevel: 'low',
        completed: true,
        estimatedMinutes: 18,
      },
      {
        id: 't-203',
        title: 'Pack backpack the night before so morning departure is peaceful',
        category: 'winddown',
        energyLevel: 'low',
        completed: false,
        estimatedMinutes: 5,
      },
    ],
  },
];

export const INITIAL_SUBJECTS: SubjectRecovery[] = [
  {
    id: 'sub-1',
    name: 'Organic Chemistry I',
    code: 'CHEM 230',
    color: '#8B5CF6',
    examDate: '2026-11-12',
    targetScoreGrade: 'B+ or solid pass',
    topics: [
      { id: 'top-1', name: 'Alkanes & Conformations', status: 'mastered' },
      { id: 'top-2', name: 'Stereochemistry (R/S)', status: 'in_progress' },
      { id: 'top-3', name: 'Alkenes: Reaction Mechanisms', status: 'needs_review' },
      { id: 'top-4', name: 'SN1 vs SN2 Substitution', status: 'needs_review' },
      { id: 'top-5', name: 'NMR & IR Spectroscopy', status: 'in_progress' },
    ],
  },
  {
    id: 'sub-2',
    name: 'Calculus & Linear Algebra',
    code: 'MATH 152',
    color: '#EC4899',
    examDate: '2026-11-19',
    targetScoreGrade: 'Pass with confidence',
    topics: [
      { id: 'top-21', name: 'Integration by Parts', status: 'mastered' },
      { id: 'top-22', name: 'Trig Substitutions', status: 'in_progress' },
      { id: 'top-23', name: 'Improper Integrals', status: 'needs_review' },
      { id: 'top-24', name: 'Sequences & Series Convergence', status: 'needs_review' },
    ],
  },
  {
    id: 'sub-3',
    name: 'Modern World History',
    code: 'HIST 110',
    color: '#10B981',
    examDate: '2026-12-04',
    targetScoreGrade: 'A-',
    topics: [
      { id: 'top-31', name: 'Industrial Revolution Impacts', status: 'mastered' },
      { id: 'top-32', name: 'Imperialism & Decolonization', status: 'mastered' },
      { id: 'top-33', name: 'Cold War Geopolitics Essay', status: 'in_progress' },
    ],
  },
];

export const AFFIRMATIONS: AffirmationCard[] = [
  {
    id: 'aff-1',
    text: "A single bad grade is a snapshot of one Tuesday afternoon. It is never the verdict on your intellect or your future.",
    category: 'failure',
    author: 'Soothely Reminder',
    bookmarked: true,
  },
  {
    id: 'aff-2',
    text: "Rest is not a reward you have to earn after collapsing. Rest is a biological prerequisite for learning.",
    category: 'burnout',
    author: 'Student Wellness Principle',
    bookmarked: false,
  },
  {
    id: 'aff-3',
    text: "You do not need to feel inspired to start. Action precedes motivation. Just 5 minutes is enough to break the spell.",
    category: 'growth',
    author: 'Atomic Habits Philosophy',
    bookmarked: true,
  },
  {
    id: 'aff-4',
    text: "Nobody has it as figured out as they appear on Instagram or in seminar halls. Be patient with your unfolding.",
    category: 'comparison',
    author: 'Campus Whisper',
    bookmarked: false,
  },
  {
    id: 'aff-5',
    text: "Your brain cannot encode memories when flooded with cortisol. Taking a breath right now is an act of study preparation.",
    category: 'anxiety',
    author: 'Cognitive Science',
    bookmarked: true,
  },
  {
    id: 'aff-6',
    text: "The greatest comebacks in human history always started quietly on an ordinary day when someone said: 'Let me try one small thing.'",
    category: 'growth',
    author: 'Soothely Companion',
    bookmarked: false,
  },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'dc-1',
    title: 'The 3-Minute Window Gaze',
    description: 'Look out a window into the distance for 180 seconds to relax your ciliary optical muscles and reset dopamine.',
    duration: '3 min',
    completed: true,
  },
  {
    id: 'dc-2',
    title: 'Hydration Anchor',
    description: 'Drink a full glass of cool water before opening your study software or books.',
    duration: '1 min',
    completed: true,
  },
  {
    id: 'dc-3',
    title: 'The Forgiveness Sentence',
    description: 'Write down one task you didn’t finish yesterday, and write next to it: "It is okay. I start fresh today."',
    duration: '2 min',
    completed: false,
  },
  {
    id: 'dc-4',
    title: 'Digital Sunset at 11:00 PM',
    description: 'Switch off bright blue-light screens 30 minutes before sleep and read fiction or stretch.',
    duration: '30 min',
    completed: false,
  },
];

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    number: 'Call or text 988',
    detail: 'Free, confidential support 24/7 in the US and Canada.',
    url: 'https://988lifeline.org',
  },
  {
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    detail: 'Connect with a crisis counselor 24/7 via text message.',
    url: 'https://www.crisistextline.org',
  },
  {
    name: 'The Trevor Project',
    number: 'Call 1-866-488-7386 or text START to 678-678',
    detail: 'Confidential suicide prevention and crisis intervention for LGBTQ+ young people.',
    url: 'https://www.thetrevorproject.org',
  },
  {
    name: 'International Helplines',
    number: 'Find your country',
    detail: 'Global resources for students outside the US through Befrienders Worldwide.',
    url: 'https://www.befrienders.org',
  },
];

export const DAILY_QUOTES = [
  {
    quote: "You don't have to see the whole staircase, just take the first step.",
    author: "Martin Luther King Jr.",
  },
  {
    quote: "Almost everything will work again if you unplug it for a few minutes, including you.",
    author: "Anne Lamott",
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "Be gentle with yourself. You're doing the best you can with the energy you have today.",
    author: "Soothely AI",
  },
];
