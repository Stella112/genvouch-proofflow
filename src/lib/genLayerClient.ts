import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export const GENVOUCH_CONTRACT_ADDRESS =
  "0x9E50680497c14Eb7057Bed10F5d9f9E9B000e6C0" as const;

export function getClient(provider?: any) {
  return createClient({
    chain: studionet,
    endpoint: "https://studio.genlayer.com/rpc",
    ...(provider ? { provider } : {}),
  });
}
