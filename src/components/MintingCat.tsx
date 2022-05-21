import { PaperCatContainer } from './PaperCat';
import { usePaperCats } from '../context/PaperCats';
import './MintingCat.scss';
import Dots from './Dots';
import { RenderedPaperCatImage } from './PaperCatImage';

export function MintingCat() {
  const { minting } = usePaperCats();

  if (!minting) {
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
