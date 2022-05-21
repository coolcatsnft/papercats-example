import React from "react";
import { TPaperCat, TPaperCatAttribute } from "../context/PaperCats";

import './PaperCatAttribute.scss';

export function PaperCatAttributesContainer({ children }: { children?: React.ReactNode }) {
  return (
    <ul className="papercat__attributes">
      {children}
    </ul>
  )
}

export function PaperCatAttributeContainer({ children }: { children?: React.ReactNode }) {
  return (
    <li className="papercat__attribute">
      {children}
    </li>
  )
}

export function PaperCatAttribute({ attribute }: { attribute: TPaperCatAttribute }) {
  return (
    <PaperCatAttributeContainer>
      <span>{attribute.trait_type}</span>
      <strong>{attribute.value}</strong>
    </PaperCatAttributeContainer>
  )
}

export function PaperCatAttributes({ paperCat, loading = false }: { paperCat?: TPaperCat, loading?: boolean }) {
  if (loading) {
    return (
      <PaperCatAttributesContainer>
        <PaperCatAttributeContainer>
          <span></span>
          <strong></strong>
        </PaperCatAttributeContainer>
        <PaperCatAttributeContainer>
          <span></span>
          <strong></strong>
        </PaperCatAttributeContainer>
      </PaperCatAttributesContainer>
    )
  }

  if (!paperCat || !paperCat.attributes.length) {
    return null;
  };

  const backgroundColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'background')[0];
  const heartColor = paperCat.attributes.filter((a: TPaperCatAttribute) => a.trait_type === 'heart colour')[0];

  if (!heartColor && !backgroundColor) {
    return null;
  }

  return (
    <PaperCatAttributesContainer>
      {backgroundColor && <PaperCatAttribute attribute={backgroundColor} />}
      {heartColor && <PaperCatAttribute attribute={heartColor} />}
    </PaperCatAttributesContainer>
  )
}

export default PaperCatAttributes;
