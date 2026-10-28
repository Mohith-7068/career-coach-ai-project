export const FILLER_WORDS = [
    "um", "uh", "like", "you know", "actually", "basically", "so",
    "kind of", "sort of", "i mean", "right"
];

export const LEVELS = [
    { level: 1, title: "Beginner", xp: 0 },
    { level: 2, title: "Explorer", xp: 100 },
    { level: 3, title: "Communicator", xp: 250 },
    { level: 4, title: "Interview Ready", xp: 500 },
    { level: 5, title: "Career Ready", xp: 1000 },
    { level: 6, title: "Expert", xp: 2000 }
];

export const REWARDS = [
    { id: "REW_SPEAKING_01", title: "60s Communication Challenge", description: "Record a 60-second spoken answer and get pace + filler analysis.", coins: 15, xp: 25, action_type: "SPEAKING_CHALLENGE", href: "/communication" },
    { id: "REW_RESUME_01", title: "Resume Intelligence Parsing", description: "Upload your resume for section, skill and metric extraction.", coins: 20, xp: 30, action_type: "RESUME_ANALYSIS", href: "/resume" },
    { id: "REW_INTERVIEW_01", title: "AI Mock Interview Session", description: "Complete a five-question resume-grounded interview session.", coins: 30, xp: 40, action_type: "MOCK_INTERVIEW", href: "/interview" },
    { id: "REW_VIDEO_INT_01", title: "Interview Session Deep Review", description: "Score every answer of a full session with STAR breakdown.", coins: 35, xp: 50, action_type: "DEEP_REVIEW", href: "/interview" },
    { id: "REW_STREAK_07", title: "7-Day Streak Milestone", description: "Practise seven days in a row to unlock the milestone bonus.", coins: 50, xp: 50, action_type: "STREAK_MILESTONE", href: "/dashboard" }
];

export const PREMIUM_FEATURES = [
    { key: "advanced_resume_reviews", label: "Advanced resume reviews" },
    { key: "unlimited_challenges", label: "Unlimited daily challenges" },
    { key: "advanced_communication_analysis", label: "Advanced communication analysis" },
    { key: "expert_technical_coach", label: "Expert technical coach" },
    { key: "custom_interview_paths", label: "Custom interview paths" },
    { key: "detailed_analytics", label: "Detailed progression analytics" }
];

export const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const TOPICS = [
    "Describe a project you are proud of and why.",
    "Explain a technical concept to a non-technical audience.",
    "Tell me about a time you disagreed with a teammate.",
    "What does a great engineering culture look like to you?",
    "Walk me through how you approach an unfamiliar problem.",
    "Describe a mistake you made and what you changed after."
];

export function levelFor(xp) {
    let current = LEVELS[0];
    for (const l of LEVELS) if (xp >= l.xp) current = l;
    const next = LEVELS.find((l) => l.xp > xp) || null;
    const span = next ? next.xp - current.xp : 1;
    const progress = next ? Math.round(((xp - current.xp) / span) * 100) : 100;
    return { ...current, next, progress };
}

export function readinessScore(state) {
    if (!state) return 0;
    const dimensions = [
        ['resume_score', 0.3],
        ['communication_score', 0.3],
        ['technical_score', 0.2],
        ['interview_score', 0.2]
    ].filter(([key]) => Number.isFinite(state[key]) && state[key] > 0);
    if (!dimensions.length) return 0;
    const weight = dimensions.reduce((sum, [, value]) => sum + value, 0);
    return Math.round(dimensions.reduce((sum, [key, value]) => sum + state[key] * value, 0) / weight);
}

export function topWeaknesses(state) {
    if (!state) return [];
    return [
        { label: "Communication delivery", score: state.communication_score, key: 'communication_score' },
        { label: "Interview structure (STAR)", score: state.interview_score, key: 'interview_score' },
        { label: "Technical depth", score: state.technical_score, key: 'technical_score' },
        { label: "Resume quality", score: state.resume_score, key: 'resume_score' }
    ]
        .filter((item) => Number.isFinite(item.score) && item.score > 0)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);
}