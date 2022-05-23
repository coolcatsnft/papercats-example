import React from "react";

export function Header({ size, children, ...rest }: { size: number, children?: React.ReactNode }) {
  return React.createElement(`h${size}`, {...{className: "header"}, ...rest}, children);
};

export default Header;
