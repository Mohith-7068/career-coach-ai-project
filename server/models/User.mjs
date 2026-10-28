import mongoose from 'mongoose';
import crypto from 'node:crypto';

/**
 * User Schema for MongoDB Atlas
 * Preserves exact UUID v4 string identifiers, scrypt hashes, and per-user salts.
 */
const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    full_name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: '',
    },
    password_salt: {
      type: String,
      required: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'users',
    timestamps: false,
    versionKey: false,
    _id: false, // Explicitly tell mongoose we manage the custom _id string
  }
);

/**
 * Returns public user representation without sensitive fields
 */
UserSchema.methods.toPublic = function () {
  return {
    id: this._id,
    email: this.email,
    full_name: this.full_name,
    created_date: this.created_date instanceof Date ? this.created_date.toISOString() : this.created_date,
  };
};

/**
 * Scrypt password hashing matching the existing server implementation
 */
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) return reject(err);
      resolve({ salt, hash: key.toString('hex') });
    });
  });
}

/**
 * Timing-safe scrypt password verification
 */
export async function verifyPassword(password, user) {
  if (!user || !user.password_salt || !user.password_hash) return false;
  try {
    const derived = await hashPassword(password, user.password_salt);
    const a = Buffer.from(derived.hash, 'hex');
    const b = Buffer.from(user.password_hash, 'hex');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
