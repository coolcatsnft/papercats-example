import React, { createContext, useContext, useEffect, useState } from "react";

type IWeb3Context = {
  library: any,
  address: string,
  balance: string
};

interface IProviderChildren {
  children: React.ReactNode
}

const Defaults = {
  library: null,
  address: '',
  balance: '0'
};

const Web3Context = createContext<IWeb3Context>(Defaults);

const Web3Provider = ({ children }: IProviderChildren) => {
  const [library, setLibrary] = useState<any>(Defaults.library);
  const [address, setAddress] = useState<string>(Defaults.address);
  const [balance, setBalance] = useState<string>(Defaults.balance);

  useEffect(() => {
    const handleWidgetEvent = (e: any) => {
      if (!e || !e.detail || !e.detail.address) {
        setAddress(Defaults.address);
        setLibrary(Defaults.library);
        setBalance(Defaults.balance);
        return;
      }

      if (e.detail.address !== address || e.detail.balance !== balance) {
        setAddress(e.detail.address);
        setBalance(e.detail.balance);
        setLibrary(e.detail.web3);
      }
    };

    document.addEventListener('web3-widget-event', handleWidgetEvent);
  }, [address, balance]);

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
