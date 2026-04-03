import { Header } from "@/components/Header";
import { CirclesPanel } from "@/components/CirclesPanel";
import { LoanDesk } from "@/components/LoanDesk";
import { useGenVouch } from "@/hooks/useGenVouch";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { circles, loans, loading, createCircle, approveLoan, repayLoan, triggerInsurance } = useGenVouch();

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald" />
            <span className="ml-3 text-muted-foreground">Fetching on-chain state…</span>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
            <aside>
              <CirclesPanel circles={circles} onCreateCircle={createCircle} />
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
        )}
      </main>
    </div>
  );
};

export default Index;
