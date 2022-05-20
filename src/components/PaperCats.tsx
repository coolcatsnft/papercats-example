import { usePaperCats } from "../context/PaperCats";
import PaperCat from "./PaperCat";

import './PaperCats.scss';

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
    <div className="papercats">
      { !paperCats.length && <p>No cats found :(</p> }
      { paperCats.length > 0 && paperCats.map((id: string) => {
        return (
          <PaperCat key={id} id={Number(id)} />
        )
      }) }
    </div>
  );
}