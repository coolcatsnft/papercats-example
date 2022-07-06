import { useCallback, useState } from "react";
import useMintPaperCat from "../hooks/useMintPaperCat"

export function MintButton({ amount }) {
  const { mint, error, mintAmount } = useMintPaperCat();
  const [promised, setPromised] = useState(false);
  
  const startMinting = useCallback(() => {
    const res = mint(amount);
    if (res instanceof Promise) {
      setPromised(true);
      res.finally(() => {
        setPromised(false);
      });
    }
  }, [mint, amount]);

  return (
    <>
      {error && <p>{error.message || error.toString()}</p>}
      <button disabled={mintAmount || promised} onClick={startMinting}>{mintAmount === amount ? 'Minting...' : `Mint ${amount}`}</button>
    </>
  )
}