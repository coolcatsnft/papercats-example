import { PaperCatContainer } from '../PaperCat/PaperCat';
import { usePaperCats } from "../../hooks/usePaperCats";
import { RenderedPaperCatImage } from '../PaperCat/PaperCatImage';
import Dots from '../Dots/Dots';

import './MintingCat.scss';
import Plural from '../Plural/Plural';

export function MintingCat() {
  const { minting, error, mintingAmount } = usePaperCats();

  if (!minting || error) {
    return null;
  }

  return (
    <div className="minting-cat">
      <PaperCatContainer title={<>Minting your Paper <Plural count={mintingAmount} single="Cat" plural="Cats" /><Dots absolute /></>}>
        <RenderedPaperCatImage
          height="200"
          paperCatImage={{
            lines: '#CCC'
          }}
        />
      </PaperCatContainer>
    </div>
  );
}

export default MintingCat;
