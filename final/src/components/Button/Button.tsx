import React from "react";

import './Button.scss';

export function Button(props: React.ComponentProps<"button">) {
  return (
    <button {...props} />
  )
}

export default Button;
