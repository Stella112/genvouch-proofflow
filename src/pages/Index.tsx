import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { CirclesPanel } from "@/components/CirclesPanel";
import { LoanDesk } from "@/components/LoanDesk";
import { useGenVouch } from "@/hooks/useGenVouch";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    circles,
    loans,
    loading,
    error,
    createCircle,
    requestLoan,
    approveLoan,
    repayLoan,
    triggerInsurance,
    refresh,
  } = useGenVouch();

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      {/* Error Banner */}
      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-4">
          <div className="rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 p-3 text-sm text-red-800 dark:text-red-300">
            ⚠️ {error}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refresh()}
            className="gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh On-Chain Data
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald" />
            <span className="ml-3 text-muted-foreground">
              Fetching on-chain state…
            </span>
          </div>
        ) : (
          <>
            <StatsCards circles={circles} loans={loans} />
            <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
              <aside>
                <CirclesPanel
                  circles={circles}
                  onCreateCircle={createCircle}
                  onRequestLoan={requestLoan}
                />
              </aside>
              <section>
                <LoanDesk
                  loans={loans}
                  onApprove={approveLoan}
                  onRepay={repayLoan}
                  onTriggerInsurance={triggerInsurance}
                />
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
