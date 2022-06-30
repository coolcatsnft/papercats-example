import { useContext } from "react";
import { Web3Context } from "../context/Web3";

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Context')
  }

  return context;
}

export default useWeb3;
