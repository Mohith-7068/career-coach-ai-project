import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { isDbConnected } from './db.mjs';
import { User, hashPassword, verifyPassword } from './models/User.mjs';
import { Session } from './models/Session.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authDataDir = path.join(__dirname, 'data');
const usersFile = path.join(authDataDir, 'users.json');
const sessionsFile = path.join(authDataDir, 'sessions.json');

// Local in-memory sessions cache for fallback mode
const localSessions = new Map();
const sessionTtlMs = 7 * 24 * 60 * 60 * 1000;

// ─── Local File Fallback Helpers ─────────────────────────────────────────────

async function readLocalUsers() {
  try {
    const parsed = JSON.parse(await fs.readFile(usersFile, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeLocalUsers(users) {
  try {
    await fs.mkdir(authDataDir, { recursive: true });
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2), { mode: 0o600 });
  } catch (err) {
    console.error('Error writing local users:', err.message);
  }
}

async function readLocalSessions() {
  try {
    const raw = await fs.readFile(sessionsFile, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const now = Date.now();
      for (const [token, session] of Object.entries(parsed)) {
        if (session && session.expiresAt > now) {
          localSessions.set(token, session);
        }
      }
    }
  } catch (err) {
    if (err.code !== 'ENOENT') console.error('Error reading local sessions:', err.message);
  }
}

async function writeLocalSessions() {
  try {
    await fs.mkdir(authDataDir, { recursive: true });
    const obj = Object.fromEntries(localSessions.entries());
    await fs.writeFile(sessionsFile, JSON.stringify(obj, null, 2), { mode: 0o600 });
  } catch (err) {
    console.error('Error writing local sessions:', err.message);
  }
}

// Preload local sessions on initialization
await readLocalSessions();

function assertDatabaseInProd() {
  if (process.env.NODE_ENV === 'production' && !isDbConnected()) {
    throw new Error('Database operation failed: MongoDB Atlas is required in production.');
  }
}

// ─── Unified Authentication Service ─────────────────────────────────────────

export const authService = {
  /**
   * Find user by email
   */
  async findByEmail(email) {
    assertDatabaseInProd();
    const normalized = String(email || '').trim().toLowerCase();
    if (isDbConnected()) {
      return await User.findOne({ email: normalized }).exec();
    }
    const users = await readLocalUsers();
    return users.find((u) => u.email === normalized) || null;
  },

  /**
   * Find user by ID
   */
  async findById(id) {
    assertDatabaseInProd();
    if (isDbConnected()) {
      return await User.findById(id).exec();
    }
    const users = await readLocalUsers();
    return users.find((u) => u.id === id) || null;
  },

  /**
   * Create a new user account
   */
  async createUser({ email, password, full_name, id = crypto.randomUUID() }) {
    assertDatabaseInProd();
    const normalized = String(email || '').trim().toLowerCase();
    const credentials = await hashPassword(password);
    const created_date = new Date();

    if (isDbConnected()) {
      const doc = new User({
        _id: id,
        email: normalized,
        full_name: String(full_name || normalized.split('@')[0]).slice(0, 100),
        password_salt: credentials.salt,
        password_hash: credentials.hash,
        created_date,
      });
      await doc.save();
      return doc;
    }

    const users = await readLocalUsers();
    const newUser = {
      id,
      email: normalized,
      full_name: String(full_name || normalized.split('@')[0]).slice(0, 100),
      created_date: created_date.toISOString(),
      password_salt: credentials.salt,
      password_hash: credentials.hash,
    };
    users.push(newUser);
    await writeLocalUsers(users);
    return newUser;
  },

  /**
   * Create a new session for a user
   */
  async createSession(user) {
    assertDatabaseInProd();
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + sessionTtlMs);
    const userId = user.id || user._id;

    if (isDbConnected()) {
      await Session.create({
        _id: token,
        userId,
        expiresAt,
      });
      return token;
    }

    localSessions.set(token, {
      userId,
      expiresAt: expiresAt.getTime(),
    });
    writeLocalSessions().catch(() => {});
    return token;
  },

  /**
   * Validate and retrieve an active session
   */
  async validateSession(token) {
    assertDatabaseInProd();
    if (!token) return null;

    if (isDbConnected()) {
      const sessionDoc = await Session.findById(token).exec();
      if (!sessionDoc) return null;
      if (sessionDoc.expiresAt < new Date()) {
        await Session.findByIdAndDelete(token).exec();
        return null;
      }
      return { userId: sessionDoc.userId, expiresAt: sessionDoc.expiresAt };
    }

    const session = localSessions.get(token);
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      localSessions.delete(token);
      writeLocalSessions().catch(() => {});
      return null;
    }
    return session;
  },

  /**
   * Delete a session (logout)
   */
  async deleteSession(token) {
    assertDatabaseInProd();
    if (!token) return;

    if (isDbConnected()) {
      await Session.findByIdAndDelete(token).exec();
      return;
    }

    localSessions.delete(token);
    writeLocalSessions().catch(() => {});
  },

  /**
   * Verify password
   */
  async verifyUserPassword(password, user) {
    return await verifyPassword(password, user);
  },

  /**
   * Format public user object (no secrets)
   */
  toPublic(user) {
    if (!user) return null;
    return {
      id: user.id || user._id,
      email: user.email,
      full_name: user.full_name,
      created_date: user.created_date instanceof Date ? user.created_date.toISOString() : user.created_date,
    };
  },
};
