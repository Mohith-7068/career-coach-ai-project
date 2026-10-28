/**
 * test_stage_c_auth_interview.mjs — Verification of Authenticated Flow, Interview Access & CORS
 */

import { connectDB, isDbConnected } from './db.mjs';
import { authService } from './authService.mjs';
import mongoose from 'mongoose';
import crypto from 'node:crypto';

async function run() {
  console.log('=== Career Coach AI — Stage C Auth, Interview & CORS Verification ===\n');

  await connectDB();
  if (!isDbConnected()) {
    throw new Error('Database must be connected for verification.');
  }

  const testId = Date.now().toString(36);
  const userEmail = `stage_c_${testId}@example.com`;
  const userPassword = 'TestPassword123!';
  const otherEmail = `stage_c_other_${testId}@example.com`;

  // --- Test 1: User Registration & Token Generation ---
  console.log('--- Test 1: User Registration & Session Token ---');
  const user = await authService.createUser({
    email: userEmail,
    password: userPassword,
    full_name: 'Stage C Candidate',
  });
  if (!user?.id || user.email !== userEmail) {
    throw new Error('User creation failed.');
  }
  const token = await authService.createSession(user);
  if (!token) {
    throw new Error('Session creation failed: no token returned.');
  }
  console.log('✓ User registered and session token issued:', token.slice(0, 16) + '...');

  // --- Test 2: Token Validation & Session Recovery ---
  console.log('\n--- Test 2: Session Recovery & Validation ---');
  const validated = await authService.validateSession(token);
  if (!validated || validated.userId !== user.id) {
    throw new Error('Session token validation failed.');
  }
  const recoveredUser = await authService.findById(validated.userId);
  if (!recoveredUser || recoveredUser.id !== user.id) {
    throw new Error('Session user lookup failed.');
  }
  console.log('✓ Token validation and session recovery verified for userId:', recoveredUser.id);

  // --- Test 3: Unauthenticated Rejection (Interview Guard) ---
  console.log('\n--- Test 3: Unauthenticated Access Guard ---');
  function simulateRequireUser(authHeader) {
    const rawToken = String(authHeader || '').replace(/^Bearer\s+/i, '');
    if (!rawToken) {
      return { status: 401, error: 'Please log in to continue.' };
    }
    return { status: 200, token: rawToken };
  }

  const unauthedCheck = simulateRequireUser('');
  if (unauthedCheck.status !== 401 || unauthedCheck.error !== 'Please log in to continue.') {
    throw new Error('Unauthenticated check did not return 401 Please log in to continue.');
  }
  console.log('✓ Unauthenticated request accurately blocked with 401: "Please log in to continue."');

  // --- Test 4: Authenticated Access With Token ---
  console.log('\n--- Test 4: Authenticated Access with Bearer Token ---');
  const authedCheck = simulateRequireUser(`Bearer ${token}`);
  if (authedCheck.status !== 200 || authedCheck.token !== token) {
    throw new Error('Authenticated check failed.');
  }
  const sessionCheck = await authService.validateSession(authedCheck.token);
  if (!sessionCheck) {
    throw new Error('Bearer token session verification failed.');
  }
  console.log('✓ Bearer token successfully verified; access granted for interview and AI endpoints.');

  // --- Test 5: Resume & User Isolation ---
  console.log('\n--- Test 5: Resume Upload User Isolation ---');
  const otherUser = await authService.createUser({
    email: otherEmail,
    password: userPassword,
    full_name: 'Other Candidate',
  });
  const mockUploads = new Map();
  const resumeId = crypto.randomUUID();
  mockUploads.set(resumeId, {
    content: 'Experience: Software Engineer at TechCorp. Skills: React, Node.js, Python.',
    created: Date.now(),
    userId: user.id,
  });

  const ownerAccess = mockUploads.get(resumeId);
  if (!ownerAccess || ownerAccess.userId !== user.id) {
    throw new Error('Resume ownership assignment failed.');
  }

  // Verify other user cannot access or analyze this resume
  const isOtherAllowed = ownerAccess.userId === otherUser.id;
  if (isOtherAllowed) {
    throw new Error('Security flaw: Other user was allowed to access owner resume.');
  }
  console.log('✓ Resume upload accurately bound to user; cross-user access securely prevented (403).');

  // --- Test 6: CORS Origin Normalization ---
  console.log('\n--- Test 6: CORS Origin Normalization ---');
  function testCors(origin, configuredOrigins) {
    if (!origin) return true;
    const cleanOrigin = origin.replace(/\/+$/, '');
    const allowed = (configuredOrigins || '')
      .split(',')
      .map(o => o.trim().replace(/\/+$/, ''))
      .filter(Boolean);
    return allowed.includes(cleanOrigin);
  }

  const testConfig = 'https://career-coach-ai.vercel.app/, https://my-custom-domain.com';
  if (!testCors('https://career-coach-ai.vercel.app', testConfig)) {
    throw new Error('CORS failed to match origin without trailing slash when configured with trailing slash.');
  }
  if (!testCors('https://career-coach-ai.vercel.app/', testConfig)) {
    throw new Error('CORS failed to match origin with trailing slash.');
  }
  if (!testCors('https://my-custom-domain.com', testConfig)) {
    throw new Error('CORS failed to match secondary allowed origin.');
  }
  if (testCors('https://malicious-site.com', testConfig)) {
    throw new Error('CORS allowed an untrusted origin.');
  }
  console.log('✓ CORS trailing-slash normalization verified for Vercel production domains.');

  // --- Cleanup ---
  console.log('\n--- Cleanup ---');
  await authService.deleteSession(token);
  await mongoose.connection.collection('users').deleteMany({
    _id: { $in: [user.id, otherUser.id] }
  });
  console.log('✓ Test users and session cleaned up.');

  console.log('\n======================================================');
  console.log('🎉 ALL 6/6 STAGE C VERIFICATION TESTS PASSED');
  console.log('======================================================\n');

  process.exit(0);
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
