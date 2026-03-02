export interface Scenario {
  id: string;
  phase: number;
  title: string;
  objective: string;
  duration: string;
  tools: string[];
  successCriteria: string;
  variants: string[];
  tips: string;
}

export interface Plant {
  name: string;
  season: string;
  identification: string;
  edibleParts: string;
  harvest: string;
  uses: string;
}

export interface EmergencyProtocol {
  title: string;
  steps: string[];
}

export interface CombatCourse {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videos: {
    id: string;
    title: string;
    duration: string;
    description: string;
    url: string;
    prerequisite?: string;
  }[];
}

export interface RecoveryProtocol {
  id: string;
  title: string;
  routine: string[];
  tips: string[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "safe-carry",
    phase: 1,
    title: "Safe Carry Drill",
    objective: "Carry machete and staff 500m through training area without dropping or unsafe handling",
    duration: "15 min",
    tools: ["Machete", "Staff"],
    successCriteria: "Complete distance with proper carry position, no safety violations",
    variants: ["Increase distance (1km, 2km)", "Add uneven terrain", "Add obstacles"],
    tips: "Emphasize safety over speed. Correct grip and carry position immediately."
  },
  {
    id: "plant-id-walk",
    phase: 1,
    title: "Plant Identification Walk",
    objective: "Walk 1km through forest/field, identify and document 5 edible plants",
    duration: "30 min",
    tools: ["Notebook", "Knife"],
    successCriteria: "Correctly identify 5 plants, document location and characteristics",
    variants: ["Increase number of plants (10, 15)", "Add medicinal plants"],
    tips: "Start with common, easy-to-identify plants. Never consume unless 100% certain."
  },
  {
    id: "breath-under-pressure",
    phase: 1,
    title: "Breath Under Pressure",
    objective: "Shadowbox for 5 min at high intensity, then return to calm breath within 2 min",
    duration: "10 min",
    tools: ["Timer"],
    successCriteria: "Heart rate returns to near-resting within 2 min, breath is controlled",
    variants: ["Increase shadowboxing duration", "Add burpees before breath work"],
    tips: "Trains the ability to shift from 'fight' state to 'calm' state quickly."
  },
  {
    id: "scout-mission",
    phase: 2,
    title: "Scout Mission",
    objective: "Move 2km through forest/field, identify 5 edible plants, return without being 'detected'",
    duration: "45-60 min",
    tools: ["Machete", "Knife", "Notebook"],
    successCriteria: "Complete route, identify plants correctly, move quietly",
    variants: ["Increase distance", "Add time limit", "Add 'enemy'"],
    tips: "Integrates movement, plant knowledge, and stealth. Move heel-to-toe."
  },
  {
    id: "supply-carry",
    phase: 2,
    title: "Supply Carry",
    objective: "Carry 20kg load 1km, stop every 200m for 10 burpees, complete without dropping load",
    duration: "20-30 min",
    tools: ["20kg load (rice sack or weighted backpack)"],
    successCriteria: "Complete 1km without dropping load, perform all burpees with proper form",
    variants: ["Increase weight", "Increase distance", "Add uneven terrain"],
    tips: "Builds work capacity and mental toughness. Load close to body, use legs."
  }
];

export const PLANTS: Plant[] = [
  {
    name: "Bamboo (Bambusa spp.)",
    season: "Year-Round",
    identification: "Tall grass with woody stems, hollow internodes, grows in dense groves",
    edibleParts: "Young shoots (harvest when 15-30cm tall, before leaves open)",
    harvest: "Cut at ground level, peel outer layers, boil before eating",
    uses: "Food (shoots), construction (mature stems), tools (staff, arrows)"
  },
  {
    name: "Banana (Musa spp.)",
    season: "Year-Round",
    identification: "Large herbaceous plant with broad leaves, produces hanging fruit clusters",
    edibleParts: "Fruit (ripe or unripe), flower (banana blossom), inner stem (tender core)",
    harvest: "Cut fruit when mature, harvest flower before opening",
    uses: "Food (fruit, flower, stem), leaves for wrapping food, fiber from stem"
  },
  {
    name: "Wild Spinach (Amaranthus spp.)",
    season: "Monsoon (June-September)",
    identification: "Broad green or red leaves, grows quickly in disturbed soil",
    edibleParts: "Young leaves and stems",
    harvest: "Pick young leaves (top 10-15cm of plant), leave roots to regrow",
    uses: "Food (nutritious leafy green, high in iron and vitamins)"
  }
];

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    title: "Minor Cut",
    steps: [
      "Apply direct pressure with clean cloth",
      "Clean with water and antiseptic",
      "Bandage and monitor for infection",
      "Rest the affected area for 24-48 hours"
    ]
  },
  {
    title: "Deep Cut (Heavy Bleeding)",
    steps: [
      "Apply firm pressure immediately",
      "Elevate the wound above heart level if possible",
      "Do not remove the pressure bandage even if blood soaks through—add more layers",
      "Get to medical care immediately"
    ]
  },
  {
    title: "Heat Exhaustion",
    steps: [
      "Stop all activity",
      "Move to shade",
      "Drink water with a pinch of salt",
      "Cool the body with wet cloth on neck, wrists, and forehead",
      "Rest until symptoms fully resolve (at least 24 hours)"
    ]
  }
];

