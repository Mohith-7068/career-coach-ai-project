import { evaluateAnswer } from '../../shared/starScoring.js';

export default async function (req) {
    try {
        const body = await req.json();
        const answer = String(body?.answer_text || '').slice(0, 8000);
        const question = String(body?.question_text || '').slice(0, 500);
        if (answer.trim().length < 5) {
            return Response.json({ error: 'Answer is too short to evaluate' }, { status: 400 });
        }
        return Response.json(evaluateAnswer(answer, question));
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}