import { useEffect, useState } from "react";
import { PAPER_CATS_CONTRACT } from "..";
import { fetchDedupe } from 'fetch-dedupe';
import useLocalStorage from "./useLocalStorage";
import usePaperCatsContract from "./usePaperCatsContract";

export const useFetchPaperCat = (id) => {
  const { contract } = usePaperCatsContract();
  const [loading, setLoading] = useState(false);
  const [tokenUri, setTokenUri] = useLocalStorage(`papercat-${PAPER_CATS_CONTRACT}-${id}-tokenUri`, '');
  const [paperCat, setPaperCat] = useLocalStorage(`papercat-${PAPER_CATS_CONTRACT}-${id}`, null, 3600);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (contract && !paperCat && !tokenUri && !loading && !error) {
      setLoading(true);
      contract.methods.tokenURI(id).call().then((tokenURI) => {
        setTokenUri(tokenURI);
      }).catch((err) => {
        setError(err);
      });
    }
  }, [id, contract, paperCat, tokenUri, setTokenUri, loading, error]);
  
  useEffect(() => {
    if (loading && !paperCat && tokenUri && !error) {
      fetchDedupe(
        tokenUri,
        { mode: "cors" }
      ).then((response) => {
        if (response.status !== 200) {
          throw new Error('Invalid response from metadata server');
        }
        setPaperCat({...{id: String(id)}, ...response.data});
      }).catch((err) => {
        setError(err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, paperCat, loading, tokenUri, error, setPaperCat]);

  return { loading, paperCat, error };
}
