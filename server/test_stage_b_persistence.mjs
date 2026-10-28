import assert from 'node:assert/strict';
import { connectDB, isDbConnected } from './db.mjs';
import {
  CareerState,
  CoinTransaction,
  RewardClaim,
  ResumeAnalysis,
  InterviewSession,
  SpeechSession,
  User,
  Session
} from './models/index.mjs';

const API_BASE = 'http://localhost:8787';

async function apiRequest(path, options = {}) {
  const { token, body, method = 'GET' } = options;
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runStageBTests() {
  console.log('=== Stage B: Cloud Persistence & User Isolation Test Suite ===\n');

  // Step 0: Ensure DB is connected
  await connectDB();
  assert.equal(isDbConnected(), true, 'DB should be connected to MongoDB Atlas');
  console.log('✓ [0/6] MongoDB Atlas Connection Verified');

  const rand = Math.random().toString(36).slice(2, 7);
  const emailA = `stage_b_user_a_${rand}@example.com`;
  const emailB = `stage_b_user_b_${rand}@example.com`;
  const password = 'StrongPassword123!';

  // Step 1: Register User A and User B
  console.log('\n--- Step 1: Register Users ---');
  const regA = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { email: emailA, password, full_name: 'User A' },
  });
  assert.equal(regA.status, 201, `User A registration failed: ${JSON.stringify(regA.data)}`);
  const tokenA = regA.data.access_token;
  const userA = regA.data.user;

  const regB = await apiRequest('/api/auth/register', {
    method: 'POST',
    body: { email: emailB, password, full_name: 'User B' },
  });
  assert.equal(regB.status, 201, `User B registration failed: ${JSON.stringify(regB.data)}`);
  const tokenB = regB.data.access_token;
  const userB = regB.data.user;

  console.log(`✓ User A registered (ID: ${userA.id})`);
  console.log(`✓ User B registered (ID: ${userB.id})`);

  // Step 2: Entity CRUD for User A
  console.log('\n--- Step 2: Entity CRUD & Persistence for User A ---');

  // 2a. CareerState
  const csCreate = await apiRequest('/api/entities/CareerState', {
    method: 'POST',
    token: tokenA,
    body: {
      target_role: 'Cloud Architect',
      coin_balance: 150,
      xp: 300,
      streak_days: 3,
      resume_score: 85,
    },
  });
  assert.equal(csCreate.status, 201, `CareerState create failed: ${JSON.stringify(csCreate.data)}`);
  const careerStateId = csCreate.data.id;
  assert.equal(csCreate.data.target_role, 'Cloud Architect');
  assert.equal(csCreate.data.userId, userA.id);
  console.log('✓ CareerState created for User A');

  // 2b. CoinTransaction with reference_id
  const txnCreate = await apiRequest('/api/entities/CoinTransaction', {
    method: 'POST',
    token: tokenA,
    body: {
      amount: 50,
      transaction_type: 'DAILY_CHECKIN',
      description: 'Daily check-in reward',
      reference_id: `checkin_${rand}_day1`,
      balance_after: 200,
    },
  });
  assert.equal(txnCreate.status, 201, `CoinTransaction create failed: ${JSON.stringify(txnCreate.data)}`);
  const txnId = txnCreate.data.id;
  assert.equal(txnCreate.data.amount, 50);
  assert.equal(txnCreate.data.userId, userA.id);
  console.log('✓ CoinTransaction created for User A');

  // 2c. ResumeAnalysis
  const resumeCreate = await apiRequest('/api/entities/ResumeAnalysis', {
    method: 'POST',
    token: tokenA,
    body: {
      score: 88,
      word_count: 450,
      profile_summary: 'Senior software engineer with 5 years experience',
      extracted_skills: ['Node.js', 'React', 'MongoDB', 'Docker'],
      technical_skills: ['JavaScript', 'TypeScript', 'Express'],
    },
  });
  assert.equal(resumeCreate.status, 201, `ResumeAnalysis create failed: ${JSON.stringify(resumeCreate.data)}`);
  const resumeId = resumeCreate.data.id;
  console.log('✓ ResumeAnalysis created for User A');

  // 2d. InterviewSession
  const interviewCreate = await apiRequest('/api/entities/InterviewSession', {
    method: 'POST',
    token: tokenA,
    body: {
      role: 'Backend Engineer',
      experience_level: 'mid',
      questions: [{ question_text: 'Explain indexing in MongoDB.', question_type: 'technical' }],
      answers: [{ question: 'Explain indexing...', answer: 'B-tree indexes speed up lookups', score: 90 }],
      average_score: 90,
      completed: true,
    },
  });
  assert.equal(interviewCreate.status, 201, `InterviewSession create failed: ${JSON.stringify(interviewCreate.data)}`);
  const interviewId = interviewCreate.data.id;
  console.log('✓ InterviewSession created for User A');

  // 2e. SpeechSession
  const speechCreate = await apiRequest('/api/entities/SpeechSession', {
    method: 'POST',
    token: tokenA,
    body: {
      transcript: 'Hello and welcome to my presentation.',
      word_count: 6,
      wpm: 120,
      score: 92,
      filler_count: 0,
    },
  });
  assert.equal(speechCreate.status, 201, `SpeechSession create failed: ${JSON.stringify(speechCreate.data)}`);
  const speechId = speechCreate.data.id;
  console.log('✓ SpeechSession created for User A');

  // 2f. RewardClaim
  const claimCreate = await apiRequest('/api/entities/RewardClaim', {
    method: 'POST',
    token: tokenA,
    body: {
      reward_id: 'mock_interview_pass',
      title: 'Free Mock Interview Pass',
      cost: 100,
    },
  });
  assert.equal(claimCreate.status, 201, `RewardClaim create failed: ${JSON.stringify(claimCreate.data)}`);
  const claimId = claimCreate.data.id;
  console.log('✓ RewardClaim created for User A');

  // Step 3: Update and Retrieve for User A
  console.log('\n--- Step 3: Update & Read for User A ---');
  const updateRes = await apiRequest(`/api/entities/CareerState/${careerStateId}`, {
    method: 'PATCH',
    token: tokenA,
    body: { coin_balance: 200, xp: 400 },
  });
  assert.equal(updateRes.status, 200, `Update failed: ${JSON.stringify(updateRes.data)}`);
  assert.equal(updateRes.data.coin_balance, 200);
  assert.equal(updateRes.data.xp, 400);

  const getRes = await apiRequest(`/api/entities/CareerState/${careerStateId}`, {
    token: tokenA,
  });
  assert.equal(getRes.status, 200);
  assert.equal(getRes.data.coin_balance, 200);
  console.log('✓ User A successfully updated and read their CareerState');

  // Step 4: Strict User Isolation Testing
  console.log('\n--- Step 4: User Isolation & Access Control ---');

  // User B tries to GET User A's CareerState
  const bGetA = await apiRequest(`/api/entities/CareerState/${careerStateId}`, {
    token: tokenB,
  });
  assert.equal(bGetA.status, 404, 'User B must not be able to read User A CareerState');
  console.log('✓ User B denied access to User A CareerState (404 Not Found)');

  // User B tries to PATCH User A's CareerState
  const bPatchA = await apiRequest(`/api/entities/CareerState/${careerStateId}`, {
    method: 'PATCH',
    token: tokenB,
    body: { coin_balance: 99999 },
  });
  assert.equal(bPatchA.status, 404, 'User B must not be able to modify User A CareerState');
  console.log('✓ User B denied modification of User A CareerState (404 Not Found)');

  // User B lists CareerState records -> Should be empty for User B
  const bList = await apiRequest('/api/entities/CareerState', {
    token: tokenB,
  });
  assert.equal(bList.status, 200);
  assert.equal(bList.data.length, 0, 'User B should see 0 records');
  console.log('✓ User B lists 0 records (User A records strictly filtered out)');

  // Unauthenticated request should be rejected (401)
  const unauthGet = await apiRequest(`/api/entities/CareerState/${careerStateId}`);
  assert.equal(unauthGet.status, 401, 'Unauthenticated request must return 401');
  console.log('✓ Unauthenticated request rejected (401 Unauthorized)');

  // Step 5: Ledger Idempotency Guard
  console.log('\n--- Step 5: Ledger Idempotency Guard ---');
  // Re-posting exact same reference_id should return existing record, not duplicate
  const dupeTxn = await apiRequest('/api/entities/CoinTransaction', {
    method: 'POST',
    token: tokenA,
    body: {
      amount: 50,
      transaction_type: 'DAILY_CHECKIN',
      description: 'Daily check-in reward duplicate',
      reference_id: `checkin_${rand}_day1`,
      balance_after: 250,
    },
  });
  assert.equal(dupeTxn.status, 200, 'Duplicate reference_id should return 200 existing');
  assert.equal(dupeTxn.data.id, txnId, 'Must return the original transaction ID');

  // Verify only 1 transaction exists in DB for this reference_id
  const dbTxns = await CoinTransaction.find({ userId: userA.id, reference_id: `checkin_${rand}_day1` });
  assert.equal(dbTxns.length, 1, 'Atlas must contain exactly 1 transaction for reference_id');
  console.log('✓ CoinTransaction reference_id idempotency enforced in MongoDB Atlas');

  // Step 6: Safe Migration from LocalStorage (POST /api/sync/migrate-local)
  console.log('\n--- Step 6: LocalStorage Migration Endpoint ---');
  const localMigrationPayload = {
    entityStores: {
      ResumeAnalysis: [
        {
          id: `local_resume_${rand}`,
          score: 75,
          word_count: 320,
          profile_summary: 'Migrated from client browser storage',
          created_date: new Date(Date.now() - 3600000).toISOString(),
          updated_date: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      CoinTransaction: [
        {
          id: `local_txn_${rand}`,
          amount: 25,
          transaction_type: 'RESUME_ANALYSIS_REWARD',
          description: 'Migrated local reward',
          reference_id: `migrated_reward_${rand}`,
          balance_after: 225,
          created_date: new Date().toISOString(),
        },
        // Duplicate check within migration payload
        {
          id: `local_txn_${rand}_dupe`,
          amount: 25,
          transaction_type: 'RESUME_ANALYSIS_REWARD',
          description: 'Migrated duplicate reward',
          reference_id: `migrated_reward_${rand}`,
          balance_after: 250,
          created_date: new Date().toISOString(),
        },
      ],
    },
  };

  const syncRes = await apiRequest('/api/sync/migrate-local', {
    method: 'POST',
    token: tokenA,
    body: localMigrationPayload,
  });
  assert.equal(syncRes.status, 200, `Migration failed: ${JSON.stringify(syncRes.data)}`);
  assert.equal(syncRes.data.success, true);
  assert.equal(syncRes.data.summary.migrated, 2, 'Should migrate 1 resume and 1 txn');
  assert.equal(syncRes.data.summary.skipped, 1, 'Should skip the duplicate reference_id txn');
  console.log('✓ Migration safely executed without duplicate records or data corruption');

  // Verify migrated resume exists in MongoDB Atlas
  const atlasMigratedResume = await ResumeAnalysis.findOne({ _id: `local_resume_${rand}`, userId: userA.id });
  assert.ok(atlasMigratedResume, 'Migrated resume must exist in Atlas');
  assert.equal(atlasMigratedResume.score, 75);
  console.log('✓ Migrated record verified in MongoDB Atlas');

  // Step 7: Delete Record for User A
  console.log('\n--- Step 7: Delete Entity ---');
  const delRes = await apiRequest(`/api/entities/SpeechSession/${speechId}`, {
    method: 'DELETE',
    token: tokenA,
  });
  assert.equal(delRes.status, 200);
  const atlasSpeechCheck = await SpeechSession.findById(speechId);
  assert.equal(atlasSpeechCheck, null, 'Deleted speech session must be removed from Atlas');
  console.log('✓ Entity successfully deleted and removed from MongoDB Atlas');

  // Cleanup test users and test entities
  console.log('\n--- Cleanup ---');
  await CareerState.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await CoinTransaction.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await RewardClaim.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await ResumeAnalysis.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await InterviewSession.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await SpeechSession.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await Session.deleteMany({ userId: { $in: [userA.id, userB.id] } });
  await User.deleteMany({ _id: { $in: [userA.id, userB.id] } });
  console.log('✓ Test data cleaned up successfully');

  console.log('\n======================================================');
  console.log('🎉 ALL 7/7 STAGE B PERSISTENCE & ISOLATION TESTS PASSED');
  console.log('======================================================\n');
  process.exit(0);
}

runStageBTests().catch((err) => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
