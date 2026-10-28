import mongoose from 'mongoose';

const SpeechSessionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    transcript: { type: String, default: '' },
    word_count: { type: Number, default: 0 },
    duration_seconds: { type: Number, default: 0 },
    wpm: { type: Number, default: null },
    filler_count: { type: Number, default: 0 },
    filler_rate: { type: Number, default: 0 },
    filler_words_found: { type: [String], default: [] },
    score: { type: Number, default: 0 },
    topic: { type: String, default: '' },
    created_date: { type: Date, default: Date.now, index: true },
    updated_date: { type: Date, default: Date.now },
  },
  {
    collection: 'speech_sessions',
    timestamps: false,
    versionKey: false,
    _id: false,
    strict: false,
  }
);

export const SpeechSession = mongoose.models.SpeechSession || mongoose.model('SpeechSession', SpeechSessionSchema);
