import { usePaperCat, TPaperCatAttribute } from "../../hooks/usePaperCat";
import { PAPER_CATS_CONTRACT } from "../../context/PaperCats";
import Card, { CardFooter } from "../Card/Card";
import Header from '../Header/Header';
import Loading from '../Loading/Loading';
import PaperCatAttributes from './PaperCatAttributes';
import { RenderedPaperCatImage } from "./PaperCatImage";

export function PaperCatContainer({ id, title, footer = null, children = null }: { id?: number, title: React.ReactNode, footer?: React.ReactNode, children?: React.ReactNode }) {
  return (
    <Card href={id ? `https://testnets.opensea.io/assets/rinkeby/${PAPER_CATS_CONTRACT}/${id}` : ""}>
      {children}
      <CardFooter>
        <Header size={4}>{title}</Header>
        {footer}
      </CardFooter>
    </Card>
  )
}

export function PaperCatLoading() {
  return (
    <PaperCatContainer title={<Loading />} footer={<PaperCatAttributes loading />}>
      <RenderedPaperCatImage height="200" />
    </PaperCatContainer>
  )
}

export function PaperCat({ id }: { id: number }) {
  const { loading, paperCat } = usePaperCat(id);

  if (loading || !paperCat) {
    return (
      <PaperCatLoading />
    )
  }

  let backgroundColor = {
    value: ''
  };
  let heartColor = {
    value: ''
  };

  if (paperCat.attributes) {
    backgroundColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'background')[0];
    heartColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'heart_colour')[0];
  }
  
  return (
    <PaperCatContainer id={id} title={paperCat.name} footer={<PaperCatAttributes paperCat={paperCat} />}>
      <RenderedPaperCatImage 
        id={paperCat.id} 
        height="200" 
        paperCatImage={{
          background: backgroundColor ? backgroundColor.value : undefined,
          heart: heartColor ? heartColor.value : undefined
        }}
      />
    </PaperCatContainer>
  )
}

export default PaperCat;
