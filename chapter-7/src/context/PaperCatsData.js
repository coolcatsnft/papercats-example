import { createContext } from "react";
import useFetchPaperCatsContractData from "../hooks/useFetchPaperCatsContractData";

export const PaperCatsDataContext = createContext();
export const PaperCatsSetDataContext = createContext();

export const PaperCatsDataProvider = ({ children }) => {
  const {
    loading,
    loaded,
    paused,
    price,
    name,
    totalSupply,
    walletOfOwner,
    setWalletOfOwner,
    setTotalSupply
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
      <PaperCatsSetDataContext.Provider value={{
        setTotalSupply,
        setWalletOfOwner
      }}>
        { children }
      </PaperCatsSetDataContext.Provider>
    </PaperCatsDataContext.Provider>
  )
}

export default PaperCatsDataContext;
