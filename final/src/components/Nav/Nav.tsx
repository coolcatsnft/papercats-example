import React from "react";
import styled from 'styled-components';

export function Nav({ children }: { children?: React.ReactNode }) {
  return (
    <Styled>
      {children}
    </Styled>
  )
}

export default Nav;

const Styled = styled.nav`
  position: relative;
`;