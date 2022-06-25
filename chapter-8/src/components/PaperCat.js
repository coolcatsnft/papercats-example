import { useFetchPaperCat } from "../hooks/useFetchPaperCat";

export function PaperCat({ children, id }) {
  const { loading, paperCat } = useFetchPaperCat(id);

  return (
    <>
      { loading && <>Loading Paper Cat...</> }
      { paperCat && (
        <>
          <p>{paperCat.name}</p>
          <ul>
            {paperCat.attributes.map((attr, i) => <li key={i}>{attr.trait_type}: {attr.value}</li>)}
          </ul>
        </>
      ) }
      {children}
    </>
  )
}

export default PaperCat;
