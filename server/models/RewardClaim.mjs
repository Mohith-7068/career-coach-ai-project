import mongoose from 'mongoose';

const RewardClaimSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    reward_id: { type: String, required: true },
    title: { type: String, default: '' },
    cost: { type: Number, default: 0 },
    created_date: { type: Date, default: Date.now, index: true },
    updated_date: { type: Date, default: Date.now },
  },
  {
    collection: 'reward_claims',
    timestamps: false,
    versionKey: false,
    _id: false,
    strict: false,
  }
);

export const RewardClaim = mongoose.models.RewardClaim || mongoose.model('RewardClaim', RewardClaimSchema);
