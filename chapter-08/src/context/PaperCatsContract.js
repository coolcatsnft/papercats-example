import { createContext } from "react";
import { PAPER_CATS_CONTRACT } from "..";
import useFetchContract from "../hooks/useFetchContract";

export const PaperCatsContractContext = createContext();

export const PaperCatsContractProvider = ({ children }) => {
  const { contract, loadingContract, contractError } = useFetchContract(PAPER_CATS_CONTRACT);

  return (
    <PaperCatsContractContext.Provider value={{
      contract,
      loading: loadingContract,
      error: contractError
    }}>
      { children }
    </PaperCatsContractContext.Provider>
  )
}

export default PaperCatsContractContext;
