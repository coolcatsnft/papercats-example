import { useEffect, useState } from "react";

/**
 * @see https://usehooks.com/useLocalStorage/
 * @param {string} key 
 * @param {T}      initialValue 
 * 
 * @returns {ILocalStorage}
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const oldValue = storedValue;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Browsers only send the storage event if its
        window.dispatchEvent(
          new StorageEvent(
            'storage', { 
              key,
              newValue: JSON.stringify(valueToStore),
              oldValue: JSON.stringify(oldValue)
            }
          )
        );
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  useEffect(() => {
    const handleLocalStorageChange = (e: StorageEvent) => {
      if (e 
        && e.key === key 
        && JSON.parse(e.newValue || '') !== JSON.parse(e.oldValue || '')
      ) {
        setStoredValue(JSON.parse(e.newValue || ''));
      }
    }
    
    window.addEventListener("storage", handleLocalStorageChange);
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
