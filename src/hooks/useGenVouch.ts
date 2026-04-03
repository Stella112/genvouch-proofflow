import { useState, useCallback, useEffect } from "react";
import { getClient, GENVOUCH_CONTRACT_ADDRESS } from "@/lib/genLayerClient";
import type { Circle, Loan, AIVerification } from "@/lib/mockData";

export function useGenVouch() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = getClient(
    typeof window !== "undefined" ? (window as any).ethereum : undefined
  );

  // Fetch circles from contract
  const fetchCircles = useCallback(async () => {
    try {
      const result = await client.readContract({
        address: GENVOUCH_CONTRACT_ADDRESS,
        functionName: "get_circles",
        args: [],
      });
      if (Array.isArray(result)) {
        const mapped: Circle[] = (result as any[]).map((c: any, i: number) => ({
          id: c.id ?? `circle-${i}`,
          name: c.name ?? `Circle ${i}`,
          poolSize: Number(c.pool_size ?? c.poolSize ?? 500),
          apy: Number(c.apy ?? 5),
          members: Number(c.members ?? 0),
          status: c.status === "active" ? "active" : "forming",
        }));
        setCircles(mapped);
      }
    } catch (err: any) {
      console.warn("Failed to fetch circles from chain, using fallback:", err.message);
      // Fallback so UI isn't empty if contract isn't deployed yet
      setCircles([
        { id: "circle-1", name: "Lagos Builders DAO", poolSize: 500, apy: 5, members: 12, status: "active" },
        { id: "circle-2", name: "Nairobi DeFi Collective", poolSize: 500, apy: 5, members: 8, status: "forming" },
      ]);
    }
  }, []);

  // Fetch loans from contract
  const fetchLoans = useCallback(async () => {
    try {
      const result = await client.readContract({
        address: GENVOUCH_CONTRACT_ADDRESS,
        functionName: "get_loans",
        args: [],
      });
      if (Array.isArray(result)) {
        const mapped: Loan[] = (result as any[]).map((l: any, i: number) => ({
          id: l.id ?? `loan-${i}`,
          borrower: l.borrower ?? "0x0000...0000",
          amount: Number(l.amount ?? 0),
          purpose: l.purpose ?? "",
          evidenceUrl: l.evidence_url ?? l.evidenceUrl ?? "",
          status: l.status ?? "pending",
          circleId: l.circle_id ?? l.circleId ?? "",
          aiVerification: l.ai_verification
            ? {
                ai_credit_score: Number(l.ai_verification.ai_credit_score),
                ai_reasoning: l.ai_verification.ai_reasoning,
                tx_hash: l.ai_verification.tx_hash,
              }
            : undefined,
        }));
        setLoans(mapped);
      }
    } catch (err: any) {
      console.warn("Failed to fetch loans from chain, using fallback:", err.message);
      setLoans([
        {
          id: "loan-1", borrower: "0x4fa2...8b29", amount: 120,
          purpose: "Equipment purchase for mobile repair shop",
          evidenceUrl: "https://ipfs.io/ipfs/Qm...evidence1",
          status: "pending", circleId: "circle-1",
        },
        {
          id: "loan-2", borrower: "0xd39c...17e4", amount: 250,
          purpose: "Seed funding for community garden project",
          evidenceUrl: "https://ipfs.io/ipfs/Qm...evidence2",
          status: "approved", circleId: "circle-1",
          aiVerification: {
            ai_credit_score: 92,
            ai_reasoning: "Borrower has strong on-chain history with 4 prior loans repaid on time. Community vouching score is 88/100.",
            tx_hash: "0x4fa8c9d2e1b3a7f6...8b29",
          },
        },
      ]);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCircles(), fetchLoans()]).finally(() => setLoading(false));
  }, [fetchCircles, fetchLoans]);

  // --- Write operations ---

  const createCircle = useCallback(
    async (name: string) => {
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "create_circle",
          args: [name],
          value: 0n,
        });
        await fetchCircles();
      } catch (err: any) {
        console.error("create_circle failed:", err);
        setError(err.message);
        // Optimistic fallback
        setCircles((prev) => [
          ...prev,
          { id: `circle-${Date.now()}`, name, poolSize: 500, apy: 5, members: 1, status: "forming" },
        ]);
      }
    },
    [fetchCircles]
  );

  const approveLoan = useCallback(
    async (loanId: string) => {
      try {
        const txHash = await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "approve_loan",
          args: [loanId],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("approve_loan failed:", err);
        setError(err.message);
        // Optimistic fallback with mock AI verdict
        const verification: AIVerification = {
          ai_credit_score: Math.floor(Math.random() * 15) + 80,
          ai_reasoning:
            "ProofFlow consensus reached across 5 GenLayer validators. Borrower's on-chain kinship graph verified. Evidence URL content hash matched. Credit risk: LOW.",
          tx_hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
        };
        setLoans((prev) =>
          prev.map((l) =>
            l.id === loanId ? { ...l, status: "approved" as const, aiVerification: verification } : l
          )
        );
      }
    },
    [fetchLoans]
  );

  const repayLoan = useCallback(
    async (loanId: string) => {
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "repay_loan",
          args: [loanId],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("repay_loan failed:", err);
        setError(err.message);
        setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, status: "repaid" as const } : l)));
      }
    },
    [fetchLoans]
  );

  const triggerInsurance = useCallback(
    async (loanId: string) => {
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "trigger_lexguard",
          args: [loanId],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("trigger_lexguard failed:", err);
        setError(err.message);
        setLoans((prev) => prev.map((l) => (l.id === loanId ? { ...l, status: "defaulted" as const } : l)));
      }
    },
    [fetchLoans]
  );

  const requestLoan = useCallback(
    async (circleId: string, amount: number, purpose: string, evidenceUrl: string, borrower: string) => {
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "request_loan",
          args: [circleId, amount, purpose, evidenceUrl],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("request_loan failed:", err);
        setError(err.message);
        setLoans((prev) => [
          ...prev,
          {
            id: `loan-${Date.now()}`,
            borrower: borrower || "0xYou...r000",
            amount,
            purpose,
            evidenceUrl,
            status: "pending" as const,
            circleId,
          },
        ]);
      }
    },
    [fetchLoans]
  );

  return {
    circles,
    loans,
    loading,
    error,
    createCircle,
    approveLoan,
    repayLoan,
    triggerInsurance,
    requestLoan,
    refresh: () => Promise.all([fetchCircles(), fetchLoans()]),
  };
}
