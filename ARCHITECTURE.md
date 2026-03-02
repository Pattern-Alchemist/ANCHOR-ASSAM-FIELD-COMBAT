# 🏗️ Architecture - Puter.js AI Integration

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANCHOR Combat Training App                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     React Components                        │ │
│  │                                                              │ │
│  │  ┌──────────────────┐  ┌──────────────────┐ ┌────────────┐ │ │
│  │  │ CombatFocusCard  │  │  DrillDetail     │ │ Scenario   │ │ │
│  │  │                  │  │                  │ │ Simulator  │ │ │
│  │  │ Shows daily focus│  │ Shows drill tips │ │            │ │ │
│  │  │ recommendation   │  │ from AI          │ │ Dynamic    │ │ │
│  │  │                  │  │                  │ │ outcomes   │ │ │
│  │  └────────┬─────────┘  └────────┬─────────┘ └────┬───────┘ │ │
│  │           │                     │                 │          │ │
│  │           └─────────────┬───────┴────────────────┘          │ │
│  │                         │                                    │ │
│  └─────────────────────────┼────────────────────────────────────┘ │
│                            │                                       │
│  ┌─────────────────────────▼────────────────────────────────────┐ │
│  │              React Hooks Layer                               │ │
│  │                                                              │ │
│  │  ┌──────────────────┐  ┌──────────────────┐                │ │
│  │  │useCombatFocusAI  │  │useScenarioOutcome│  ┌───────────┐ │ │
│  │  │                  │  │ AI               │  │useDrill   │ │ │
│  │  │• autoFetch       │  │                  │  │TipsAI     │ │ │
│  │  │• refetch         │  │• generateOutcome │  │           │ │ │
│  │  │• loading state   │  │• outcome state   │  │• fetchTips│ │ │
│  │  │• error handling  │  │• error handling  │  │• tips[]   │ │ │
│  │  └─────────┬────────┘  └────────┬─────────┘  └─────┬─────┘ │ │
│  │            │                    │                  │        │ │
│  │  ┌─────────┴───────────────────┴──────────────────┴─────┐  │ │
│  │  │  useInjuryAlertsAI                                   │  │ │
│  │  │  useLessonSummaryAI                                  │  │ │
│  │  │  useMotivationalMessageAI                            │  │ │
│  │  └─────────────────────┬───────────────────────────────┘  │ │
│  │                        │                                   │ │
│  └────────────────────────┼───────────────────────────────────┘ │
│                           │                                      │
│  ┌────────────────────────▼───────────────────────────────────┐ │
│  │             Services Layer (Core AI Logic)                 │ │
│  │                                                              │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │           combatAI.ts - Combat Functions            │  │ │
│  │  │                                                       │  │ │
│  │  │  • generateCombatFocusToday()                        │  │ │
│  │  │  • generateScenarioOutcome()                         │  │ │
│  │  │  • generateDrillTips()                               │  │ │
│  │  │  • generateInjuryAlerts()                            │  │ │
│  │  │  • generateLessonSummary()                           │  │ │
│  │  │  • generateMotivationalMessage()                     │  │ │
│  │  └──────────────────┬─────────────────────────────────┘  │ │
│  │                     │                                      │ │
│  │  ┌──────────────────▼─────────────────────────────────┐  │ │
│  │  │        puterAI.ts - Core Integration              │  │ │
│  │  │                                                    │  │ │
│  │  │  ┌──────────────────┐  ┌──────────────────────┐   │  │ │
│  │  │  │ Puter.js Handler │  │ Cache Manager       │   │  │ │
│  │  │  │                  │  │                      │   │  │ │
│  │  │  │ • Initialize AI  │  │ • Get from cache    │   │  │ │
│  │  │  │ • Make AI calls  │  │ • Set in cache      │   │  │ │
│  │  │  │ • Handle timeout │  │ • TTL management    │   │  │ │
│  │  │  │ • Error handling │  │ • localStorage      │   │  │ │
│  │  │  └──────────────────┘  └──────────────────────┘   │  │ │
│  │  │                                                    │  │ │
│  │  │  ┌──────────────────┐  ┌──────────────────────┐   │  │ │
│  │  │  │ Rate Limiter     │  │ Offline Fallback    │   │  │ │
│  │  │  │                  │  │                      │   │  │ │
│  │  │  │ • Track calls    │  │ • Default responses │   │  │ │
│  │  │  │ • Per action     │  │ • Always available  │   │  │ │
│  │  │  │ • Reset window   │  │ • Type-safe         │   │  │ │
│  │  │  └──────────────────┘  └──────────────────────┘   │  │ │
│  │  └──────────────────┬──────────────────────────────┘  │ │
│  │                     │                                 │ │
│  └─────────────────────┼─────────────────────────────────┘ │
│                        │                                    │
│  ┌─────────────────────▼─────────────────────────────────┐ │
│  │            External Systems                            │ │
│  │                                                          │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │  Puter.js AI (via https://js.puter.com/v2/)    │  │ │
│  │  │  • Online: Real AI responses                    │  │ │
│  │  │  • Offline: Uses fallback responses             │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌─────────────────────────────────────────────────┐  │ │
│  │  │  localStorage                                   │  │ │
│  │  │  • Cache persistence                            │  │ │
│  │  │  • Cross-session data                           │  │ │
│  │  └─────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Happy Path (Online, Cached)
```
Component
    │
    ▼
Hook (useCombatFocusAI)
    │
    ▼
Service (generateCombatFocusToday)
    │
    ▼
callPuterAI()
    │
    ├─ Check Cache ─── HIT ──► Return Cached Data ──► Component
    │
    └─ Check Rate Limit ──► OK ──► Call Puter.js ──► Response ──► Cache & Return
```

### Offline Path
```
Component
    │
    ▼
Hook (useCombatFocusAI)
    │
    ▼
Service (generateCombatFocusToday)
    │
    ▼
callPuterAI()
    │
    ├─ Check Cache ──► HIT ──► Return ──► Component
    │
    └─ Online Check ──► OFFLINE ──► Fallback Response ──► Component
```

### Error Path
```
Component
    │
    ▼
Hook (useCombatFocusAI)
    │
    ├─ Error State ──► Show Loading/Error UI
    │
    └─ Refetch Button ──► Retry Call
```

---

## Component Hierarchy

```
App
├── Dashboard Section
│   └── CombatFocusCard
│       ├── useCombatFocusAI()
│       │   └── generateCombatFocusToday()
│       │       └── callPuterAI()
│       └── UI with Motion animations
│
├── Drill Section
│   └── DrillDetail
│       ├── useDrillTipsAI()
│       │   └── generateDrillTips()
│       │       └── callPuterAI()
│       └── UI with tip list
│
└── Scenario Section
    └── ScenarioSimulator
        ├── useScenarioOutcomeAI()
        │   └── generateScenarioOutcome()
        │       └── callPuterAI()
        └── ScenarioNode
            ├── Choice buttons
            └── Outcome display
```

---

## State Management Flow

```
┌──────────────────────────────┐
│   Hook Internal State        │
│                              │
│  • data/result               │
│  • loading: boolean          │
│  • error: string | null      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Component Receives         │
│                              │
│  • Render data               │
│  • Show loading spinner      │
│  • Display errors            │
│  • Trigger refetch on click  │
└──────────────────────────────┘
```

---

## Caching Strategy

```
Request Comes In
    │
    ▼
Check Memory Cache (Map)
    │
    ├─ EXISTS & NOT EXPIRED ──► Return Immediately (~10ms)
    │
    └─ MISSING OR EXPIRED
        │
        ▼
    Check localStorage
        │
        ├─ EXISTS & NOT EXPIRED ──► Load to Memory ──► Return (~50ms)
        │
        └─ MISSING OR EXPIRED
            │
            ▼
        Check Rate Limit
            │
            ├─ EXCEEDED ──► Return Fallback (~10ms)
            │
            └─ OK
                │
                ▼
            Check Online Status
                │
                ├─ OFFLINE ──► Return Fallback (~10ms)
                │
                └─ ONLINE
                    │
                    ▼
                Call Puter.js AI (with 8s timeout)
                    │
                    ├─ SUCCESS ──► Cache & Return (2-4s)
                    │
                    └─ TIMEOUT/ERROR ──► Return Fallback (~10ms)
```

---

## Rate Limiting Strategy

```
Request for 'combatFocus' comes in
    │
    ▼
Get current rate limit entry
    │
    ├─ NOT EXISTS ──► Create new entry (count=1) ──► Allowed
    │
    └─ EXISTS
        │
        ├─ Window EXPIRED ──► Reset (count=1) ──► Allowed
        │
        └─ Window ACTIVE
            │
            ├─ count >= limit ──► BLOCKED (return fallback)
            │
            └─ count < limit ──► Increment & Allowed
```

---

## File Dependencies

```
CombatFocusCard.tsx
    │
    └─ useAIFeatures.ts
        │
        └─ combatAI.ts
            │
            └─ puterAI.ts

DrillDetail.tsx
    │
    └─ useAIFeatures.ts
        │
        └─ combatAI.ts
            │
            └─ puterAI.ts

ScenarioSimulator.tsx
    │
    ├─ useAIFeatures.ts
    │   │
    │   └─ combatAI.ts
    │       │
    │       └─ puterAI.ts
    │
    └─ combatData.ts

App.tsx (No changes needed)
```

---

## TypeScript Type Hierarchy

```
CombatAI Types
├── CombatFocusRecommendation
│   ├── pillar: 'Striking' | 'Grappling' | 'Weapon Transitions'
│   ├── reason: string
│   ├── drill: string
│   └── confidence: number
│
├── ScenarioOutcome
│   ├── successRate: number
│   ├── outcome: string
│   ├── riskLevel: 'Low' | 'Moderate' | 'High'
│   ├── injuries: string[]
│   └── xpGain: number
│
├── InjuryAlert
│   ├── riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical'
│   ├── warning: string
│   ├── recommendations: string[]
│   └── modifiedDrills: string[]
│
└── LessonSummary
    ├── title: string
    ├── keyPoints: string[]
    ├── nextSteps: string[]
    └── difficulty: 'Beginner' | 'Intermediate' | 'Advanced'

PuterAI Types
├── CacheEntry
│   ├── data: any
│   ├── timestamp: number
│   └── ttl: number
│
└── RateLimitEntry
    ├── count: number
    └── resetTime: number
```

---

## Performance Characteristics

```
Operation                      | Latency      | Bottleneck
───────────────────────────────┼──────────────┼─────────────
Cache Hit (memory)             | ~10ms        | None
Cache Hit (localStorage)       | ~50ms        | JSON parse
AI Call (online)               | 2-4 seconds  | Network
AI Call (offline/fallback)     | ~10ms        | None
Component Render              | <50ms        | None
Rate Limit Check              | <1ms         | Map lookup
Total E2E (cached)            | ~60ms        | JSON
Total E2E (online)            | 2.5-5s       | Network
Total E2E (offline)           | ~20ms        | JSON
```

---

## Error Handling Flow

```
Try AI Call
    │
    ├─ Network Error ──► Log ──► Return Fallback
    │
    ├─ Timeout Error ──► Log ──► Return Fallback
    │
    ├─ JSON Parse Error ──► Log ──► Return Fallback
    │
    └─ Success ──► Cache ──► Return
        │
        └─ Cache Error ──► Log (don't crash) ──► Continue
```

---

## Offline Support Architecture

```
Online Mode
    │
    ├─ Puter.js Available ──► Use Real AI
    │   │
    │   └─ Cache Results ──► Fast Next Time
    │
    └─ Fallback Available ──► Use Fallback

Offline Mode
    │
    ├─ Check Cache ──► EXISTS ──► Use Cache (even if old)
    │
    └─ Check Cache ──► MISSING ──► Use Fallback (always available)
```

---

## Summary

This architecture provides:

✅ **Separation of Concerns**
- Components handle UI
- Hooks handle state
- Services handle logic
- puterAI handles network

✅ **Resilience**
- Caching for performance
- Rate limiting for safety
- Offline support for availability
- Error handling for reliability

✅ **Scalability**
- Easy to add new AI functions
- Easy to add new components
- Easy to add new hooks
- Easy to extend services

✅ **Maintainability**
- Clear file structure
- Type safety throughout
- Comprehensive documentation
- Reusable patterns

---

**Architecture Status: PRODUCTION-READY ✅**
