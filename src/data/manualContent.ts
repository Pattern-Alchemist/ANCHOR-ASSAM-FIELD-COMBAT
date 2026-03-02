export interface SkillTrack {
  id: string;
  title: string;
  description: string;
  drills: string[];
}

export interface WeekProgression {
  week: number;
  phase: number;
  theme: string;
  goals: string[];
  block: {
    nervousSystem: string[];
    muayThai: string[];
    weaponsmith: string[];
    landSkills: string[];
    scenario: string[];
  };
  deliverables: string[];
}

export const PHILOSOPHY = {
  title: "THE ANCHOR IDENTITY: NO MERCY, NO ESCAPE",
  hook: "Tumhari spirituality fake hai. Tumhari training ek aesthetic performance hai. Sach sunne ki himmat hai?",
  content: `
    Most training systems separate body, tools, and land into isolated domains. You lift weights in a gym to look good, practice weapons in a dojo for ego, and learn survival skills in a weekend course to feel "prepared." 
    
    (Short pause.)
    
    The Assam Field School rejects that fragmentation. Here, your body is the foundation for every tool. Your tools extend your body's capability. The land feeds your body and provides your tools. And teaching forces you to understand all three at a level you never would training alone.
    
    An "Anchor" is someone who holds the center when everything else is chaos. You're not trying to become a professional fighter, a bushcraft instructor, or a farmer. You're building a complete field capability—the ability to train yourself, sustain yourself, and eventually guide others in remote, resource-limited conditions.
    
    Agar tum offend ho rahe ho, toh hit ho gaya target.
  `,
  principles: [
    {
      title: "CONSISTENCY OVER INTENSITY",
      desc: "Three hours daily, six days per week, for 24 weeks. No heroic 8-hour days followed by burnout. Steady, relentless progress. (Firm) Yeh koi picnic nahi hai."
    },
    {
      title: "BUILD, DON'T BUY",
      desc: "Make your own staff, spear, bow, and arrows. Grow your own food. This isn't about self-sufficiency as ideology—it's about understanding your tools at a level you can't reach by purchasing them."
    },
    {
      title: "SAFETY IS NON-NEGOTIABLE",
      desc: "Blade work, bow work, and physical training all carry risk. Respect that risk. Move slowly at first. Never train injured. Never compromise on safety protocols."
    }
  ]
};

