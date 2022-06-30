import { useContext } from "react";
import { PaperCatsContractContext } from "../context/PaperCatsContract";

export function usePaperCatsContract() {
  const context = useContext(PaperCatsContractContext)
  if (context === undefined) {
    throw new Error('usePaperCatsContract must be used within a PaperCatsContractContext')
  }

  return context;
}

export default usePaperCatsContract;
