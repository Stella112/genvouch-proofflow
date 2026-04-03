import { Wallet, LogOut, Loader2, Shield } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();

  const truncated = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "";

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/50 px-4 sm:px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="gradient-emerald flex h-9 w-9 items-center justify-center rounded-lg">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Gen<span className="text-gradient">Vouch</span>
          </span>
        </div>

        {/* Kinship Score */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-muted-foreground">Kinship Score:</span>
          <span className="rounded-full bg-emerald-light px-3 py-1 text-sm font-semibold text-accent-foreground">
            85 — Excellent
          </span>
        </div>

        {/* Wallet */}
        {isConnected ? (
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
              {truncated}
            </span>
            <Button variant="ghost" size="icon" onClick={disconnect}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="gradient-emerald border-0 text-primary-foreground hover:opacity-90"
          >
            {isConnecting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wallet className="mr-2 h-4 w-4" />
            )}
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
}