export const WEEKS: WeekProgression[] = [
  {
    week: 1,
    phase: 1,
    theme: "STANCE, BREATH, AND SAFE CARRY",
    goals: ["Learn to stand, breathe, and handle blades without injury."],
    block: {
      nervousSystem: ["Box Breathing (5-10 min)", "Tiger Flow (10 min)", "Snake Flow (10 min)"],
      muayThai: ["Stance and Guard (15 min)", "Basic Strikes: Jab, Cross, Teep (30 min)"],
      weaponsmith: ["Safe Carry and Draw (30 min)", "Blade Basics (30 min)"],
      landSkills: ["Set up garden space (30-45 min)"],
      scenario: ["Walk through terrain with knife sheathed (30-45 min)"]
    },
    deliverables: ["3x3min shadowboxing rounds", "Sharpen knife to paper-slicing sharpness", "First plants in ground"]
  },
  {
    week: 3,
    phase: 1,
    theme: "FOOTWORK, CLINCH, AND BASIC STAFF",
    goals: ["Add movement and your first pole weapon—the staff becomes an extension of your body."],
    block: {
      nervousSystem: ["Mantis Flow (12 min)", "Crane Flow (12 min)"],
      muayThai: ["Footwork: Step-drag, Lateral, Pivot (20 min)", "Low Kick and Switch Kick (15 min)", "Basic Clinch (10 min)"],
      weaponsmith: ["Staff Crafting: Select and Cut (30 min)", "Fire-Harden and Finish (30 min)"],
      landSkills: ["Observe soil texture", "Start compost pit"],
      scenario: ["Log-walking with staff", "Practice staff thrusts in brush"]
    },
    deliverables: ["One functional staff", "20-30 staff techniques", "Low kick integrated into shadowboxing"]
  },
  {
    week: 5,
    phase: 1,
    theme: "BLADE + STAFF INTEGRATION",
    goals: ["Stop thinking of weapons as separate—learn to flow between empty hand, blade, and staff."],
    block: {
      nervousSystem: ["Animal Movement Linking: Tiger -> Snake -> Mantis (25 min)"],
      muayThai: ["Combinations: Jab-Cross-Hook-Low Kick (30 min)", "Conditioning: High-intensity shadowboxing (15 min)"],
      weaponsmith: ["Machete Work: Trail Clearing (30 min)", "Staff vs Imaginary Opponent (30 min)"],
      landSkills: ["Harvest first greens", "Turn compost"],
      scenario: ["Empty Hand -> Knife integration drills", "Staff -> Clinch -> Staff transitions"]
    },
    deliverables: ["2-3 smooth loops you can repeat", "Machete work for actual tasks with confidence", "Field notes for all 12 training days"]
  },
  {
    week: 7,
    phase: 1,
    theme: "SPEAR AND IMPROVISED TOOLS",
    goals: ["Turn your staff into a spear and learn to improvise weapons from the environment."],
    block: {
      nervousSystem: ["Crane + Eagle Flow (25 min)"],
      muayThai: ["Add Elbows and Defense (30 min)", "Shadowboxing with Defense (15 min)"],
      weaponsmith: ["Spear Conversion: Lashing Basics (30 min)", "Improvised Tools: Simple Club (30 min)"],
      landSkills: ["Plant herbs (tulsi, pudina)", "Cook meal with herbs"],
      scenario: ["Low-light practice with headlamp", "Rain training (if safe)"]
    },
    deliverables: ["Staff converted to spear", "Club + improvised tools tested", "Elbows integrated into shadowboxing"]
  },
  {
    week: 9,
    phase: 2,
    theme: "BOW & BASIC ARROWS (PRIMITIVE)",
    goals: ["Enter the world of projectile weapons—patience, precision, and respect for the tool."],
    block: {
      nervousSystem: ["Snake Flow Applied to Bow (25 min)"],
      muayThai: ["Pressure Fighting vs Evasive (30 min)", "Conditioning (15 min)"],
      weaponsmith: ["Bow Building: Wood Selection & Carving (40 min)", "Arrow Making (20 min)"],
      landSkills: ["Expand garden beds", "Build trellis"],
      scenario: ["Bow Safety and Practice: Dry Practice (30-45 min)"]
    },
    deliverables: ["One functional low-poundage bow", "4-6 practice arrows", "Safe draw and release practiced"]
  },
  {
    week: 11,
    phase: 2,
    theme: "PROJECTILE TOOLS & TRAPS",
    goals: ["Expand your projectile options and learn the principles of traps (for training only)."],
    block: {
      nervousSystem: ["Eagle + Mantis for Ambush Awareness (25 min)"],
      muayThai: ["Counter-Attacking: Check Kick + Return (30 min)", "Shadowboxing with Counters (15 min)"],
      weaponsmith: ["Build Slingshot (30 min)", "Traps: Simple Snare & Deadfall (30 min)"],
      landSkills: ["Check plants for pests", "Cook post-training meal"],
      scenario: ["Scout Missions: Observation Walk (30-45 min)"]
    },
    deliverables: ["Functional slingshot", "Basic training traps built", "Scout missions completed"]
  },
  {
    week: 13,
    phase: 2,
    theme: "FIELD ENGINEERING",
    goals: ["Learn to repair, improvise, and adapt when tools fail or conditions change."],
    block: {
      nervousSystem: ["Tiger to Snake with Machete (25 min)"],
      muayThai: ["Clinch Dominance: Off-Balancing (30 min)", "Clinch Rounds (15 min)"],
      weaponsmith: ["Blade Repair: Grinding & Handle Repair (30 min)", "Cordage and Lashing (30 min)"],
      landSkills: ["Sun-dry chilies/greens", "Make simple pickle"],
      scenario: ["Tool Failure Scenarios: Blade 'Breaks' (30-45 min)"]
    },
    deliverables: ["Blade repaired", "Cordage made from natural materials", "Lashing systems practiced"]
  },
  {
    week: 15,
    phase: 2,
    theme: "MULTI-TOOL INTEGRATION",
    goals: ["Mastery isn't knowing each tool—it's seamless transitions between all of them."],
    block: {
      nervousSystem: ["Breath Control Under Switching (10 min)", "Animal Flow Integration (20 min)"],
      muayThai: ["Weapon-Range Striking (30 min)", "Conditioning Under Fatigue (15 min)"],
      weaponsmith: ["Multi-Tool Carry Systems (30 min)", "Weapon Switching Sequences (30 min)"],
      landSkills: ["Harvest mature crops", "Preserve harvest"],
      scenario: ["Integrated Weapon Scenarios: Long to Close (30-45 min)"]
    },
    deliverables: ["Functional carry system for 4+ tools", "3-5 weapon switching sequences practiced", "Multi-tool obstacle course completed"]
  },
  {
    week: 17,
    phase: 3,
    theme: "WARRIOR PLAYBOOK FOUNDATION",
    goals: ["Consolidate your knowledge into a personal training system."],
    block: {
      nervousSystem: ["Playbook Breathing Protocols (10 min)", "Animal Flow Personalization (20 min)"],
      muayThai: ["Combination Mastery: Top 5 (30 min)", "Timing and Reflex Drills (15 min)"],
      weaponsmith: ["Tool Customization (30 min)", "Playbook Drills (30 min)"],
      landSkills: ["Document garden's full cycle", "Cook signature meal"],
      scenario: ["Design Your First Scenario (30-45 min)"]
    },
    deliverables: ["Playbook skeleton created", "3-5 core drills per weapon", "2+ training scenarios designed"]
  },
  {
    week: 19,
    phase: 3,
    theme: "SCENARIO MASTERY",
    goals: ["Design and run your own training scenarios. Stop following the manual."],
    block: {
      nervousSystem: ["Stress Breathing Protocols (10 min)", "Animal Flow Under Fatigue (20 min)"],
      muayThai: ["Pressure Testing: Full Intensity (30 min)", "Reflex Drills Under Fatigue (15 min)"],
      weaponsmith: ["Complete Tool Restoration (30 min)", "Scenario Design: Weaponsmith Challenges (30 min)"],
      landSkills: ["Harvest all remaining crops", "Preserve maximum amount"],
      scenario: ["Personalized Training Missions (30-45 min)"]
    },
    deliverables: ["All tools fully restored", "3+ personalized training missions completed", "Preserved food stores (1-2 weeks)"]
  },
  {
    week: 21,
    phase: 3,
    theme: "TEACHING SKILLS",
    goals: ["Teaching is the final test of mastery. If you can't explain it clearly, you don't understand it."],
    block: {
      nervousSystem: ["Breath for Teaching (10 min)", "Animal Flow as Teaching Tool (20 min)"],
      muayThai: ["Reflex and Timing Mastery (30 min)", "Teaching Drill: Shadowboxing (15 min)"],
      weaponsmith: ["Innovation: Design Your Own Tool (30 min)", "Teaching Project: Tool Building (30 min)"],
      landSkills: ["Experiment with advanced fermentation", "Advanced foraging"],
      scenario: ["Personal Code Development (30-45 min)"]
    },
    deliverables: ["One complete skill taught", "Personal code written", "One custom tool designed"]
  },
  {
    week: 23,
    phase: 3,
    theme: "ANCHOR IDENTITY & INTEGRATION",
    goals: ["You are now an Anchor. Integration—bringing all 5 pillars together into one seamless system."],
    block: {
      nervousSystem: ["Breath Mastery Assessment (10 min)", "Animal Flow Integration (20 min)"],
      muayThai: ["Teaching Sequence (30 min)", "Final Conditioning Test (15 min)"],
      weaponsmith: ["Mentorship Project (30 min)", "Final Tool Check (30 min)"],
      landSkills: ["Harvest final crops", "Prepare a feast"],
      scenario: ["24-Hour Integrated Challenge (Simplified) (30-45 min)"]
    },
    deliverables: ["Complete Warrior Playbook", "Personal code finalized", "24-hour integrated challenge completed"]
  }
];

