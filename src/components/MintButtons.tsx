import MintPaperCat from "./MintPaperCat";

import './MintButtons.scss';

export function MintButtons() {
  return (
    <section className="mint-buttons">
      <MintPaperCat amount={1} />
      <MintPaperCat amount={2} />
      <MintPaperCat amount={3} />
    </section>
  )
}

export default MintButtons;
