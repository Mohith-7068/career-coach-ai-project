import mongoose from 'mongoose';

const ResumeAnalysisSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    score: { type: Number, default: 0 },
    word_count: { type: Number, default: 0 },
    profile_summary: { type: String, default: '' },
    extracted_skills: { type: [String], default: [] },
    technical_skills: { type: [String], default: [] },
    tools_and_frameworks: { type: [String], default: [] },
    soft_skills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    education: { type: [mongoose.Schema.Types.Mixed], default: [] },
    experience: { type: [mongoose.Schema.Types.Mixed], default: [] },
    projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    detected_sections: { type: [String], default: [] },
    missing_sections: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendations: { type: [String], default: [] },
    resume_quality_issues: { type: [String], default: [] },
    capability_gaps: { type: [String], default: [] },
    created_date: { type: Date, default: Date.now, index: true },
    updated_date: { type: Date, default: Date.now },
  },
  {
    collection: 'resume_analyses',
    timestamps: false,
    versionKey: false,
    _id: false,
    strict: false,
  }
);

export const ResumeAnalysis = mongoose.models.ResumeAnalysis || mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
