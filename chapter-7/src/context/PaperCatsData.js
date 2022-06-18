import { createContext, useEffect, useState } from "react";
import usePaperCatsContract from "../hooks/usePaperCatsContract";

export const PaperCatsDataContext = createContext();

export const PaperCatsDataProvider = ({ children }) => {
  const { contract } = usePaperCatsContract();
  const [name, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState('');

  useEffect(() => {
    if (contract && !totalSupply) {
      contract.methods.totalSupply().call().then((supply) => {
        setTotalSupply(supply);
      });
    }
    if (!contract && totalSupply) {
      setTotalSupply('');
    }
  }, [contract, totalSupply]);

  useEffect(() => {
    if (contract && !name) {
      contract.methods.name().call().then((string) => {
        setContractName(string);
      });
    }
    if (!contract && name) {
      setContractName('');
    }
  }, [contract, name]);

  return (
    <PaperCatsDataContext.Provider value={{
      name,
      totalSupply
    }}>
      { children }
    </PaperCatsDataContext.Provider>
  )
}

export default PaperCatsDataContext;