export const COMBAT_COURSES: CombatCourse[] = [
  {
    id: "blade-mastery",
    title: "Blade Mastery Deep Dive",
    description: "Master the machete and knife in combat scenarios.",
    difficulty: "Advanced",
    videos: [
      { id: "bm-1", title: "Machete Fundamental Cuts", duration: "5 min", description: "Basic 5-angle striking system.", url: "https://www.youtube.com/embed/XsqMGYbWpzI" },
      { id: "bm-2", title: "Advanced Blade Combinations", duration: "7 min", description: "Flowing between angles.", url: "https://www.youtube.com/embed/zVCDVx9OhYA", prerequisite: "bm-1" },
      { id: "bm-3", title: "Defensive Blade Techniques", duration: "6 min", description: "Parries and counters.", url: "https://www.youtube.com/embed/Tz8pLrH5qIY", prerequisite: "bm-2" },
      { id: "bm-4", title: "Weapon Speed & Precision Training", duration: "8 min", description: "Targeting drills.", url: "https://www.youtube.com/embed/BdXYqKs1z7c", prerequisite: "bm-3" },
      { id: "bm-5", title: "Blade Maintenance & Combat Readiness", duration: "4 min", description: "Field sharpening.", url: "https://www.youtube.com/embed/tAxfxnkwzRo", prerequisite: "bm-4" }
    ]
  },
  {
    id: "lone-soldier",
    title: "Lone Soldier Combat Foundation",
    description: "Survival and combat tactics for the solo operator.",
    difficulty: "Intermediate",
    videos: [
      { id: "ls-1", title: "Situational Awareness for Solo Combat", duration: "7 min", description: "Scanning and threat detection.", url: "https://www.youtube.com/embed/dJy8TxHqQF8" },
      { id: "ls-2", title: "De-escalation & Combat Decision Making", duration: "6 min", description: "When to fight, when to move.", url: "https://www.youtube.com/embed/IQU6d-VF4dM", prerequisite: "ls-1" },
      { id: "ls-3", title: "Pressure Testing Under Stress", duration: "8 min", description: "Mental fortitude drills.", url: "https://www.youtube.com/embed/5aQ1Ib-Pz5Q", prerequisite: "ls-2" },
      { id: "ls-4", title: "Multi-Opponent Scenario Training", duration: "9 min", description: "Managing multiple threats.", url: "https://www.youtube.com/embed/Uz2Hq7xH_5g", prerequisite: "ls-3" },
      { id: "ls-5", title: "Weapon Transitions in Combat", duration: "7 min", description: "Switching between tools.", url: "https://www.youtube.com/embed/w8epoVXqvW0", prerequisite: "ls-4" },
      { id: "ls-6", title: "Combat Endurance & Mental Toughness", duration: "8 min", description: "Pushing past the limit.", url: "https://www.youtube.com/embed/4E6_b8-1eVc", prerequisite: "ls-5" }
    ]
  },
  {
    id: "muay-thai-engine",
    title: "Advanced Muay Thai Engine",
    description: "Refining the power and conditioning core.",
    difficulty: "Advanced",
    videos: [
      { id: "mt-1", title: "Clinch Dominance Techniques", duration: "8 min", description: "Controlling the inside space.", url: "https://www.youtube.com/embed/mITGjvyJn6A" },
      { id: "mt-2", title: "Explosive Combo Chains", duration: "7 min", description: "Linking strikes for maximum impact.", url: "https://www.youtube.com/embed/qm-Fl8vbS9Q", prerequisite: "mt-1" },
      { id: "mt-3", title: "Movement & Distance Management", duration: "6 min", description: "Controlling the range.", url: "https://www.youtube.com/embed/KH0jCXvFVz4", prerequisite: "mt-2" },
      { id: "mt-4", title: "Combat Pressure Application", duration: "8 min", description: "Applying relentless pressure.", url: "https://www.youtube.com/embed/w-hMoW4QHEU", prerequisite: "mt-3" }
    ]
  },
  {
    id: "land-warfare",
    title: "Land Warfare Tactics",
    description: "Using the terrain as a weapon.",
    difficulty: "Intermediate",
    videos: [
      { id: "lw-1", title: "Terrain Utilization in Combat", duration: "6 min", description: "Cover and concealment.", url: "https://www.youtube.com/embed/bU5VoNh8VdA" },
      { id: "lw-2", title: "Ground Movement & Positioning", duration: "7 min", description: "Low crawl and stealth movement.", url: "https://www.youtube.com/embed/37-7mlmwbfI", prerequisite: "lw-1" },
      { id: "lw-3", title: "Climbing Under Combat Load", duration: "5 min", description: "Ascending with gear.", url: "https://www.youtube.com/embed/p3R1YZVPaAk", prerequisite: "lw-2" },
      { id: "lw-4", title: "Environment Weapons", duration: "6 min", description: "Improvising from nature.", url: "https://www.youtube.com/embed/v8MfXMHBCmU", prerequisite: "lw-3" },
      { id: "lw-5", title: "Survival Combat Integration", duration: "7 min", description: "Merging combat and survival.", url: "https://www.youtube.com/embed/fB3mGH2p8vQ", prerequisite: "lw-4" }
    ]
  },
  {
    id: "combat-conditioning",
    title: "Combat Conditioning for Lone Warriors",
    description: "Building the physical engine for survival.",
    difficulty: "Advanced",
    videos: [
      { id: "cc-1", title: "Explosive Power Development", duration: "7 min", description: "Plyometrics for combat.", url: "https://www.youtube.com/embed/F8jddaKqI0g" },
      { id: "cc-2", title: "Combat Cardio (High-Intensity Protocols)", duration: "8 min", description: "Tabata and interval training.", url: "https://www.youtube.com/embed/nHXGVzwQ6lI", prerequisite: "cc-1" },
      { id: "cc-3", title: "Grip & Weapon Endurance", duration: "6 min", description: "Forearm and hand strength.", url: "https://www.youtube.com/embed/ELeC6mxxfb4", prerequisite: "cc-2" },
      { id: "cc-4", title: "Mental Fortitude Training", duration: "7 min", description: "Breathwork under fatigue.", url: "https://www.youtube.com/embed/qH8d-N_bUSw", prerequisite: "cc-3" }
    ]
  },
  {
    id: "unarmed-defense",
    title: "Unarmed Defensive Tactics",
    description: "Surviving when you are caught without a tool.",
    difficulty: "Intermediate",
    videos: [
      { id: "ud-1", title: "Vulnerability Awareness", duration: "6 min", description: "Identifying weak points.", url: "https://www.youtube.com/embed/hDZUJYKgAqk" },
      { id: "ud-2", title: "Evasive Footwork", duration: "7 min", description: "Creating distance and angles.", url: "https://www.youtube.com/embed/eXQ4hjS4DxA", prerequisite: "ud-1" },
      { id: "ud-3", title: "Counter-Striking Basics", duration: "8 min", description: "Turning defense into offense.", url: "https://www.youtube.com/embed/5xkl3Gy9HkA", prerequisite: "ud-2" },
      { id: "ud-4", title: "Escaping the Clinch", duration: "6 min", description: "Breaking contact safely.", url: "https://www.youtube.com/embed/KSCZ1I0w-FI", prerequisite: "ud-3" }
    ]
  }
];

export const RECOVERY_PROTOCOLS: RecoveryProtocol[] = [
  {
    id: "stretching",
    title: "Stretching Routine (15 min)",
    routine: ["Neck circles (1 min)", "Shoulder rolls (1 min)", "Hamstring stretch (2 min)", "Hip flexor stretch (2 min)", "Cat-cow (2 min)", "Child's pose (2 min)", "Full body reach (5 min)"],
    tips: ["Breathe deeply into each stretch.", "Don't force movement.", "Focus on tension release."]
  },
  {
    id: "breathing",
    title: "Pranayama for Martial Artists",
    routine: ["Box breathing (5 min)", "Alternate nostril breathing (5 min)", "Diaphragmatic breathing (5 min)"],
    tips: ["Keep spine straight.", "Focus on the sound of your breath."]
  },
  {
    id: "mobility",
    title: "Mobility Work",
    routine: ["Ankle circles", "Wrist rotations", "Hip circles", "Thoracic rotations"],
    tips: ["Move slowly and controlled.", "Explore your full range of motion."]
  }
];
