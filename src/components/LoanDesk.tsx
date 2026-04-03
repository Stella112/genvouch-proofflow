import {
  Sparkles,
  CheckCircle2,
  Link2,
  AlertTriangle,
  DollarSign,
  ShieldAlert,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Loan } from "@/lib/mockData";

interface Props {
  loans: Loan[];
  onApprove: (id: string) => void;
  onRepay: (id: string) => void;
  onTriggerInsurance: (id: string) => void;
}

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "AI Approved", color: "bg-emerald-light text-accent-foreground", icon: BadgeCheck },
  repaid: { label: "Repaid", color: "bg-indigo-light text-indigo", icon: DollarSign },
  defaulted: { label: "Defaulted — LexGuard Active", color: "bg-red-100 text-red-700", icon: ShieldAlert },
};

export function LoanDesk({ loans, onApprove, onRepay, onTriggerInsurance }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        ProofFlow Loan Desk
      </h2>

      {loans.length === 0 && (
        <p className="text-sm text-muted-foreground">No loans yet.</p>
      )}

      <div className="space-y-4">
        {loans.map((loan, i) => {
          const status = statusConfig[loan.status];
          const StatusIcon = status.icon;

          return (
            <Card
              key={loan.id}
              className="glass-card overflow-hidden border-border/50 transition-all hover:shadow-md"
              style={{ animationDelay: `${i * 120}ms`, animation: "fade-in-up 0.5s ease-out forwards" }}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                      {loan.borrower}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      ${loan.amount} <span className="font-normal text-muted-foreground">GEN</span>
                    </span>
                  </div>
                  <Badge className={`${status.color} border-0 gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Purpose & Evidence */}
                <div className="space-y-1">
                  <p className="text-sm text-foreground">{loan.purpose}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Link2 className="h-3 w-3" />
                    <span className="truncate">{loan.evidenceUrl}</span>
                  </p>
                </div>

                {/* AI Verification Block */}
                {loan.aiVerification && (
                  <div className="rounded-lg border border-emerald/20 bg-emerald-light/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald">
                        AI ProofFlow Verdict
                      </span>
                      <span className="text-2xl font-bold text-emerald">
                        {loan.aiVerification.ai_credit_score}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {loan.aiVerification.ai_reasoning}
                    </p>

                    {/* On-Chain Verification */}
                    <div className="flex flex-wrap items-center gap-2 rounded-md bg-surface-elevated p-2.5 border border-border/50">
                      <CheckCircle2 className="h-4 w-4 text-emerald" />
                      <span className="text-xs font-medium text-foreground">On-Chain Verified</span>
                      <Link2 className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">
                        Tx: {loan.aiVerification.tx_hash}
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {loan.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => onApprove(loan.id)}
                      className="gradient-emerald border-0 text-primary-foreground hover:opacity-90 gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Approve via AI ProofFlow
                    </Button>
                  )}
                  {(loan.status === "approved" || loan.status === "pending") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRepay(loan.id)}
                      className="gap-1"
                    >
                      <DollarSign className="h-3.5 w-3.5" />
                      Repay
                    </Button>
                  )}
                  {loan.status !== "defaulted" && loan.status !== "repaid" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onTriggerInsurance(loan.id)}
                      className="gap-1"
                    >
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Trigger LexGuard
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
