// Contract address — kept for backward compat imports
export const GENVOUCH_CONTRACT_ADDRESS =
  "0x9E50680497c14Eb7057Bed10F5d9f9E9B000e6C0";

// Types shared across the app
export interface Circle {
  id: string;
  name: string;
  poolSize: number;
  apy: number;
  members: number;
  status: "active" | "forming";
}

export interface AIVerification {
  ai_credit_score: number;
  ai_reasoning: string;
  tx_hash: string;
}

export interface Loan {
  id: string;
  borrower: string;
  amount: number;
  purpose: string;
  evidenceUrl: string;
  status: "pending" | "approved" | "repaid" | "defaulted";
  circleId: string;
  aiVerification?: AIVerification;
}
