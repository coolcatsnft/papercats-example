import React from "react";

import './Nav.scss';

export function Nav({ children }: { children?: React.ReactNode }) {
  return (
    <nav className="nav">
      {children}
    </nav>
  )
}

export default Nav;
