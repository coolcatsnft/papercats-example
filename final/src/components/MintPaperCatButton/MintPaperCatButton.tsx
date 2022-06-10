import { usePaperCats } from "../../hooks/usePaperCats";
import Plural from "../Plural/Plural";
import Button from "../Button/Button";

export function MintPaperCatButton({ amount }: { amount: number }) {
  const { contract, minting, loading, mintPaperCats } = usePaperCats();
  const mint = () => {
    return mintPaperCats(amount);
  };

  if (!contract) {
    return null;
  }

  return (
    <Button disabled={minting || loading} onClick={mint}>
      Mint {amount} Paper Cat<Plural count={amount} single="" plural="s" />
    </Button>
  )
}

export default MintPaperCatButton;
