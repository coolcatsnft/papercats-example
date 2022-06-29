import useAdoptPaperCat from "../hooks/useAdoptPaperCat"

export function MintButton({ amount }) {
  const { adopt, error, adopting } = useAdoptPaperCat();
  const startAdoption = () => {
    return adopt(amount);
  }

  return (
    <>
      {error && <p>{error.toString()}</p>}
      <button disabled={adopting} onClick={startAdoption}>Mint {amount}</button>
    </>
  )
}