export type PillarId = 'striking' | 'grappling' | 'weaponTransitions';

export interface CombatSkillPillar {
  id: PillarId;
  name: string;
  description: string;
  xp: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progressPercent: number;
  lastPracticedDate?: string;
  daysWithoutPractice: number;
  rustyFlag: boolean;
}

export interface CombatDrill {
  id: string;
  name: string;
  pillar: PillarId;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  prerequisites: string[];
  injuryTags: string[]; // ['shoulder', 'knee', 'wrist', 'back']
  incompatibleInjuries: string[];
  description: string;
  steps: { order: number; instruction: string; tip: string }[];
  formChecklist: { item: string; checked?: boolean }[];
  commonMistakes: string[];
  sets?: number;
  reps?: number;
  duration?: number; // seconds
  restBetweenSets?: number;
  equipment?: string[];
  terrainTags: string[];
}

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'scenario';
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface MicroLesson {
  id: string;
  pillar: PillarId;
  title: string;
  concept: string;
  drillIds: string[];
  quiz: QuizQuestion[];
}

export interface DecisionChoice {
  action: string;
  nextNodeId: string;
  riskModifier: number;
  drillsRelevant: string[];
}

export interface DecisionNode {
  id: string;
  scenarioText: string;
  choices: DecisionChoice[];
  damageAccumulation: number;
}

export interface CombatScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  pillar: PillarId;
  initialCondition: string;
  nodes: Record<string, DecisionNode>;
  successCriteria: string;
}

export interface CombatProgressState {
  pillars: Record<PillarId, CombatSkillPillar>;
  completedDrills: { drillId: string; date: string; rating: number }[];
  completedLessons: { lessonId: string; quizScore: number; date: string }[];
  completedScenarios: { scenarioId: string; outcome: string; date: string }[];
}

