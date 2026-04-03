import { useState, useCallback } from "react";
import {
  Circle,
  Loan,
  AIVerification,
  initialCircles,
  initialLoans,
} from "@/lib/mockData";

export function useGenVouch() {
  const [circles, setCircles] = useState<Circle[]>(initialCircles);
  const [loans, setLoans] = useState<Loan[]>(initialLoans);

  const createCircle = useCallback((name: string) => {
    const newCircle: Circle = {
      id: `circle-${Date.now()}`,
      name,
      poolSize: 500,
      apy: 5,
      members: 1,
      status: "forming",
    };
    setCircles((prev) => [...prev, newCircle]);
  }, []);

  const approveLoan = useCallback((loanId: string) => {
    // TODO: Replace with contract.write.approve_loan()
    const verification: AIVerification = {
      ai_credit_score: Math.floor(Math.random() * 15) + 80,
      ai_reasoning:
        "ProofFlow consensus reached across 5 GenLayer validators. Borrower's on-chain kinship graph verified. Evidence URL content hash matched and deemed credible. Credit risk: LOW.",
      tx_hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
    };
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? { ...l, status: "approved" as const, aiVerification: verification }
          : l
      )
    );
  }, []);

  const repayLoan = useCallback((loanId: string) => {
    // TODO: Replace with contract.write.repay_loan()
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? { ...l, status: "repaid" as const } : l
      )
    );
  }, []);

  const triggerInsurance = useCallback((loanId: string) => {
    // TODO: Replace with contract.write.trigger_lexguard()
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId ? { ...l, status: "defaulted" as const } : l
      )
    );
  }, []);

  const requestLoan = useCallback(
    (circleId: string, amount: number, purpose: string, evidenceUrl: string, borrower: string) => {
      // TODO: Replace with contract.write.request_loan()
      const newLoan: Loan = {
        id: `loan-${Date.now()}`,
        borrower: borrower || "0xYou...r000",
        amount,
        purpose,
        evidenceUrl,
        status: "pending",
        circleId,
      };
      setLoans((prev) => [...prev, newLoan]);
    },
    []
  );

  return { circles, loans, createCircle, approveLoan, repayLoan, triggerInsurance, requestLoan };
}
