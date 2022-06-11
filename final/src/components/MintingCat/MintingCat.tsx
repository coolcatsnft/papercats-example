import styled from 'styled-components';
import { PaperCatContainer } from '../PaperCat/PaperCat';
import { usePaperCats } from "../../hooks/usePaperCats";
import { RenderedPaperCatImage } from '../PaperCat/PaperCatImage';
import Dots from '../Dots/Dots';
import Plural from '../Plural/Plural';

export function MintingCat() {
  const { minting, error, mintingAmount } = usePaperCats();

  if (!minting || error) {
    return null;
  }

  return (
    <StyledMintingCat className="minting-cat">
      <PaperCatContainer title={<>Minting your Paper <Plural count={mintingAmount} single="Cat" plural="Cats" /><Dots absolute /></>}>
        <RenderedPaperCatImage
          height="200"
          paperCatImage={{
            lines: '#CCC'
          }}
        />
      </PaperCatContainer>
    </StyledMintingCat>
  );
}

export default MintingCat;

const StyledMintingCat = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1;

  .card {
    max-width: 370px;
    width: 80%;
    margin: 0 10%;
    animation: minting 2s infinite;
  }

  + .App {
    filter: blur(3px);
    overflow: hidden;
    height: calc(100vh - (var(--global-padding) * 2));

    @media screen and (min-width: 1321px) {
      padding-left: 0;
      padding-right: 0;
    }

    &:after {
      content: "";
      position: fixed;
      display: flex;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #FFFFFF70;
    }
  }

  @keyframes minting {
    0% {
      opacity: 0.8;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 0.8;
      transform: scale(1);
    }
  }
`;