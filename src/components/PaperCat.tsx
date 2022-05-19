import { usePaperCat } from "../context/PaperCats";
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
  
  return (
    <Card>
      <img src={paperCat.image} alt={paperCat.id} height="200" />
      <CardFooter>
        {paperCat.name}
      </CardFooter>
    </Card>
  )
}

export default PaperCat;
