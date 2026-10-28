import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { analyzeTranscript } from '../../shared/speechScoring.js';

export default async function (req) {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        const audioUrl = typeof body?.audio_url === 'string' ? body.audio_url : null;
        const duration = Math.min(Math.max(Number(body?.duration_seconds) || 0, 1), 600);
        if (!audioUrl || !/^https:\/\//.test(audioUrl)) {
            return Response.json({ error: 'A valid audio_url is required' }, { status: 400 });
        }

        const transcript = await base44.asServiceRole.integrations.Core.TranscribeAudio({ audio_url: audioUrl });
        const text = typeof transcript === 'string' ? transcript : (transcript?.transcript || '');
        if (!text.trim()) {
            return Response.json({ error: 'No speech could be transcribed from the recording' }, { status: 422 });
        }

        return Response.json(analyzeTranscript(text, duration));
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}