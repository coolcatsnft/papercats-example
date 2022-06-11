import styled from 'styled-components';
import usePaperCats from "../../hooks/usePaperCats";
import PaperCat from "./../PaperCat/PaperCat";

const Styled = styled.div`
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

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export function PaperCats() {
  const { contract, loading, paperCats } = usePaperCats();

  if (!contract) {
    return null;
  }

  if (loading || !paperCats) {
    return (
      <>Loading...</>
    )
  }

  return (
    <Styled>
      { !paperCats.length && <p>No cats found :(</p> }
      { paperCats.length > 0 && paperCats.map((id: string) => {
        return (
          <PaperCat key={id} id={Number(id)} />
        )
      }) }
    </Styled>
  );
}

export default PaperCats;
