import React, { createContext, useContext, useEffect, useState } from "react";

type IWeb3Context = {
  library: any,
  address: string,
  balance: string,
  checkingBalance: boolean,
  fetchBalance: Function
};

interface IProviderChildren {
  children: React.ReactNode
}

const Defaults = {
  library: null,
  address: '',
  balance: '0',
  checkingBalance: false,
  fetchBalance: () => {}
};

const Web3Context = createContext<IWeb3Context>(Defaults);

const Web3Provider = ({ children }: IProviderChildren) => {
  const [library, setLibrary] = useState<any>(Defaults.library);
  const [address, setAddress] = useState<string>(Defaults.address);
  const [balance, setBalance] = useState<string>(Defaults.balance);
  const [checkingBalance, setCheckingBalance] = useState<boolean>(Defaults.checkingBalance);
  const [reFetchBalance, setReFetchBalance] = useState<boolean>(false);

  useEffect(() => {
    const handleWidgetEvent = (e: any) => {
      if (!e || !e.detail || !e.detail.web3) {
        setAddress(Defaults.address);
        setLibrary(Defaults.library);
        return;
      }

      setAddress(e.detail.address);
      setLibrary(e.detail.web3);
    };

    document.addEventListener('web3-widget-event', handleWidgetEvent);
  }, [address, library]);

  useEffect(() => {
    if (!address || !library) {
      setBalance(Defaults.balance);
      return;
    }

    const getBalance = () => {
      setCheckingBalance(true);
      return library.eth.getBalance(address).then((balance: string) => {
        setBalance(balance);
        setCheckingBalance(false);
        setReFetchBalance(false);
      });
    }

    getBalance();
  }, [address, library, reFetchBalance]);

  const fetchBalance = () => {
    setReFetchBalance(true);
  }

  return (
    <Web3Context.Provider value={{
      address,
      library,
      balance,
      checkingBalance,
      fetchBalance
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
