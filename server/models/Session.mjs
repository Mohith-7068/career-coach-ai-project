import mongoose from 'mongoose';

/**
 * Session Schema for MongoDB Atlas
 * Preserves 32-byte base64url tokens and uses MongoDB TTL index for automated expiry.
 */
const SessionSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Base64url session token
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index automatically removes expired sessions
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'sessions',
    timestamps: false,
    versionKey: false,
    _id: false,
  }
);

export const Session = mongoose.models.Session || mongoose.model('Session', SessionSchema);
