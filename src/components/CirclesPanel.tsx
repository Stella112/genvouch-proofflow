import { useState } from "react";
import { Plus, Users, TrendingUp, CircleDot, Loader2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Circle } from "@/lib/mockData";

interface Props {
  circles: Circle[];
  onCreateCircle: (
    name: string,
    description: string,
    contributionAmount: number,
    maxMembers: number,
    interestRatePct: number,
    cycleDays: number,
  ) => Promise<void> | void;
  onRequestLoan?: (
    circleId: string,
    amount: number,
    purpose: string,
    evidenceUrl: string,
  ) => Promise<void> | void;
}

export function CirclesPanel({ circles, onCreateCircle, onRequestLoan }: Props) {
  // Create Circle form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contributionAmount, setContributionAmount] = useState("100");
  const [maxMembers, setMaxMembers] = useState("10");
  const [interestRate, setInterestRate] = useState("5");
  const [cycleDays, setCycleDays] = useState("30");

  // Request Loan form
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [requestingLoan, setRequestingLoan] = useState(false);
  const [loanCircleId, setLoanCircleId] = useState("0");
  const [loanAmount, setLoanAmount] = useState("50");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [loanEvidenceUrl, setLoanEvidenceUrl] = useState("");

  const handleCreate = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      await onCreateCircle(
        name.trim(),
        description.trim() || "A GenVouch lending circle",
        parseInt(contributionAmount) || 100,
        parseInt(maxMembers) || 10,
        parseInt(interestRate) || 5,
        parseInt(cycleDays) || 30,
      );
      setName("");
      setDescription("");
      setShowCreateForm(false);
    } finally {
      setCreating(false);
    }
  };

  const handleRequestLoan = async () => {
    if (!loanPurpose.trim() || !loanEvidenceUrl.trim() || requestingLoan) return;
    if (!onRequestLoan) return;
    setRequestingLoan(true);
    try {
      await onRequestLoan(
        loanCircleId,
        parseInt(loanAmount) || 50,
        loanPurpose.trim(),
        loanEvidenceUrl.trim(),
      );
      setLoanPurpose("");
      setLoanEvidenceUrl("");
      setShowLoanForm(false);
    } finally {
      setRequestingLoan(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Lending Circles</h2>
        <Button
          size="sm"
          className="gradient-emerald border-0 text-primary-foreground hover:opacity-90"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <Plus className="mr-1 h-4 w-4" /> Create
        </Button>
      </div>

      {/* Inline Create Circle Form */}
      {showCreateForm && (
        <Card className="glass-card border-emerald/30 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Create a Lending Circle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="circle-name" className="text-xs">Circle Name</Label>
              <Input
                id="circle-name"
                placeholder="e.g. Lagos AI Builders Circle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="circle-desc" className="text-xs">Description</Label>
              <Input
                id="circle-desc"
                placeholder="A decentralized credit union..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Contribution</Label>
                <Input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Members</Label>
                <Input
                  type="number"
                  value={maxMembers}
                  onChange={(e) => setMaxMembers(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Interest Rate %</Label>
                <Input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Cycle Days</Label>
                <Input
                  type="number"
                  value={cycleDays}
                  onChange={(e) => setCycleDays(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="gradient-emerald border-0 text-primary-foreground flex-1"
              >
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Launch Circle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Circle Cards */}
      <div className="space-y-3">
        {circles.map((circle, i) => (
          <Card
            key={circle.id}
            className="glass-card overflow-hidden border-border/50 transition-all hover:shadow-md"
            style={{
              animationDelay: `${i * 100}ms`,
              animation: "fade-in-up 0.5s ease-out forwards",
              opacity: 0,
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">{circle.name}</CardTitle>
                <Badge
                  variant={circle.status === "active" ? "default" : "secondary"}
                  className={
                    circle.status === "active"
                      ? "bg-emerald-light text-accent-foreground border-0"
                      : ""
                  }
                >
                  {circle.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-2">
                <CircleDot className="mx-auto mb-1 h-4 w-4 text-emerald" />
                <p className="text-xs text-muted-foreground">Pool</p>
                <p className="text-sm font-semibold">${circle.poolSize}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <TrendingUp className="mx-auto mb-1 h-4 w-4 text-indigo" />
                <p className="text-xs text-muted-foreground">APY</p>
                <p className="text-sm font-semibold">{circle.apy}%</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <Users className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Members</p>
                <p className="text-sm font-semibold">{circle.members}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Request Loan Section */}
      <div className="pt-2">
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2"
          onClick={() => setShowLoanForm(!showLoanForm)}
        >
          <FileText className="h-4 w-4" /> Request a Loan
        </Button>
      </div>

      {showLoanForm && (
        <Card className="glass-card border-indigo/30 border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Request a Loan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">Circle ID</Label>
                <Input
                  value={loanCircleId}
                  onChange={(e) => setLoanCircleId(e.target.value)}
                  placeholder="0"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount (GEN)</Label>
                <Input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="50"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Purpose</Label>
              <Input
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                placeholder="Buying a server for my AI app"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Evidence URL</Label>
              <Input
                value={loanEvidenceUrl}
                onChange={(e) => setLoanEvidenceUrl(e.target.value)}
                placeholder="https://www.digitalocean.com/pricing/droplets"
                className="h-8 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLoanForm(false)}
                disabled={requestingLoan}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRequestLoan}
                disabled={requestingLoan || !loanPurpose.trim() || !loanEvidenceUrl.trim()}
                className="gradient-indigo border-0 text-primary-foreground flex-1"
              >
                {requestingLoan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Loan Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
