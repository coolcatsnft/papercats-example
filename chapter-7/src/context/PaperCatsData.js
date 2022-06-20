import { createContext } from "react";
import useFetchPaperCatsContractData from "../hooks/useFetchPaperCatsContractData";

export const PaperCatsDataContext = createContext();

export const PaperCatsDataProvider = ({ children }) => {
  const {
    loading,
    loaded,
    paused,
    price,
    name,
    totalSupply,
    walletOfOwner
  } = useFetchPaperCatsContractData();

  return (
    <PaperCatsDataContext.Provider value={{
      loading,
      loaded,
      paused,
      price,
      name,
      totalSupply,
      walletOfOwner
    }}>
      { children }
    </PaperCatsDataContext.Provider>
  )
}

export default PaperCatsDataContext;
