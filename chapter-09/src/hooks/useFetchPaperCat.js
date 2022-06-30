import { useEffect, useState } from "react";
import { PAPER_CATS_CONTRACT } from "..";
import useLocalStorage from "./useLocalStorage";
import usePaperCatsContract from "./usePaperCatsContract";

export function useFetchPaperCat(id) {
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
      }).catch(setError);
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
          if (!data.attributes) {
            throw new Error(`Attributes missing from papercat #${id} metadata`);
          }
          
          setPaperCat({ ...{ id: String(id) }, ...data });
        }).catch(setError);
      }).catch(setError);
    }
  }, [id, contract, tokenUri, paperCat, setPaperCat, error]);

  // Sometimes the metadata isn't populated after a fetch.  This is because
  // the app and the metadata server are listening for the same event.
  // Incase this happens, we refetch the data after 5 seconds.
  useEffect(() => {
    if (error 
      && Object(error).hasOwnProperty('message') 
      && error.message.indexOf('Attributes') >= 0
    ) {
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    }
  }, [error]);

  return { tokenUri, paperCat, error };
};
