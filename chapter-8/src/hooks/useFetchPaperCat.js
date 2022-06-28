import { useEffect, useState } from "react";
import { PAPER_CATS_CONTRACT } from "..";
import useLocalStorage from "./useLocalStorage";
import usePaperCatsContract from "./usePaperCatsContract";

export const useFetchPaperCat = (id) => {
  const { contract } = usePaperCatsContract();
  const [tokenUri, setTokenUri] = useLocalStorage(
    `papercat-${PAPER_CATS_CONTRACT}-${id}-tokenUri`
  );
  const [paperCat, setPaperCat] = useLocalStorage(
    `papercat-${PAPER_CATS_CONTRACT}-${id}-metadata`
  );
  const [error, setError] = useState();

  useEffect(() => {
    if (contract && !tokenUri && !error) {
      contract.methods.tokenURI(
        id
      ).call().then((tokenURI) => {
        setTokenUri(tokenURI);
      }).catch((err) => {
        setError(err);
      });
    }
  }, [id, contract, tokenUri, setTokenUri, error]);

  useEffect(() => {
    if (contract && tokenUri && !paperCat && !error) {
      fetch(
        tokenUri,
        { mode: "cors" }
      ).then((response) => {
        if (response.status !== 200) {
          throw new Error("Invalid response from metadata server");
        }

        response.json().then((data) => {
          setPaperCat({ ...{ id: String(id) }, ...data });
        });
      }).catch((err) => {
        setError(err);
      });
    }
  }, [id, contract, tokenUri, paperCat, setPaperCat, error]);

  return { tokenUri, paperCat, error };
};
