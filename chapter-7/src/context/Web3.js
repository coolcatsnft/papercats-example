import { createContext, useEffect, useState } from "react";

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const handleWidgetEvent = (e) => {
      setAddress(e?.detail?.address || '');
      setBalance(e?.detail?.balance || '');
      setLibrary(e?.detail?.web3 || null);
    };

    document.addEventListener('web3-widget-event', handleWidgetEvent);
  }, []);

  return (
    <Web3Context.Provider value={{
      address,
      library,
      balance
    }}>
      { children }
    </Web3Context.Provider>
  )
}

export default Web3Provider;
