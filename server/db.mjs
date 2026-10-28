import mongoose from 'mongoose';
import dns from 'node:dns';

// Ensure reliable MongoDB Atlas SRV DNS resolution on Windows / multi-adapter environments
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

/**
 * Reusable MongoDB Connection Module
 * 
 * Safely manages connection to MongoDB Atlas or local MongoDB.
 * Sanitizes connection strings to prevent credential exposure in logs.
 * Enforces production security policies.
 */

let isConnected = false;

/**
 * Safely mask connection string for logging.
 * Replaces username:password with ***:***
 */
export function maskUri(uri) {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/\/\/(.*?)@/, '//***:***@');
}

/**
 * Connect to MongoDB Atlas
 * @param {string} [uri] Connection string (defaults to process.env.MONGODB_URI)
 * @returns {Promise<typeof mongoose>}
 */
export async function connectDB(uri = process.env.MONGODB_URI) {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  if (!uri || !uri.trim()) {
    if (isProduction) {
      const err = new Error('FATAL: MONGODB_URI is required in production environment.');
      console.error(err.message);
      throw err;
    }
    console.warn('⚠️  MONGODB_URI not provided. Local file-based storage will be used for authentication in development.');
    isConnected = false;
    return null;
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 8000,
      retryWrites: true,
      autoIndex: !isProduction, // Disable auto-index creation in production for performance
    };

    console.log(`Connecting to MongoDB at ${maskUri(uri)}...`);
    await mongoose.connect(uri, opts);
    isConnected = true;
    console.log('✓ Successfully connected to MongoDB Atlas');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB connection lost.');
      isConnected = false;
    });

    return mongoose;
  } catch (err) {
    isConnected = false;
    console.error(`MongoDB connection failed (${maskUri(uri)}):`, err.message);
    if (isProduction) {
      throw new Error(`Production startup aborted: Unable to connect to MongoDB Atlas (${err.message})`);
    }
    throw err;
  }
}

/**
 * Check if MongoDB connection is active
 * @returns {boolean}
 */
export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Disconnect cleanly from MongoDB
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
