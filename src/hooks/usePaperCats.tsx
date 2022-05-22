import { useContext } from "react";
import { PaperCatsContext } from "../context/PaperCats";


export const usePaperCats = () => {
  const context = useContext(PaperCatsContext)
  if (context === undefined) {
    throw new Error('usePaperCats must be used within a PaperCatsContext')
  }

  return context;
}

export default usePaperCats;
