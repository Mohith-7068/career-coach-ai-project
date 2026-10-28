import { User } from './User.mjs';
import { Session } from './Session.mjs';
import { CareerState } from './CareerState.mjs';
import { CoinTransaction } from './CoinTransaction.mjs';
import { RewardClaim } from './RewardClaim.mjs';
import { ResumeAnalysis } from './ResumeAnalysis.mjs';
import { InterviewSession } from './InterviewSession.mjs';
import { SpeechSession } from './SpeechSession.mjs';

export {
  User,
  Session,
  CareerState,
  CoinTransaction,
  RewardClaim,
  ResumeAnalysis,
  InterviewSession,
  SpeechSession,
};

export const ENTITY_MODELS = {
  CareerState,
  CoinTransaction,
  RewardClaim,
  ResumeAnalysis,
  InterviewSession,
  SpeechSession,
  User,
};
