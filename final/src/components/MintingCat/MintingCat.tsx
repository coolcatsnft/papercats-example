import { PaperCatContainer } from '../PaperCat/PaperCat';
import { usePaperCats } from "../../hooks/usePaperCats";
import { RenderedPaperCatImage } from '../PaperCat/PaperCatImage';
import Dots from '../Dots/Dots';

import './MintingCat.scss';

export function MintingCat() {
  const { minting, error } = usePaperCats();

  if (!minting || error) {
    return null;
  }

  return (
    <div className="minting-cat">
      <PaperCatContainer title={<>Minting your Paper Cat<Dots absolute /></>}>
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
