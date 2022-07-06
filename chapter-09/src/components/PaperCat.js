import React from "react";
import { useFetchPaperCat } from "../hooks/useFetchPaperCat";

export function PaperCat({ id }) {
  const { error, tokenUri, paperCat } = useFetchPaperCat(id);
  const loading = !error && (!tokenUri || !paperCat);

  return React.useMemo(() => {
      return (
          <>
          {loading && <>Loading Paper Cat...</>}
          {paperCat && (
            <>
              <p>{paperCat.name}</p>
              <ul>
                {paperCat.attributes.map((attr, i) => (
                  <li key={i}>
                    {attr.trait_type}: {attr.value.toUpperCase()}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )
    },
    [loading, paperCat]
  );
}

export default PaperCat;
