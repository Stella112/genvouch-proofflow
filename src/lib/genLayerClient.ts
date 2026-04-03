import { createClient } from "genlayer-js";
import { simulator } from "genlayer-js/chains";

export const GENVOUCH_CONTRACT_ADDRESS =
  "0x9E50680497c14Eb7057Bed10F5d9f9E9B000e6C0" as const;

// Try simulator first, fall back to studionet
let chain: any;
try {
  chain = simulator;
} catch {
  // fallback inline chain definition
  chain = {
    id: 0x21c,
    name: "GenLayer Simulator",
    rpcUrls: { default: { http: ["https://studio.genlayer.com/rpc"] as const } },
    nativeCurrency: { name: "GEN", symbol: "GEN", decimals: 18 },
  };
}

export function getClient(provider?: any) {
  return createClient({
    chain,
    endpoint: "https://studio.genlayer.com/rpc",
    ...(provider ? { provider } : {}),
  });
}
