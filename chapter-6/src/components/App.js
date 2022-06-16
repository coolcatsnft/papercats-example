import usePaperCatsContract from '../hooks/usePaperCatsContract';
import { useWeb3 } from '../hooks/useWeb3';
import Web3Button from './Web3Button';

function App() {
  const { address, balance } = useWeb3();
  const { name } = usePaperCatsContract();

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Button />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
      {name && <p>{name} contract loaded!</p>}
    </div>
  );
}

export default App;
