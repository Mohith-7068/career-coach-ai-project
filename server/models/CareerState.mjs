import mongoose from 'mongoose';

const CareerStateSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    target_role: { type: String, default: 'Software Engineer' },
    experience_level: { type: String, default: 'entry' },
    coin_balance: { type: Number, default: 0 },
    lifetime_earned: { type: Number, default: 0 },
    lifetime_spent: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    streak_days: { type: Number, default: 0 },
    longest_streak: { type: Number, default: 0 },
    active_days: { type: [String], default: [] },
    coins_today: { type: Number, default: 0 },
    last_active_date: { type: String, default: null },
    plan: { type: String, default: 'FREE' },
    plan_acquisition: { type: String, default: 'FREE' },
    resume_score: { type: Number, default: 0 },
    communication_score: { type: Number, default: 0 },
    technical_score: { type: Number, default: 0 },
    interview_score: { type: Number, default: 0 },
    last_resume_skills: { type: [String], default: [] },
    created_date: { type: Date, default: Date.now },
    updated_date: { type: Date, default: Date.now },
  },
  {
    collection: 'career_states',
    timestamps: false,
    versionKey: false,
    _id: false,
    strict: false,
  }
);

export const CareerState = mongoose.models.CareerState || mongoose.model('CareerState', CareerStateSchema);
