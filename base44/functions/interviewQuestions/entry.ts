import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function (req) {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        const role = String(body?.role || 'Software Engineer').slice(0, 140);
        const level = ['entry', 'mid', 'senior'].includes(body?.experience_level) ? body.experience_level : 'entry';
        const skills = Array.isArray(body?.skills) ? body.skills.slice(0, 25).map((s) => String(s).slice(0, 60)) : [];

        const schema = {
            type: 'object',
            properties: {
                questions: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            question_text: { type: 'string' },
                            question_type: { type: 'string', enum: ['behavioral', 'technical', 'situational', 'experience'] }
                        },
                        required: ['question_text', 'question_type']
                    }
                }
            },
            required: ['questions']
        };

        const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: `Generate exactly 5 mock interview questions for a ${level}-level candidate interviewing for "${role}".
${skills.length ? `Ground at least two questions in these skills taken from the candidate's resume: ${skills.join(', ')}.` : 'No resume skills are available, so keep questions role-general.'}
Mix behavioral, technical, situational and experience types. Each question must be a single, answerable question of under 40 words, expecting a STAR-structured answer where behavioral.`,
            response_json_schema: schema
        });

        const questions = (result?.questions || []).slice(0, 5);
        if (!questions.length) return Response.json({ error: 'Question generation failed' }, { status: 502 });
        return Response.json({ questions, total_questions: questions.length });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}