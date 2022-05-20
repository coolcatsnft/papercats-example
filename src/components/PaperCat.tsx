import { renderToStaticMarkup } from 'react-dom/server';
import { PAPER_CATS_CONTRACT, TPaperCatAttribute, usePaperCat } from "../context/PaperCats";
import Card, { CardFooter } from "./Card";
import Header from './Header';
import PaperCatAttributes from './PaperCatAttributes';
import { PaperCatImage } from "./PaperCatImage";

export function PaperCat({ id }: { id: number }) {
  const { loading, paperCat } = usePaperCat(id);

  if (loading || !paperCat) {
    return (
      <>
        Loading...
      </>
    )
  }

  const backgroundColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'background')[0];
  const heartColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'heart colour')[0];
  const rendered = renderToStaticMarkup(
    <PaperCatImage 
      background={backgroundColor ? backgroundColor.value : undefined}
      heart={heartColor ? heartColor.value : undefined}
    />
  );
  const dataUri = `data:image/svg+xml;base64,${btoa(rendered)}`;
  
  return (
    <Card href={`https://testnets.opensea.io/assets/rinkeby/${PAPER_CATS_CONTRACT}/${id}`}>
      <img src={dataUri} alt={paperCat.id} height="200" />
      <CardFooter>
        <Header size={4}>{paperCat.name}</Header>
        <PaperCatAttributes paperCat={paperCat} />
      </CardFooter>
    </Card>
  )
}

export default PaperCat;
