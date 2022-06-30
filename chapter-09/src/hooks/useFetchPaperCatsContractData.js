import { useEffect, useState } from "react";
import usePaperCatsContract from "./usePaperCatsContract";
import useWeb3 from "./useWeb3";

export function useFetchPaperCatsContractData() {
  const { address } = useWeb3();
  const { contract } = usePaperCatsContract();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [paused, setPaused] = useState(false);
  const [price, setPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);
  const [walletOfOwner, setWalletOfOwner] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    if (contract && address && !loading && !name && !error) {
      setLoading(true);
      setLoaded(false);
      Promise.all([
        contract.methods._paused().call(),
        contract.methods._price().call(),
        contract.methods.name().call(),
        contract.methods.totalSupply().call(),
        contract.methods.walletOfOwner(address).call()
      ]).then((data) => {
        setPaused(data[0]);
        setPrice(data[1]);
        setName(data[2]);
        setTotalSupply(Number(data[3]));
        setWalletOfOwner(data[4]);
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
      setWalletOfOwner([]);
    }
  }, [contract, address, loading, name, error]);

  return { loading, error, paused, price, name, totalSupply, walletOfOwner, loaded, setWalletOfOwner, setTotalSupply };
}

export default useFetchPaperCatsContractData;
