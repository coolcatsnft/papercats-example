import { createContext, useEffect, useState } from "react";
import useWeb3 from "../hooks/useWeb3";

const PAPER_CATS_CONTRACT = '0xB574BC3b58fED191846D678fB1B0127d35832e9A';

export const PaperCatsContractContext = createContext();

export const PaperCatsContractProvider = ({ children }) => {
  const { address, library } = useWeb3();
  const [contract, setContract] = useState();
  const [loadingContract, setLoadingContract] = useState(false);
  const [contractError, setContractError] = useState();

  useEffect(() => {
    const fetchAbi = () => {
      return fetch(`//api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${PAPER_CATS_CONTRACT}&format=raw`).then((res) => {
        if (res.status !== 200) {
          throw new Error('Error connecting to etherscan');
        }
        return res.json().then((json) => {
          if (json.message === "NOTOK") {
            throw new Error(json.result || 'Error parsing abi json');
          }
          
          return json;
        });
      });
    }

    console.log(contract)
    
    if (address && library && !contract && !loadingContract && !contractError) {
      const prom = fetchAbi();
      setLoadingContract(true);
      prom.then((json) => {
        setLoadingContract(false);
        setContract(new library.eth.Contract(json, PAPER_CATS_CONTRACT));
      }).catch((err) => {
        setContractError(err.toString());
        setLoadingContract(false);
      });
    }

    if (!address && !library && contract) {
      setContract(undefined);
      setLoadingContract(false);
    }
  }, [address, library, contract, loadingContract, contractError]);

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
