import { useState, useCallback, useEffect } from "react";
import { getClient, GENVOUCH_CONTRACT_ADDRESS } from "@/lib/genLayerClient";
import type { Circle, Loan, AIVerification } from "@/lib/mockData";
import { useWallet } from "@/contexts/WalletContext";

export function useGenVouch() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address } = useWallet();

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

      // Contract returns stringified JSON like '{"0": {...}, "1": {...}}'
      const parsed = typeof result === "string" ? JSON.parse(result) : result;
      const mapped: Circle[] = Object.values(parsed).map((c: any) => ({
        id: c.id ?? "0",
        name: c.name ?? "Unnamed Circle",
        poolSize: Number(c.total_pool ?? 0),
        apy: Number(c.interest_rate_pct ?? 5),
        members: Number(c.current_members ?? 0),
        maxMembers: Number(c.max_members ?? 10),
        contributionAmount: Number(c.contribution_amount ?? 100),
        status: c.status === "ACTIVE" ? "active" as const : "forming" as const,
      }));
      setCircles(mapped);
    } catch (err: any) {
      console.warn("Failed to fetch circles:", err.message);
      setError(err.message);
      setCircles([]);
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

      const parsed = typeof result === "string" ? JSON.parse(result) : result;
      const mapped: Loan[] = Object.values(parsed).map((l: any) => ({
        id: l.id ?? "0",
        borrower: l.borrower
          ? `${l.borrower.slice(0, 6)}...${l.borrower.slice(-4)}`
          : "0x0000...0000",
        amount: Number(l.amount ?? 0),
        purpose: l.purpose ?? "",
        evidenceUrl: l.evidence_url ?? "",
        status: mapLoanStatus(l.status),
        circleId: l.circle_id ?? "",
        aiVerification:
          l.ai_credit_score && l.ai_credit_score > 0
            ? {
                ai_credit_score: Number(l.ai_credit_score),
                ai_reasoning: l.ai_reasoning || "No reasoning provided.",
                tx_hash: "On-chain verified",
              }
            : undefined,
      }));
      setLoans(mapped);
    } catch (err: any) {
      console.warn("Failed to fetch loans:", err.message);
      setError(err.message);
      setLoans([]);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCircles(), fetchLoans()]).finally(() => setLoading(false));
  }, [fetchCircles, fetchLoans]);

  // --- Write operations (match EXACT contract signatures) ---

  const createCircle = useCallback(
    async (
      name: string,
      description: string = "A GenVouch lending circle",
      contributionAmount: number = 100,
      maxMembers: number = 10,
      interestRatePct: number = 5,
      cycleDays: number = 30,
    ) => {
      if (!address) {
        setError("Please connect your wallet first.");
        return;
      }
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "create_circle",
          args: [
            name,
            description,
            contributionAmount,
            maxMembers,
            interestRatePct,
            cycleDays,
            address,
            8,  // dev_fee_pct
          ],
          value: 0n,
        });
        await fetchCircles();
      } catch (err: any) {
        console.error("create_circle failed:", err);
        setError(err.message);
      }
    },
    [fetchCircles, address]
  );

  const requestLoan = useCallback(
    async (
      circleId: string,
      amount: number,
      purpose: string,
      evidenceUrl: string,
    ) => {
      if (!address) {
        setError("Please connect your wallet first.");
        return;
      }
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "request_loan",
          args: [circleId, address, amount, purpose, evidenceUrl],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("request_loan failed:", err);
        setError(err.message);
      }
    },
    [fetchLoans, address]
  );

  const approveLoan = useCallback(
    async (loanId: string) => {
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "approve_loan",
          args: [loanId],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("approve_loan failed:", err);
        setError(err.message);
      }
    },
    [fetchLoans]
  );

  const repayLoan = useCallback(
    async (loanId: string) => {
      if (!address) {
        setError("Please connect your wallet first.");
        return;
      }
      // Find the loan to get the amount
      const loan = loans.find((l) => l.id === loanId);
      const amount = loan?.amount ?? 100;
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "repay_loan",
          args: [loanId, amount, address],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("repay_loan failed:", err);
        setError(err.message);
      }
    },
    [fetchLoans, address, loans]
  );

  const triggerInsurance = useCallback(
    async (loanId: string) => {
      try {
        await client.writeContract({
          address: GENVOUCH_CONTRACT_ADDRESS,
          functionName: "trigger_lexguard_insurance",
          args: [loanId],
          value: 0n,
        });
        await fetchLoans();
      } catch (err: any) {
        console.error("trigger_lexguard_insurance failed:", err);
        setError(err.message);
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

function mapLoanStatus(
  status: string
): "pending" | "approved" | "repaid" | "defaulted" {
  switch (status) {
    case "ACTIVE":
      return "approved";
    case "REPAID":
      return "repaid";
    case "DEFAULTED":
      return "defaulted";
    case "REJECTED":
      return "defaulted";
    default:
      return "pending";
  }
}
