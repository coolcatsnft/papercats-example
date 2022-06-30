import { useState } from "react";
import useAdoptPaperCat from "../hooks/useAdoptPaperCat"

export function MintButton({ amount }) {
  const { adopt, error, minting } = useAdoptPaperCat();
  const [promised, setPromised] = useState(false);

  const startAdoption = () => {
    const res = adopt(amount);
    if (res instanceof Promise) {
      setPromised(true);
      res.finally(() => {
        setPromised(false);
      });
    }

    return res;
  };

  return (
    <>
      {error && <p>{error.message || error.toString()}</p>}
      <button disabled={minting || promised} onClick={startAdoption}>Mint {amount}</button>
    </>
  )
}