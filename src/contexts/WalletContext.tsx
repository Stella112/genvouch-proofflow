import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface WalletState {
  address: string | null;
  chainId: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletState | undefined>(undefined);

const GENLAYER_CHAIN = {
  chainId: "0x21c",
  chainName: "GenLayer Simulator",
  rpcUrls: ["https://studio.genlayer.com/rpc"],
  nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
};

async function addGenLayerNetwork() {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: GENLAYER_CHAIN.chainId }],
    });
  } catch (switchError: any) {
    // Chain not added yet — add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [GENLAYER_CHAIN],
      });
    }
  }
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use GenVouch.");
      return;
    }
    setIsConnecting(true);
    try {
      // Auto-add GenLayer RPC
      await addGenLayerNetwork();

      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      }
      const chain: string = await window.ethereum.request({
        method: "eth_chainId",
      });
      setChainId(chain);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setChainId(null);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        chainId,
        isConnecting,
        isConnected: !!address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
