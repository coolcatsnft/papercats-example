import MintPaperCatButton from "../MintPaperCatButton/MintPaperCatButton";

import './MintButtons.scss';

export function MintButtons() {
  return (
    <section className="mint-buttons">
      <MintPaperCatButton amount={1} />
      <MintPaperCatButton amount={2} />
      <MintPaperCatButton amount={3} />
    </section>
  )
}

export default MintButtons;
