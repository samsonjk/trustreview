
import { AlchemyProvider, ethers } from "ethers";

/* const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
 */
export function getProvider() {
  return new AlchemyProvider('sepolia', process.env.NEXT_PUBLIC_ALCHEMY_API_KEY);
}

export function getSigner() {
  if (typeof window === "undefined") return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
}
