import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function (req) {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        const fileUrl = typeof body?.file_url === 'string' ? body.file_url : null;
        const targetRole = typeof body?.target_role === 'string' ? body.target_role.slice(0, 120) : 'Software Engineer';
        if (!fileUrl || !/^https:\/\//.test(fileUrl)) {
            return Response.json({ error: 'A valid file_url is required' }, { status: 400 });
        }

        const schema = {
            type: 'object',
            properties: {
                score: { type: 'number' },
                word_count: { type: 'number' },
                has_metrics: { type: 'boolean' },
                extracted_skills: { type: 'array', items: { type: 'string' } },
                detected_sections: { type: 'array', items: { type: 'string' } },
                missing_sections: { type: 'array', items: { type: 'string' } },
                strengths: { type: 'array', items: { type: 'string' } },
                weaknesses: { type: 'array', items: { type: 'string' } },
                recommendations: { type: 'array', items: { type: 'string' } }
            },
            required: ['score', 'extracted_skills', 'detected_sections', 'missing_sections', 'strengths', 'weaknesses', 'recommendations']
        };

        const prompt = `You are a resume parsing and evaluation engine for a career readiness platform.
Analyse the attached resume for a candidate targeting the role: "${targetRole}".

Rules:
- Only report what is actually present in the document. Never invent skills, employers, or metrics.
- detected_sections / missing_sections must be drawn from exactly this checklist: Contact, Summary, Education, Experience, Skills, Projects, Certifications.
- extracted_skills: concrete technologies, tools, languages and methodologies literally mentioned (max 24, as written).
- has_metrics: true only if the resume quantifies impact (numbers, percentages, scale).
- word_count: your best estimate of the resume's total word count.
- score: 0-100 overall resume quality for the target role, weighing section completeness, quantified impact, skill relevance and concision.
- strengths, weaknesses, recommendations: 3-5 short, specific, actionable items each. No flattery, no psychological claims.`;

        const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt,
            file_urls: [fileUrl],
            response_json_schema: schema
        });

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}