import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

export function getClient(provider?: any) {
  return createClient({
    chain,
    endpoint: "https://studio.genlayer.com/rpc",
    ...(provider ? { provider } : {}),
  });
}
