import React from "react";
import { TPaperCat, TPaperCatAttribute } from "../../hooks/usePaperCat";
import { getPaperCatAttributes } from "../../utils";
import './PaperCatAttribute.scss';

interface IPaperCatAttributeContainer extends React.ComponentProps<"li"> {}
interface IPaperCatAttributesContainer extends React.ComponentProps<"ul"> {}

export function PaperCatAttributesContainer(props: IPaperCatAttributesContainer) {
  return (
    <ul {...props} className={[(props.className || ''), "papercat__attributes"].join(' ')}>
      {props.children}
    </ul>
  )
}

export function PaperCatAttributeContainer(props: IPaperCatAttributeContainer) {
  return (
    <li {...props} className={[(props.className || ''), "papercat__attribute"].join(' ')}>
      {props.children}
    </li>
  )
}

export function PaperCatAttribute({ attribute }: { attribute: TPaperCatAttribute }) {
  return (
    <PaperCatAttributeContainer title={attribute.trait_type}>
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

  if (!paperCat || !paperCat.attributes || !paperCat.attributes.length) {
    return null;
  };

  const attributes = getPaperCatAttributes(paperCat);

  if (!attributes.heart_colour && !attributes.background) {
    return null;
  }

  return (
    <PaperCatAttributesContainer>
      {attributes.background && <PaperCatAttribute attribute={attributes.background} />}
      {attributes.background_group && <PaperCatAttribute attribute={attributes.background_group} />}
      {attributes.heart_colour && <PaperCatAttribute attribute={attributes.heart_colour} />}
      {attributes.heart_rarity && <PaperCatAttribute attribute={attributes.heart_rarity} />}
    </PaperCatAttributesContainer>
  )
}

export default PaperCatAttributes;
