import usePaperCatsContract from '../hooks/usePaperCatsContract';
import { usePaperCatsData } from '../hooks/usePaperCatsData';
import { useWeb3 } from '../hooks/useWeb3';
import Web3Button from './Web3Button';

function App() {
  const { address, balance } = useWeb3();
  const { error } = usePaperCatsContract();
  const { name, totalSupply } = usePaperCatsData();

  console.log(error)

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Button />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
      {error && <p>{error.toString()}</p>}
      {name && <p>{name} contract loaded!</p>}
      {totalSupply && <p>{totalSupply} paper cats found.</p>}
    </div>
  );
}

export default App;
