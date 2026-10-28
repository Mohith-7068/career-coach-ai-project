const SITUATION = ["when", "during", "at my", "project", "scenario", "problem"];
const TASK = ["needed to", "goal", "task", "objective", "required"];
const ACTION = ["i built", "i implemented", "i designed", "created", "refactored", "optimized", "i led", "i wrote"];
const RESULT = ["resulting in", "improved", "increased", "reduced", "outcome", "percent", "%"];

function hit(text, keywords) {
    return keywords.some((k) => text.includes(k));
}

export function evaluateAnswer(answer, question) {
    const text = String(answer || "").toLowerCase();
    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const star = {
        situation: hit(text, SITUATION),
        task: hit(text, TASK),
        action: hit(text, ACTION),
        result: hit(text, RESULT)
    };
    const starHits = Object.values(star).filter(Boolean).length;

    // Relevance: keyword overlap with the question
    const qWords = String(question || "")
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.replace(/[^a-z]/g, ""))
        .filter((w) => w.length > 4);
    const overlap = qWords.filter((w) => text.includes(w)).length;
    const relevance = qWords.length
        ? Math.min(100, Math.round((overlap / qWords.length) * 120))
        : 50;

    // Clarity: length adequacy + structure signals
    let clarity;
    if (wordCount < 30) clarity = Math.round((wordCount / 30) * 55);
    else if (wordCount <= 220) clarity = 75 + Math.min(25, starHits * 6);
    else clarity = Math.max(50, 100 - (wordCount - 220) * 0.15);
    clarity = Math.max(0, Math.min(100, Math.round(clarity)));

    // Correctness: STAR completeness + quantified outcomes
    const hasNumbers = /\d/.test(text);
    const correctness = Math.max(
        0,
        Math.min(100, Math.round(starHits * 20 + (hasNumbers ? 20 : 0)))
    );

    const score = Math.round(relevance * 0.35 + clarity * 0.3 + correctness * 0.35);

    const strengths = [];
    const recommendations = [];
    if (star.situation) strengths.push("Answer opens with clear situational context.");
    else recommendations.push("Open by setting the scene — where and when this happened.");
    if (star.task) strengths.push("The objective you owned is stated explicitly.");
    else recommendations.push("State the task or goal you were responsible for.");
    if (star.action) strengths.push("Concrete first-person actions are described.");
    else recommendations.push('Describe what you personally did ("I built…", "I implemented…").');
    if (star.result) strengths.push("Answer closes with an outcome.");
    else recommendations.push("End with the measurable result of your work.");
    if (hasNumbers) strengths.push("Quantified detail makes the impact verifiable.");
    else recommendations.push("Add a number — percentage, time saved, users affected.");
    if (wordCount < 30) recommendations.push("Expand the answer — aim for 80-180 words.");
    if (relevance < 40) recommendations.push("Tie the answer back to the specific question asked.");

    return {
        score,
        relevance,
        clarity,
        correctness,
        star,
        word_count: wordCount,
        strengths,
        recommendations
    };
}