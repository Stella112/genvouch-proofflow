export const GENVOUCH_CONTRACT_ADDRESS = "0x9E50680497c14Eb7057Bed10F5d9f9E9B000e6C0";

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

export const initialCircles: Circle[] = [
  {
    id: "circle-1",
    name: "Lagos Builders DAO",
    poolSize: 500,
    apy: 5,
    members: 12,
    status: "active",
  },
  {
    id: "circle-2",
    name: "Nairobi DeFi Collective",
    poolSize: 500,
    apy: 5,
    members: 8,
    status: "forming",
  },
];

export const initialLoans: Loan[] = [
  {
    id: "loan-1",
    borrower: "0x4fa2...8b29",
    amount: 120,
    purpose: "Equipment purchase for mobile repair shop",
    evidenceUrl: "https://ipfs.io/ipfs/Qm...evidence1",
    status: "pending",
    circleId: "circle-1",
  },
  {
    id: "loan-2",
    borrower: "0xd39c...17e4",
    amount: 250,
    purpose: "Seed funding for community garden project",
    evidenceUrl: "https://ipfs.io/ipfs/Qm...evidence2",
    status: "approved",
    circleId: "circle-1",
    aiVerification: {
      ai_credit_score: 92,
      ai_reasoning:
        "Borrower has a strong on-chain history with 4 prior loans repaid on time. Community vouching score is 88/100. Evidence of equipment quote verified via ProofFlow consensus.",
      tx_hash: "0x4fa8c9d2e1b3a7f6...8b29",
    },
  },
];
