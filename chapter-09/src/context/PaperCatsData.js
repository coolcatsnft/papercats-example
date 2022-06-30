import { createContext, useState } from "react";
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

  const [mintAmount, setMintAmount] = useState(0);

  return (
    <PaperCatsDataContext.Provider value={{
      loading,
      loaded,
      paused,
      price,
      name,
      totalSupply,
      walletOfOwner,
      mintAmount
    }}>
      <PaperCatsSetDataContext.Provider value={{
        setTotalSupply,
        setWalletOfOwner,
        setMintAmount
      }}>
        { children }
      </PaperCatsSetDataContext.Provider>
    </PaperCatsDataContext.Provider>
  )
}

export default PaperCatsDataContext;
