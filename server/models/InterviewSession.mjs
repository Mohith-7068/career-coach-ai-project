import mongoose from 'mongoose';

const InterviewSessionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    role: { type: String, default: 'Software Engineer' },
    experience_level: { type: String, default: 'entry' },
    questions: { type: [mongoose.Schema.Types.Mixed], default: [] },
    answers: { type: [mongoose.Schema.Types.Mixed], default: [] },
    average_score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    created_date: { type: Date, default: Date.now, index: true },
    updated_date: { type: Date, default: Date.now },
  },
  {
    collection: 'interview_sessions',
    timestamps: false,
    versionKey: false,
    _id: false,
    strict: false,
  }
);

export const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', InterviewSessionSchema);