export const COMBAT_DRILLS: CombatDrill[] = [
  {
    id: "clinch-knee-beginner",
    name: "Clinch Knee Engine – Beginner",
    pillar: "striking",
    difficulty: "Beginner",
    prerequisites: [],
    injuryTags: ["knee", "back"],
    incompatibleInjuries: ["knee"],
    description: "The fundamental engine for close-quarters dominance. Enter, control, and strike.",
    steps: [
      { order: 1, instruction: "Enter the clinch with high guard.", tip: "Protect your chin during entry." },
      { order: 2, instruction: "Secure the plum (double neck tie).", tip: "Elbows in, pull their head into your chest." },
      { order: 3, instruction: "Off-balance the opponent with a pull-push motion.", tip: "Use your core, not just your arms." },
      { order: 4, instruction: "Drive the knee upward into the midsection.", tip: "Point your toes down to harden the knee." }
    ],
    formChecklist: [
      { item: "Chin tucked during entry" },
      { item: "Elbows tight in clinch" },
      { item: "Opponent off-balanced before strike" },
      { item: "Toe pointed during knee" }
    ],
    commonMistakes: [
      "Leaning back too far during the knee",
      "Loose grip on the neck",
      "Telegraphing the entry"
    ],
    sets: 3,
    reps: 15,
    equipment: ["Heavy bag or partner"],
    terrainTags: ["Flat", "Mat"]
  },
  {
    id: "explosive-combo-intermediate",
    name: "Explosive Combo Chain – Intermediate",
    pillar: "striking",
    difficulty: "Intermediate",
    prerequisites: ["clinch-knee-beginner"],
    injuryTags: ["shoulder", "knee"],
    incompatibleInjuries: ["shoulder"],
    description: "A high-intensity striking sequence transitioning from long range to clinch range.",
    steps: [
      { order: 1, instruction: "Throw a sharp Jab-Cross combination.", tip: "Snap the punches back to guard." },
      { order: 2, instruction: "Step in deep with the Cross.", tip: "Close the distance immediately." },
      { order: 3, instruction: "Transition into a single-collar clinch.", tip: "Use the non-punching hand to hook the neck." },
      { order: 4, instruction: "Deliver a power knee followed by an elbow.", tip: "Rotate the hips for the elbow strike." }
    ],
    formChecklist: [
      { item: "Full extension on punches" },
      { item: "Seamless transition to clinch" },
      { item: "Power generated from hip rotation" }
    ],
    commonMistakes: [
      "Dropping the guard during the step-in",
      "Pausing between the cross and the clinch",
      "Lack of hip engagement"
    ],
    sets: 5,
    duration: 60,
    restBetweenSets: 30,
    terrainTags: ["Any"]
  },
  {
    id: "frame-space-beginner",
    name: "Frame & Space – Beginner",
    pillar: "grappling",
    difficulty: "Beginner",
    prerequisites: [],
    injuryTags: ["wrist", "shoulder"],
    incompatibleInjuries: ["wrist"],
    description: "Essential survival grappling. Using skeletal structure to prevent being crushed.",
    steps: [
      { order: 1, instruction: "Establish frames using your forearms.", tip: "Keep your elbows close to your ribs." },
      { order: 2, instruction: "Maintain a strong posture with a straight spine.", tip: "Don't let them pull your head down." },
      { order: 3, instruction: "Use a 'shrimp' (hip escape) to create space.", tip: "Push off the floor with your feet." },
      { order: 4, instruction: "Regain a neutral or dominant position.", tip: "Never stop moving until you have space." }
    ],
    formChecklist: [
      { item: "Frames are skeletal, not muscular" },
      { item: "Elbows tucked" },
      { item: "Hip escape effective" }
    ],
    commonMistakes: [
      "Pushing with flat palms (weak)",
      "Flat back on the ground",
      "Holding breath under pressure"
    ],
    sets: 4,
    duration: 45,
    restBetweenSets: 15,
    terrainTags: ["Soft ground", "Mat"]
  },
  {
    id: "standup-escape-intermediate",
    name: "Stand-Up Escape – Intermediate",
    pillar: "grappling",
    difficulty: "Intermediate",
    prerequisites: ["frame-space-beginner"],
    injuryTags: ["knee", "back"],
    incompatibleInjuries: ["back"],
    description: "The most important grappling skill: getting back to your feet safely.",
    steps: [
      { order: 1, instruction: "Create a frame and clear a path for your legs.", tip: "Use your feet to push their weight off." },
      { order: 2, instruction: "Technical stand-up: one hand and opposite foot on floor.", tip: "Keep your other hand up to protect your face." },
      { order: 3, instruction: "Swing your bottom leg back and through.", tip: "Don't turn your back to the opponent." },
      { order: 4, instruction: "Establish base and create distance immediately.", tip: "Be ready to strike or move." }
    ],
    formChecklist: [
      { item: "Face protected during stand-up" },
      { item: "No back turned to opponent" },
      { item: "Immediate distance creation" }
    ],
    commonMistakes: [
      "Standing up straight (vulnerable to tackle)",
      "Looking at the ground",
      "Slow leg transition"
    ],
    sets: 5,
    reps: 10,
    terrainTags: ["Any"]
  },
  {
    id: "draw-engage-beginner",
    name: "Draw & Engage – Beginner",
    pillar: "weaponTransitions",
    difficulty: "Beginner",
    prerequisites: [],
    injuryTags: ["wrist"],
    incompatibleInjuries: [],
    description: "The bridge between empty hand and tool. Speed and safety in the draw.",
    steps: [
      { order: 1, instruction: "Establish a solid stance.", tip: "Balance is key before the draw." },
      { order: 2, instruction: "Clear the garment/obstruction with the off-hand.", tip: "One hand clears, one hand draws." },
      { order: 3, instruction: "Secure a full master grip on the handle.", tip: "Index finger high for control." },
      { order: 4, instruction: "Draw and bring the tool to a ready position.", tip: "Keep the edge away from your own body." }
    ],
    formChecklist: [
      { item: "Clean draw without snagging" },
      { item: "Master grip established immediately" },
      { item: "Off-hand safe and out of path" }
    ],
    commonMistakes: [
      "Fumbling the grip",
      "Looking at the sheath (keep eyes on threat)",
      "Drawing with a loose wrist"
    ],
    sets: 10,
    reps: 1,
    equipment: ["Machete or training blade", "Sheath"],
    terrainTags: ["Any"]
  },
  {
    id: "empty-to-blade-intermediate",
    name: "Empty-to-Blade Switch – Intermediate",
    pillar: "weaponTransitions",
    difficulty: "Intermediate",
    prerequisites: ["draw-engage-beginner"],
    injuryTags: ["shoulder", "wrist"],
    incompatibleInjuries: [],
    description: "Using empty-hand strikes to create the window for a weapon draw.",
    steps: [
      { order: 1, instruction: "Engage with a heavy lead-hand strike (palm or hook).", tip: "Disrupt their vision and balance." },
      { order: 2, instruction: "Simultaneously reach for the weapon with the rear hand.", tip: "The strike hides the draw." },
      { order: 3, instruction: "Deploy the weapon while maintaining contact with the off-hand.", tip: "Control the opponent's arm if possible." },
      { order: 4, instruction: "Deliver a follow-up strike with the weapon.", tip: "Flow directly from the draw into the cut." }
    ],
    formChecklist: [
      { item: "Strike and draw are synchronized" },
      { item: "Opponent controlled during draw" },
      { item: "Fluid transition to weapon strike" }
    ],
    commonMistakes: [
      "Stopping the strike to focus on the draw",
      "Losing balance during the transition",
      "Weapon snagging on clothing"
    ],
    sets: 5,
    reps: 5,
    equipment: ["Training blade", "Sheath"],
    terrainTags: ["Any"]
  }
];

