import mongoose from 'mongoose';

const CoinTransactionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    transaction_type: { type: String, required: true },
    description: { type: String, default: '' },
    reference_id: { type: String, index: true, default: null },
    balance_after: { type: Number, required: true },
    created_date: { type: Date, default: Date.now, index: true },
    updated_date: { type: Date, default: Date.now },
  },
  {
    collection: 'coin_transactions',
    timestamps: false,
    versionKey: false,
    _id: false,
    strict: false,
  }
);

// Compound index to guarantee reference_id idempotency per user
CoinTransactionSchema.index({ userId: 1, reference_id: 1 });

export const CoinTransaction = mongoose.models.CoinTransaction || mongoose.model('CoinTransaction', CoinTransactionSchema);
