import { Header } from "@/components/Header";
import { CirclesPanel } from "@/components/CirclesPanel";
import { LoanDesk } from "@/components/LoanDesk";
import { useGenVouch } from "@/hooks/useGenVouch";

const Index = () => {
  const { circles, loans, createCircle, approveLoan, repayLoan, triggerInsurance } = useGenVouch();

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
      </main>
    </div>
  );
};

export default Index;
