import { useEffect, useState } from 'react';
import Web3Widget from './Web3Widget';

function App() {
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

    return () => {
      document.removeEventListener('web3-widget-event', handleWidgetEvent);
    }
  }, []);

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Widget />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
    </div>
  );
}

export default App;