export const MICRO_LESSONS: MicroLesson[] = [
  {
    id: "angles-clinch",
    pillar: "striking",
    title: "Angles in Clinch",
    concept: "In the clinch, standing directly in front of your opponent is a 50/50 fight. By creating an angle, you take away their weapons while doubling the power of your own. Use your head and shoulders to steer their posture.",
    drillIds: ["clinch-knee-beginner"],
    quiz: [
      {
        id: "q1",
        type: "single",
        question: "What is the primary benefit of creating an angle in the clinch?",
        options: [
          { id: "a", text: "It looks more technical", correct: false },
          { id: "b", text: "It takes away the opponent's weapons and increases your power", correct: true },
          { id: "c", text: "It allows you to rest", correct: false }
        ],
        explanation: "Angles disrupt the opponent's alignment, making it harder for them to strike while opening up clear paths for your knees and elbows."
      },
      {
        id: "q2",
        type: "scenario",
        question: "You have secured the plum clinch, but the opponent is strong and driving their head into your chest. What should you do?",
        options: [
          { id: "a", text: "Push them away and reset", correct: false },
          { id: "b", text: "Pull their head down harder", correct: false },
          { id: "c", text: "Step to the side and pull their head toward your hip", correct: true }
        ],
        explanation: "Steering their head toward your hip breaks their posture and creates the angle needed for a devastating knee strike."
      }
    ]
  },
  {
    id: "survival-grappling-mindset",
    pillar: "grappling",
    title: "Survival Grappling Mindset",
    concept: "On the ground, your goal isn't to win a match—it's to get back to your feet. Every second on the ground is a second you are vulnerable to multiple attackers or environmental hazards. Focus on frames, space, and the technical stand-up.",
    drillIds: ["frame-space-beginner", "standup-escape-intermediate"],
    quiz: [
      {
        id: "g1",
        type: "single",
        question: "What is the 'Golden Rule' of survival grappling?",
        options: [
          { id: "a", text: "Submit the opponent as fast as possible", correct: false },
          { id: "b", text: "Get back to your feet safely", correct: true },
          { id: "c", text: "Wait for help to arrive", correct: false }
        ],
        explanation: "In a real-world scenario, the ground is the most dangerous place to be. Your priority is always standing up."
      }
    ]
  },
  {
    id: "weapon-readiness",
    pillar: "weaponTransitions",
    title: "Weapon Readiness",
    concept: "A tool is useless if you can't deploy it under pressure. Readiness means your draw is instinctive, your grip is perfect every time, and you can transition from empty hand to tool without missing a beat.",
    drillIds: ["draw-engage-beginner", "empty-to-blade-switch-intermediate"],
    quiz: [
      {
        id: "w1",
        type: "single",
        question: "Where should your eyes be during a weapon draw?",
        options: [
          { id: "a", text: "On the sheath to ensure a clean draw", correct: false },
          { id: "b", text: "On the threat", correct: true },
          { id: "c", text: "On your own feet for balance", correct: false }
        ],
        explanation: "Looking at your sheath takes your eyes off the threat. The draw must be practiced until it is purely tactile."
      }
    ]
  }
];