export const SKILL_TRACKS: SkillTrack[] = [
  {
    id: "muay-thai",
    title: "Muay Thai Engine",
    description: "The power generation and conditioning core.",
    drills: ["Shadowboxing (10-20 min)", "Combination work (15 min)", "Pressure work (15 min)", "Conditioning finisher (5 min)", "Clinch dominance drills", "Explosive knee strikes"]
  },
  {
    id: "combat-tactics",
    title: "Combat Tactics & Strategy",
    description: "Situational awareness and engagement protocols.",
    drills: ["Threat detection scanning", "De-escalation verbal drills", "Evasive movement patterns", "Multi-opponent positioning", "Weapon transition speed drills"]
  },
  {
    id: "field-combat",
    title: "Field Combat Integration",
    description: "Merging combat skills with environmental factors.",
    drills: ["Low-light engagement", "Uneven terrain footwork", "Using natural cover", "Combat climbing", "Stealth approach & entry"]
  },
  {
    id: "animal-movement",
    title: "Animal Movement Mastery",
    description: "Adaptability and ground-based movement.",
    drills: ["Bear (Shoulder stability)", "Crab (Hip mobility)", "Frog (Explosive power)", "Crane (Balance)", "Scorpion (Spinal mobility)"]
  },
  {
    id: "blade-literacy",
    title: "Blade Literacy",
    description: "Knife and machete mastery.",
    drills: ["Safe draw and re-sheath", "Basic cuts (Downward, Horizontal, Upward)", "Batoning and chopping", "Emergency sharpening"]
  },
  {
    id: "weaponsmithing",
    title: "Weaponsmithing & Craft",
    description: "Building and maintaining your tools.",
    drills: ["Staff crafting", "Bow building", "Arrow making", "Cordage from natural materials", "Lashing systems"]
  },
  {
    id: "food-land",
    title: "Food, Land & Self-Reliance",
    description: "Sustaining yourself from the environment.",
    drills: ["Garden development", "Plant identification", "Food preparation", "Foraging safely", "Preservation (Drying, Fermenting)"]
  }
];

