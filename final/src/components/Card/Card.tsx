import React, { MouseEvent } from "react";
import styled from 'styled-components';

export const CardStyle = styled.div`
  background-color: var(--background);
  color: rgba(0, 0, 0, 0.87);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--border-primary);
  overflow: hidden;
  max-width: 800px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  position: relative;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  background-color: transparent;
  outline: 0px;
  margin: 0px;
  padding: 0px;
  user-select: none;
  appearance: none;
  text-decoration: none;
  color: inherit;
  display: block;
  text-align: inherit;
  width: 100%;

  img {
    display: block;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    width: 100%;
    object-fit: cover;
    height: auto;
  }

  a&,
  button& {
    cursor: pointer;
  }
`;

export const CardFooter = styled.footer`
  padding: var(--global-padding);
  background-color: var(--background);

  .header {
    margin: 0;
    
    & + * {
      margin-top: var(--global-margin);
    }
  }
`;

export function Card({ children, href, onClick }: { children: React.ReactNode, href?: string, onClick?: Function }) {
  const click = (event: MouseEvent) => {
    if (onClick) {
      onClick(event);
    }
  }

  const props = {
    className: "card",
    children: children
  } as any;
  if (onClick && !href) {
    props.as = 'button';
    props.onClick = click;
  }
  if (href) {
    props.as = 'a';
    props.href = href;
    if (href.indexOf('http') === 0) {
      props.target = "_blank";
      props.rel = "noopener,noreferrer";
    }
  }

  return (
    <CardStyle {...props} />
  )
}

export default Card;
