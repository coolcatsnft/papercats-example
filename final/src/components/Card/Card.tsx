import React, { MouseEvent } from "react";

import './Card.scss';

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="card__footer">
      { children }
    </div>
  );
}

export function Card({ children, href, onClick }: { children: React.ReactNode, href?: string, onClick?: Function }) {
  const click = (event: MouseEvent) => {
    if (onClick) {
      onClick(event);
    }
  }

  const props = {
    className: "card"
  } as any;
  let elementType = 'div';
  if (onClick && !href) {
    elementType = 'button';
    props.onClick = click;
  }
  if (href) {
    elementType = 'a';
    props.href = href;
    if (href.indexOf('http') === 0) {
      props.target = "_blank";
      props.rel = "noopener,noreferrer";
    }
  }
  
  return React.createElement(elementType, props, children);
}

export default Card;
