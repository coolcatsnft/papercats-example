import { Button, Plural } from '@alex-coolcats/cool-cats-web-components';
import { usePaperCats } from "../context/PaperCats";
import { useWeb3 } from '../context/Web3';

export function MintPaperCat({ amount }: { amount: number }) {
  const { contract, minting, loading, mintPaperCats } = usePaperCats();
  const { fetchBalance } = useWeb3();
  const mint = () => {
    return mintPaperCats(amount, fetchBalance);
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
