import React from 'react';

interface IPluralProps {
  count: number,
  single: string | React.ReactElement,
  plural: string | React.ReactElement,
  zero?: string,
  loading?: string
};

export function Plural({ count, single, plural, zero, loading }: IPluralProps) {
  if (loading) {
    return (
      <>{ loading }</>
    );
  }

  if (count <= 0 && zero && zero.length) {
    return (
      <>{ zero }</>
    );
  }

  if (count === 1) {
    return (
      <>{ single }</>
    );
  }

  return (
    <>{ plural }</>
  );
}

export default Plural;
