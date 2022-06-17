import { createContext } from "react";
import useFetchContract from "../hooks/useFetchContract";

const PAPER_CATS_CONTRACT = '0xB574BC3b58fED191846D678fB1B0127d35832e9A';

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
