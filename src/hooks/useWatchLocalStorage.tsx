import { useEffect, useState } from "react";

export function useWatchLocalStorage(key: string, initialValue?: any) {
  const [value, setValue] = useState<any>(initialValue || null);

  // Remove the localStorage on browser window close
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e && e.key === key) {
        setValue(JSON.parse(e.newValue));
      }
    }
    
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [key]);

  return {
    value
  }
}

export default useWatchLocalStorage;
