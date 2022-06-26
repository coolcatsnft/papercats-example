import { useEffect, useState } from "react";
import { PAPER_CATS_CONTRACT } from "..";
import useLocalStorage from "./useLocalStorage";
import usePaperCatsContract from "./usePaperCatsContract";

const requests = new Map();
const PromiseCache = (key, prom, params) => {
  let p;
  if (requests.get(key)) {
    p = requests.get(key);
  } else {
    p = prom.apply(this, params);
    requests.set(key, p);
  }
  
  return p.then((result) => {
    return result;
  }).finally(() => {
    requests.delete(key);
  });
};

export const useFetchPaperCat = (id) => {
  const { contract } = usePaperCatsContract();
  const [loading, setLoading] = useState(false);
  const [tokenUri, setTokenUri] = useState(null);
  const [paperCat, setPaperCat] = useLocalStorage(`papercat-${PAPER_CATS_CONTRACT}-${id}`, null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (contract && !paperCat && !tokenUri && !loading && !error) {
      setLoading(true);
      PromiseCache(
        `tokenuri-${id}`,
        contract.methods.tokenURI(id).call
      ).then((tokenURI) => {
        setTokenUri(tokenURI);
      }).catch((err) => {
        setError(err);
      });
    }
  }, [id, contract, paperCat, tokenUri, loading, error])
  
  useEffect(() => {
    if (loading && !paperCat && tokenUri && !error) {
      PromiseCache(
        `papercat-${id}`,
        fetch,
        [tokenUri, { mode: "cors" }]
      ).then((response) => {
        if (response.status !== 200) {
          throw new Error('Invalid response from metadata server');
        }
        
        response.clone().json().then((json) => {
          setPaperCat({...{id: String(id)}, ...json});
        })
      }).catch((err) => {
        setError(err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [id, paperCat, loading, tokenUri, error, setPaperCat]);

  return { loading, paperCat, error };
}