export const RED_FLAGS = [
  {
    id: "energy",
    title: "Red Flag 1: Persistent Low Energy (3+ Days)",
    symptoms: ["Energy level below 5/10", "Difficulty completing blocks", "Excessive fatigue", "Loss of motivation"],
    protocol: [
      "Take 2-3 full recovery days",
      "Assess sleep (aim for 8+ hours)",
      "Assess nutrition (increase calories, whole foods)",
      "Reduce training volume by 30-50% for 1 week",
      "If no improvement after 1 week, see a doctor"
    ]
  },
  {
    id: "pain",
    title: "Red Flag 2: Recurring Injuries or Pain",
    symptoms: ["Same injury keeps recurring", "Pain that worsens during training", "Compensatory movement patterns"],
    protocol: [
      "Stop training the affected area immediately",
      "Ice and rest for 48-72 hours",
      "Assess form (film yourself)",
      "Reduce volume on affected movement by 50% for 2 weeks",
      "Add extra mobility and stretching",
      "If pain persists > 2 weeks, see a doctor"
    ]
  },
  {
    id: "performance",
    title: "Red Flag 3: Declining Performance",
    symptoms: ["Metrics decreasing", "Struggling with manageable workouts", "Form breaking down early", "Low motivation"],
    protocol: [
      "Take 3-5 full recovery days",
      "Reduce volume by 40-50% for 1-2 weeks",
      "Change training structure (new scenarios)",
      "Add variety",
      "Address life stress",
      "If no improvement, take 1 full week off"
    ]
  },
  {
    id: "sleep",
    title: "Red Flag 4: Sleep Disruption",
    symptoms: ["Difficulty falling asleep", "Waking frequently", "Waking unrefreshed", "Quality < 6/10 for 3+ nights"],
    protocol: [
      "Move training to earlier in day (finish by 5-6pm)",
      "Extend cool-down to 20-30 minutes",
      "Add evening relaxation routine",
      "Assess caffeine intake",
      "Improve sleep environment"
    ]
  }
];

export const TOOL_ANATOMY = [
  {
    name: "Machete",
    design: [
      "Blade length: 40-50cm",
      "Total length: 55-65cm",
      "Weight: 400-600g",
      "Blade thickness: 2-4mm",
      "Edge: Single-edged"
    ],
    safeZones: [
      "Carry: Blade down, edge away from body",
      "Cutting: Always cut away from body",
      "Distance: 2m clearance from others",
      "Storage: In sheath, never on ground"
    ],
    maintenance: [
      "Sharpening: Every 3-4 days of use",
      "Oiling: After every use (light coat)"
    ]
  },
  {
    name: "Staff (Bo)",
    design: [
      "Length: 180-200cm",
      "Diameter: 3-4cm",
      "Material: Bamboo or hardwood",
      "Weight: 500-800g (bamboo)"
    ],
    safeZones: [
      "Carry: Vertical at side or horizontal behind neck",
      "Striking: Full 360-degree range awareness",
      "Distance: 2-3m clearance",
      "Storage: Hung vertically or horizontally"
    ],
    maintenance: [
      "Inspection: Check for cracks weekly",
      "Sanding: Smooth rough spots every 2-4 weeks",
      "End caps: Fire-harden bamboo ends"
    ]
  },
  {
    name: "Knife",
    design: [
      "Blade length: 10-15cm (utility)",
      "Total length: 20-30cm",
      "Weight: 150-300g",
      "Blade thickness: 3-5mm",
      "Edge: Single-edged"
    ],
    safeZones: [
      "Carry: In sheath on belt or in pack",
      "Cutting: Always cut away from body",
      "Distance: 1m clearance",
      "Storage: In sheath, never loose"
    ],
    maintenance: [
      "Sharpening: Every 1-2 weeks",
      "Oiling: After every sharpening"
    ]
  },
  {
    name: "Bow",
    design: [
      "Length: 150-180cm",
      "Draw weight: 15-50kg (progression)",
      "Material: Bamboo or hardwood",
      "String: Natural or synthetic fiber"
    ],
    safeZones: [
      "Carry: Unstrung, held vertically/horizontally",
      "Shooting: Clear downrange (50m+)",
      "Danger: Never dry-fire",
      "Storage: Unstrung in dry place"
    ],
    maintenance: [
      "Unstring: After every use",
      "Wax string: Every 2-4 weeks",
      "Inspect limbs: Check for cracks before use"
    ]
  }
];
