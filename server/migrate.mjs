import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB, disconnectDB, maskUri } from './db.mjs';
import { User } from './models/User.mjs';
import { Session } from './models/Session.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const authDataDir = path.join(__dirname, 'data');
const usersFile = path.join(authDataDir, 'users.json');
const sessionsFile = path.join(authDataDir, 'sessions.json');

/**
 * Idempotent Migration Script: Local JSON -> MongoDB Atlas
 * 
 * Safely transfers user accounts and active sessions into MongoDB.
 * Never overwrites existing accounts or exposes sensitive data.
 */
async function runMigration() {
  console.log('=== Career Coach AI — MongoDB Atlas Migration ===\n');

  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    console.error('ERROR: MONGODB_URI environment variable is not defined.');
    console.error('Please configure MONGODB_URI in your .env file or environment before running migration.\n');
    process.exit(1);
  }

  console.log(`Connecting to MongoDB Atlas at ${maskUri(uri)}...`);
  try {
    await connectDB(uri);
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  }

  const report = {
    usersTotal: 0,
    usersMigrated: 0,
    usersSkipped: 0,
    sessionsTotal: 0,
    sessionsMigrated: 0,
    sessionsSkipped: 0,
  };

  // ── 1. Migrate Users ────────────────────────────────────────────────────────
  try {
    console.log('\n[1/2] Checking local users...');
    let localUsers = [];
    try {
      const data = await fs.readFile(usersFile, 'utf8');
      localUsers = JSON.parse(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('No local users.json found. Skipping user migration.');
      } else {
        throw err;
      }
    }

    if (Array.isArray(localUsers)) {
      report.usersTotal = localUsers.length;
      console.log(`Found ${localUsers.length} local user record(s). Checking against MongoDB...`);

      for (const u of localUsers) {
        if (!u.email || !u.password_hash || !u.password_salt) {
          console.warn(`  ⚠️ Skipping malformed user record (missing required fields).`);
          report.usersSkipped++;
          continue;
        }

        const normalizedEmail = u.email.trim().toLowerCase();
        const existing = await User.findOne({
          $or: [{ _id: u.id }, { email: normalizedEmail }]
        }).exec();

        if (existing) {
          console.log(`  • User already present in MongoDB: ${normalizedEmail} (ID: ${existing._id}) — skipped.`);
          report.usersSkipped++;
        } else {
          await User.create({
            _id: u.id,
            email: normalizedEmail,
            full_name: u.full_name || '',
            password_salt: u.password_salt,
            password_hash: u.password_hash,
            created_date: u.created_date ? new Date(u.created_date) : new Date(),
          });
          console.log(`  ✓ Successfully migrated user: ${normalizedEmail}`);
          report.usersMigrated++;
        }
      }
    }
  } catch (err) {
    console.error('Error during user migration:', err.message);
  }

  // ── 2. Migrate Active Sessions ──────────────────────────────────────────────
  try {
    console.log('\n[2/2] Checking local active sessions...');
    let localSessions = {};
    try {
      const data = await fs.readFile(sessionsFile, 'utf8');
      localSessions = JSON.parse(data);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    if (localSessions && typeof localSessions === 'object') {
      const entries = Object.entries(localSessions);
      report.sessionsTotal = entries.length;
      const now = Date.now();

      for (const [token, session] of entries) {
        if (!session?.userId || !session?.expiresAt || session.expiresAt <= now) {
          report.sessionsSkipped++;
          continue; // Skip expired or malformed session
        }

        const existing = await Session.findById(token).exec();
        if (existing) {
          report.sessionsSkipped++;
        } else {
          await Session.create({
            _id: token,
            userId: session.userId,
            expiresAt: new Date(session.expiresAt),
          });
          report.sessionsMigrated++;
        }
      }
      console.log(`  ✓ Migrated ${report.sessionsMigrated} active session(s) (${report.sessionsSkipped} expired/already existed).`);
    }
  } catch (err) {
    console.error('Error during session migration:', err.message);
  }

  // ── Summary Report ─────────────────────────────────────────────────────────
  console.log('\n=== Migration Completed ===');
  console.log(`Users:    ${report.usersMigrated} newly migrated, ${report.usersSkipped} existing/skipped (Total: ${report.usersTotal})`);
  console.log(`Sessions: ${report.sessionsMigrated} newly migrated, ${report.sessionsSkipped} existing/skipped (Total: ${report.sessionsTotal})`);
  console.log('Source local files have been strictly preserved.\n');

  await disconnectDB();
  process.exit(0);
}

runMigration().catch(async (err) => {
  console.error('\nFatal migration error:', err.message);
  try { await disconnectDB(); } catch {}
  process.exit(1);
});
