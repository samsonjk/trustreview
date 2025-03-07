import { ethers } from "ethers";

const provider = typeof window !== "undefined"
  ? new ethers.BrowserProvider(window.ethereum)
  : null;

export default provider;
