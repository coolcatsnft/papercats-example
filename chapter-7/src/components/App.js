import useFetchPaperCatsContractData from '../hooks/useFetchPaperCatsContractData';
import usePaperCatsContract from '../hooks/usePaperCatsContract';
import { useWeb3 } from '../hooks/useWeb3';
import Web3Button from './Web3Button';

function App() {
  const { address, balance } = useWeb3();
  const { error } = usePaperCatsContract();
  const { loading, name, paused, price, totalSupply, loaded } = useFetchPaperCatsContractData();

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Button />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
      {error && <p>{error.toString()}</p>}
      {loading && <p>Loading contract data!</p>}
      {loaded && <p>{name} contract loaded!</p>}
      {loaded && !paused && <p>The contract is not paused.</p>}
      {loaded && paused && <p>The contract is paused.</p>}
      {loaded && <p>The mint cost is {price} ETH.</p>}
      {loaded && <p>{totalSupply} paper cats found.</p>}
    </div>
  );
}

export default App;
