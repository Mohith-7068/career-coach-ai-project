export const FILLER_WORDS = [
    "um", "uh", "like", "you know", "actually", "basically", "so",
    "kind of", "sort of", "i mean", "right"
];

function countOccurrences(text, phrase) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = text.match(new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "g"));
    return matches ? matches.length : 0;
}

export function analyzeTranscript(transcript, durationSeconds) {
    const text = ` ${String(transcript || "").toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ")} `;
    const words = text.trim().split(" ").filter(Boolean);
    const wordCount = words.length;
    const duration = Math.max(Number(durationSeconds) || 0, 1);
    const wpm = Math.round((wordCount / duration) * 60 * 10) / 10;

    const found = [];
    let fillerCount = 0;
    for (const filler of FILLER_WORDS) {
        const n = countOccurrences(text, filler);
        if (n > 0) {
            fillerCount += n;
            found.push(filler);
        }
    }
    const fillerRate = wordCount ? Math.round((fillerCount / wordCount) * 1000) / 10 : 0;

    // WPM score: full marks inside 120-160, linear falloff outside
    let wpmScore;
    if (wpm >= 120 && wpm <= 160) wpmScore = 100;
    else if (wpm < 120) wpmScore = Math.max(0, 100 - (120 - wpm) * 1.4);
    else wpmScore = Math.max(0, 100 - (wpm - 160) * 1.4);

    // Filler score: full marks under 3%, falloff after
    const fillerScore = fillerRate <= 3 ? 100 : Math.max(0, 100 - (fillerRate - 3) * 9);

    const score = Math.round(wpmScore * 0.5 + fillerScore * 0.5);

    const feedback = { strengths: [], weaknesses: [], recommendations: [] };
    if (wpm >= 120 && wpm <= 160) feedback.strengths.push(`Speaking pace of ${wpm} WPM sits inside the ideal 120-160 range.`);
    else if (wpm < 120) {
        feedback.weaknesses.push(`Pace of ${wpm} WPM is below the 120-160 target range.`);
        feedback.recommendations.push("Reduce long pauses and keep momentum between sentences.");
    } else {
        feedback.weaknesses.push(`Pace of ${wpm} WPM is above the 120-160 target range.`);
        feedback.recommendations.push("Slow down and add deliberate pauses between key points.");
    }
    if (fillerRate <= 3) feedback.strengths.push(`Filler rate of ${fillerRate}% is under the 3.0% target.`);
    else {
        feedback.weaknesses.push(`Filler rate of ${fillerRate}% exceeds the 3.0% target (${fillerCount} fillers).`);
        feedback.recommendations.push(`Replace fillers such as "${found.slice(0, 3).join('", "')}" with a short silent pause.`);
    }
    if (wordCount < 40) feedback.recommendations.push("Aim for a longer answer — under 40 words gives little to analyse.");

    return {
        transcript: String(transcript || ""),
        word_count: wordCount,
        duration_seconds: duration,
        wpm,
        filler_count: fillerCount,
        filler_rate: fillerRate,
        filler_words_found: found,
        score,
        feedback
    };
}