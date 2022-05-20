import { useEffect, useState } from "react";

export function useWatchLocalStorage(key: string, initialValue?: any) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [value, setValue] = useState<any>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

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
