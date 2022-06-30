import { useContext } from "react";
import { PaperCatsDataContext } from "../context/PaperCatsData";

export function usePaperCatsData() {
  const context = useContext(PaperCatsDataContext)
  if (context === undefined) {
    throw new Error('usePaperCatsData must be used within a PaperCatsDataContext')
  }

  return context;
}

export default usePaperCatsData;
