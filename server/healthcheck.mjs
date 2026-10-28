import mongoose from 'mongoose';
import { connectDB, disconnectDB, maskUri, isDbConnected } from './db.mjs';
import { User } from './models/User.mjs';
import { Session } from './models/Session.mjs';

/**
 * MongoDB Atlas Connection & Schema Health Check
 */
async function checkHealth() {
  console.log('=== Career Coach AI — Database Health Check ===\n');

  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    console.log('Status: UNCONFIGURED');
    console.log('MONGODB_URI is not set in environment or .env.');
    console.log('App is currently using local file-based storage fallback.\n');
    process.exit(0);
  }

  console.log(`Connecting to: ${maskUri(uri)}...`);
  try {
    await connectDB(uri);

    // Ping admin database
    const adminDb = mongoose.connection.db.admin();
    const pingResult = await adminDb.ping();
    console.log('✓ Database Ping OK:', pingResult);

    // Check collection access & document counts
    const userCount = await User.countDocuments();
    const sessionCount = await Session.countDocuments();

    console.log(`✓ Users Collection:    ${userCount} registered account(s)`);
    console.log(`✓ Sessions Collection: ${sessionCount} active session(s)`);
    console.log('\nStatus: HEALTHY (MongoDB Atlas Connected & Ready)\n');

    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('\nStatus: UNHEALTHY');
    console.error('Connection error:', err.message);
    try { await disconnectDB(); } catch {}
    process.exit(1);
  }
}

checkHealth();
