import React, { CSSProperties, useEffect, useState } from 'react';

export function Dots({ mod, absolute }: { mod?: number, absolute?: boolean }) {
  const [time, setTime] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time => time + 1);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const style = {
    position: absolute ? 'absolute' : 'static'
  };

  return (
    <span style={style as CSSProperties} className="dots">{ [...Array((time % (mod || 3)) + 1)].map(n => '.').join('') }</span>
  )
}

export default Dots;
