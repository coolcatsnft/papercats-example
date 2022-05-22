import { useContext, useEffect, useState } from "react";
import { PaperCatsContext } from "../context/PaperCats";
import useLocalStorage from "./useLocalStorage";

export type TPaperCatAttribute = {
  trait_type: string,
  value: string
};

export type TPaperCat = {
  id: string,
  name: string,
  description: string,
  image: string,
  attributes: TPaperCatAttribute[]
}

export const usePaperCat = (id: number) => {
  const { contract } = useContext(PaperCatsContext)
  if (contract === undefined) {
    throw new Error('usePaperCat must be used within a PaperCatsContext')
  }

  const now = (new Date()).toLocaleDateString();
  const [paperCat, setPaperCat] = useLocalStorage<TPaperCat|null>(`${now}-papercat-${id}`, null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (contract && !paperCat && !loading) {
      setLoading(true);
      contract.methods.tokenURI(
        id
      ).call().then((tokenURI: string) => {
        return fetch(
          tokenURI,
          { mode: "cors" }
        ).then((response) => response.json().then((json) => {
          setPaperCat({...{id: String(id)}, ...json});
        })).catch(() => {
          setPaperCat({
            id: String(id),
            name: `Paper Cat #${id}`,
            description: "Some description",
            image: "https://ipfs.io/ipfs/QmUVnqroyG94LU2hBQZmhfRPu5NijmZ7ZFYeLAWrB7APrC",
            attributes: [
              {
                "trait_type": "background",
                "value": "#a3c0ac"
              }, {
                "trait_type": "heart colour",
                "value": "#9CB5FE"
              }
            ]
          })
        }).finally(() => {
          setLoading(false);
        });
      });
    }
  }, [id, contract, paperCat, loading, setPaperCat])

  return { loading, paperCat };
}
