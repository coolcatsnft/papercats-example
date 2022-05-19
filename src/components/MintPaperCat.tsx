import { Button, Plural } from '@alex-coolcats/cool-cats-web-components';
import { usePaperCats } from "../context/PaperCats";

export function MintPaperCat({ amount }: { amount: number }) {
  const { contract, minting, loading, mintPaperCats } = usePaperCats();
  const mint = () => {
    return mintPaperCats(amount);
  };

  if (!contract) {
    return null;
  }

  return (
    <Button removeBaseClass disabled={minting || loading} onClick={mint}>
      Mint {amount} Paper Cat<Plural count={amount} single="" plural="s" />
    </Button>
  )
}

export default MintPaperCat;
