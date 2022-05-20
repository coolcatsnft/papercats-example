import { TPaperCat, TPaperCatAttribute } from "../context/PaperCats";

import './PaperCatAttribute.scss';

export function PaperCatAttribute({ attribute }: { attribute: TPaperCatAttribute }) {
  return (
    <li className="papercat__attribute">
      <span>{attribute.trait_type}</span>
      <strong>{attribute.value}</strong>
    </li>
  )
}

export function PaperCatAttributes({ paperCat }: { paperCat: TPaperCat }) {
  if (!paperCat.attributes.length) {
    return null;
  };

  const backgroundColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'background')[0];
  const heartColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'heart colour')[0];

  if (!heartColor && !backgroundColor) {
    return null;
  }

  return (
    <ul className="papercat__attributes">
      {backgroundColor && <PaperCatAttribute attribute={backgroundColor} />}
      {heartColor && <PaperCatAttribute attribute={heartColor} />}
    </ul>
  )
}

export default PaperCatAttributes;
