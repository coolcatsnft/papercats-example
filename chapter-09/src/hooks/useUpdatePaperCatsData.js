import { useContext } from "react";
import { PaperCatsSetDataContext } from "../context/PaperCatsData";

export function useUpdatePaperCatsData() {
  const context = useContext(PaperCatsSetDataContext)
  if (context === undefined) {
    throw new Error('useUpdatePaperCatsData must be used within a PaperCatsSetDataContext')
  }

  return context;
}

export default useUpdatePaperCatsData;
