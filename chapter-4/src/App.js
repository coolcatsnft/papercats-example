import { useEffect, useState } from 'react';
import Web3Widget from './Web3Widget';

function App() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [library, setLibrary] = useState(null);

  useEffect(() => {
    const handleWidgetEvent = (e) => {
      if (!e || !e.detail || !e.detail.address || e.detail.status === 'disconnected') {
        setAddress('');
        setBalance('');
        setLibrary(null);
        return;
      }

      if (e.detail.address !== address) {
        setAddress(e.detail.address);
        setBalance(e.detail.balance);
        setLibrary(e.detail.web3);
      }
    };

    document.addEventListener('web3-widget-event', handleWidgetEvent);

    return () => {
      document.removeEventListener('web3-widget-event', handleWidgetEvent);
    }
  }, []);

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />

      {address && <div>Wallet: {address}</div>}
      {balance && <div>Balance: {balance}</div>}
    </div>
  );
}

export default App;
