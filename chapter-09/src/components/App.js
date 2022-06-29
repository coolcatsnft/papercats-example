import usePaperCatsData from '../hooks/usePaperCatsData';
import usePaperCatsContract from '../hooks/usePaperCatsContract';
import { useWeb3 } from '../hooks/useWeb3';
import Web3Button from './Web3Button';
import PaperCat from './PaperCat';
import { MintButton } from './MintButton';

function App() {
  const { address, balance } = useWeb3();
  const { error } = usePaperCatsContract();
  const { loading, name, paused, price, totalSupply, loaded, walletOfOwner } = usePaperCatsData();

  return (
    <div className="App">
      <h1>My Paper Cats App!</h1>

      <Web3Button />

      {address && <p>Wallet: {address}</p>}
      {balance && <p>Balance: {balance}</p>}
      {error && <p>{error.toString()}</p>}
      {loading && <p>Loading contract data!</p>}
      {loaded && (
        <>
          <p>{name} contract loaded!</p>
          {!paused && <p>The contract is not paused.</p>}
          {paused && <p>The contract is paused.</p>}
          {<p>The mint cost is {price} ETH.</p>}
          {<p>{totalSupply} paper cats found.</p>}
          {<p>{walletOfOwner.length} paper cats in wallet found.</p>}

          <MintButton amount={1} />

          {Array.from(Array(Number(totalSupply)).keys()).map((id) => {
            return (
              <PaperCat id={id} key={id} />
            )
          })}
        </>
      )}
    </div>
  );
}

export default App;
