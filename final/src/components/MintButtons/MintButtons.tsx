import styled from 'styled-components';
import MintPaperCatButton from "../MintPaperCatButton/MintPaperCatButton";

export function MintButtons() {
  return (
    <StyledMintButtons>
      <MintPaperCatButton amount={1} />
      <MintPaperCatButton amount={2} />
      <MintPaperCatButton amount={3} />
    </StyledMintButtons>
  )
}

export default MintButtons;

const StyledMintButtons = styled.div`
  display: grid;
  gap: var(--global-margin);
  grid-template-columns: repeat(1, 1fr);
  transition: all 0.4s;
  margin: var(--global-margin) 0;

  @media screen and (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (min-width: 800px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;