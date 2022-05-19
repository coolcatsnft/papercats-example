import { PAPER_CATS_CONTRACT, usePaperCat } from "../context/PaperCats";
import Card, { CardFooter } from "./Card";

export function PaperCat({ id }: { id: number }) {
  const { loading, paperCat } = usePaperCat(id);

  if (loading || !paperCat) {
    return (
      <>
        Loading...
      </>
    )
  }

  const openPaperCatTab = () => {
    const newWindow = window.open(
      `https://testnets.opensea.io/assets/rinkeby/${PAPER_CATS_CONTRACT}/${id}`,
      '_blank',
      'noopener,noreferrer'
    )
    if (newWindow) {
      newWindow.opener = null
    }
  }
  
  return (
    <Card onClick={openPaperCatTab}>
      <img src={paperCat.image} alt={paperCat.id} height="200" />
      <CardFooter>
        {paperCat.name}
      </CardFooter>
    </Card>
  )
}

export default PaperCat;
