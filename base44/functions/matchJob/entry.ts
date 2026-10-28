import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

export default async function (req) {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        const skills = Array.isArray(body?.skills) ? body.skills.slice(0, 40).map((s) => String(s).slice(0, 60)) : [];
        const jobTitle = String(body?.job_title || '').slice(0, 140);
        const jobDescription = String(body?.job_description || '').slice(0, 6000);
        if (!jobTitle || !jobDescription) {
            return Response.json({ error: 'job_title and job_description are required' }, { status: 400 });
        }

        const schema = {
            type: 'object',
            properties: {
                match_percentage: { type: 'number' },
                similarity_score: { type: 'number' },
                matching_skills: { type: 'array', items: { type: 'string' } },
                missing_skills: { type: 'array', items: { type: 'string' } },
                skill_breakdown: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            skill: { type: 'string' },
                            required: { type: 'boolean' },
                            present: { type: 'boolean' }
                        }
                    }
                },
                recommendations: { type: 'array', items: { type: 'string' } }
            },
            required: ['match_percentage', 'matching_skills', 'missing_skills', 'recommendations']
        };

        const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
            prompt: `Compare a candidate's extracted resume skills against a job posting using semantic skill matching.

Candidate skills: ${skills.join(', ') || '(none extracted)'}

Job title: ${jobTitle}
Job description:
${jobDescription}

Return match_percentage (0-100) and similarity_score (0-1) reflecting genuine overlap, the matching and missing skills (use the job's wording for missing ones), a skill_breakdown of up to 12 key skills from the posting, and 3-5 concrete recommendations to close the gap. Never invent candidate skills that were not listed.`,
            response_json_schema: schema
        });

        return Response.json(result);
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}