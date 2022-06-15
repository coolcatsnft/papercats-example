import React, { createContext, useContext, useEffect, useState } from "react";

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [library, setLibrary] = useState(null);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');

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

const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Context')
  }

  return context
}

export { Web3Provider, useWeb3 }
