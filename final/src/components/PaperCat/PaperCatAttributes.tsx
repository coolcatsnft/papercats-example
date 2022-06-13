import React from "react";
import styled from 'styled-components';
import { TPaperCat, TPaperCatAttribute } from "../../hooks/usePaperCat";
import { getPaperCatAttributes } from "../../utils";
import { device } from "../../utils/device";

export const PaperCatAttributesContainer = styled.ul`
  display: none;
  @media ${device.tablet} {
    display: flex;
    flex-wrap: wrap;
    margin: calc(var(--global-margin) * 0.5) 0 0;
    padding: 0;
    gap: calc(var(--global-margin) * 0.5);
    justify-content: space-between;
  }
`;

export const PaperCatAttributeContainer = styled.li`
  margin: 0;
  padding: calc(var(--global-padding) * 0.5);
  display: inline-block;
  flex-basis: calc(50% - var(--global-padding) / 2);
  border: var(--border-width) solid var(--border-primary);
  border-radius: var(--border-radius);
  text-align: center;
  text-transform: uppercase;
  position: relative;
  min-height: 32px;

  span {
    font-size: 11px;
    position: absolute;
    left: 0;
    width: calc(100% - var(--global-padding));
    color: var(--text-secondary);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 calc(var(--global-padding) * 0.5);
  }

  strong {
    display: block;
    padding-top: var(--global-padding);
    font-size: 12px;
  }
`;

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
