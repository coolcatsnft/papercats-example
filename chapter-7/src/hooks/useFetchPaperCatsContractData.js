import { useEffect, useState } from "react";
import usePaperCatsContract from "./usePaperCatsContract";

export function useFetchPaperCatsContractData() {
  const { contract } = usePaperCatsContract();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [paused, setPaused] = useState(false);
  const [price, setPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    if (contract && !loading && !name && !error) {
      setLoading(true);
      setLoaded(false);
      Promise.all([
        contract.methods._paused().call(),
        contract.methods._price().call(),
        contract.methods.name().call(),
        contract.methods.totalSupply().call()
      ]).then((data) => {
        setPaused(data[0]);
        setPrice(data[1]);
        setName(data[2]);
        setTotalSupply(data[3]);
        setLoaded(true);
      }).catch((e) => {
        setError(e);
      }).finally(() => {
        setLoading(false);
      });
    }
    
    if (!contract) {
      setName('');
      setTotalSupply('');
      setLoading(false);
      setLoaded(false);
    }
  }, [contract, loading, name, error]);

  return { loading, error, paused, price, name, totalSupply, loaded };
}

export default useFetchPaperCatsContractData;