export const COMBAT_SCENARIOS: CombatScenario[] = [
  {
    id: "alleyway-ambush",
    title: "Alleyway Ambush",
    description: "You are cornered in a narrow space by a single aggressor. They are closing the distance fast.",
    difficulty: "Beginner",
    pillar: "striking",
    initialCondition: "Aggressor is 2 meters away, shouting and moving in.",
    successCriteria: "Create space or neutralize the threat without taking significant damage.",
    nodes: {
      "start": {
        id: "start",
        scenarioText: "The aggressor lunges forward with a wild punch. What is your move?",
        choices: [
          { action: "Step back and try to talk them down", nextNodeId: "hit", riskModifier: 0.8, drillsRelevant: [] },
          { action: "Cover up and clinch immediately", nextNodeId: "clinch", riskModifier: 0.2, drillsRelevant: ["clinch-knee-beginner"] },
          { action: "Throw a counter punch", nextNodeId: "trade", riskModifier: 0.5, drillsRelevant: [] }
        ],
        damageAccumulation: 0
      },
      "hit": {
        id: "hit",
        scenarioText: "They were too fast. The punch lands on your shoulder, knocking you off balance. They are now grabbing your shirt. What now?",
        choices: [
          { action: "Establish frames and push away", nextNodeId: "space", riskModifier: 0.3, drillsRelevant: ["frame-space-beginner"] },
          { action: "Pull them into a clinch", nextNodeId: "clinch", riskModifier: 0.2, drillsRelevant: ["clinch-knee-beginner"] }
        ],
        damageAccumulation: 15
      },
      "clinch": {
        id: "clinch",
        scenarioText: "You have secured the clinch. They are struggling and trying to hit your ribs. How do you end this?",
        choices: [
          { action: "Drive knees into the midsection", nextNodeId: "win", riskModifier: 0.1, drillsRelevant: ["clinch-knee-beginner"] },
          { action: "Try to trip them to the ground", nextNodeId: "ground", riskModifier: 0.4, drillsRelevant: [] }
        ],
        damageAccumulation: 5
      },
      "win": {
        id: "win",
        scenarioText: "The knees land perfectly. The aggressor doubles over, gasping for air. You push them away and exit the alley safely.",
        choices: [],
        damageAccumulation: 0
      },
      "ground": {
        id: "ground",
        scenarioText: "You both fall to the ground. It's concrete and it hurts. They are on top of you. This is bad.",
        choices: [
          { action: "Use frames to create space and technical stand-up", nextNodeId: "win", riskModifier: 0.2, drillsRelevant: ["frame-space-beginner", "standup-escape-intermediate"] }
        ],
        damageAccumulation: 25
      },
      "trade": {
        id: "trade",
        scenarioText: "You both land punches. Your lip is bleeding, but they are stunned. They lung again.",
        choices: [
          { action: "Clinch and finish", nextNodeId: "clinch", riskModifier: 0.1, drillsRelevant: ["clinch-knee-beginner"] }
        ],
        damageAccumulation: 20
      }
    }
  }
];
