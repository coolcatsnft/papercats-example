import React from "react";
import { Container, Button } from '@alex-coolcats/cool-cats-web-components';

import './Card.scss';

export function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <Container className="card__footer">
      { children }
    </Container>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <Button className="card" removeBaseClass>
      { children }
    </Button>
  );
}

export default Card;
