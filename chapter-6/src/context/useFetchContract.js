import { useEffect, useState } from "react";
import useWeb3 from "../hooks/useWeb3";

export const networkName = (id) => {
  switch (String(id)) {
    case '1':
      return 'Main';
    case '3':
      return 'Ropsten';
    case '4':
      return 'Rinkeby';
    case '5':
      return 'Goerli';
    case '42':
      return 'Kovan';
    case '137':
      return 'Polygon';
    default:
      throw new Error('unsupported network');
  }
};

export const getApi = (id) => {
  const network = networkName(id);
  if (network === 'Main') {
    return 'api';
  }

  return ['api', network.toLowerCase()].join('-');
}

export function useFetchContract(contractAddress) {
  const { library } = useWeb3();
  const [contract, setContract] = useState();
  const [loadingContract, setLoadingContract] = useState(false);
  const [contractError, setContractError] = useState();

  useEffect(() => {
    const fetchAbi = () => {
      return fetch(
        `//${getApi(library.currentProvider.networkVersion)}.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=raw`
      ).then((res) => {
        if (res.status !== 200) {
          throw new Error("Error connecting to etherscan");
        }
        return res.json().then((json) => {
          if (json.message === "NOTOK") {
            throw new Error(json.result || "Error parsing abi json");
          }

          return json;
        });
      });
    };

    if (library && !contract && !loadingContract && !contractError) {
      setLoadingContract(true);
      fetchAbi().then((json) => {
        setLoadingContract(false);
        setContract(new library.eth.Contract(json, contractAddress));
      }).catch((err) => {
        setContractError(err.toString());
        setLoadingContract(false);
      });
    }

    if (!library && contract) {
      setContract(undefined);
      setLoadingContract(false);
    }
  }, [contractAddress, library, contract, loadingContract, contractError]);

  return { loadingContract, contractError, contract };
}

export default useFetchContract;
