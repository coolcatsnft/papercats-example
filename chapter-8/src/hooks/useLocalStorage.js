import { useCallback, useEffect, useState } from "react";

const ONE_DAY = (60 * 60 * 60 * 24);

/**
 * @see https://usehooks.com/useLocalStorage/
 * @param {string} key 
 * @param {mixed}  initialValue 
 * @param {number} lifeSpan 
 */
export function useLocalStorage(
  key,
  initialValue,
  lifeSpan
) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      const stampedValue = JSON.parse(item);
      const value = stampedValue && stampedValue.expire > Date.now() && stampedValue.value;

      return value ? value : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const oldValue = storedValue;
      const expire = Date.now() + (typeof lifeSpan === 'number' ? lifeSpan : ONE_DAY);
      const stampedValue = { expire, value: valueToStore };

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(stampedValue));

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
  }, [key, storedValue, lifeSpan]);

  useEffect(() => {
    const handleLocalStorageChange = (e) => {
      if (e 
        && e.key === key 
        && JSON.parse(e.newValue || null) !== JSON.parse(e.oldValue || null)
      ) {
        setStoredValue(JSON.parse(e.newValue || null));
      }
    }
    
    window.addEventListener("storage", handleLocalStorageChange);
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
