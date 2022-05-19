import { Container, Header, List } from "@alex-coolcats/cool-cats-web-components";
import { usePaperCats } from "../context/PaperCats";
import { useWeb3 } from "../context/Web3";

export default function Intro() {
  const { contract } = usePaperCats();
  const { balance, checkingBalance, library } = useWeb3();
  return (
    <Container>
      <Header size={1}>Welcome to Paper Cats!</Header>
      {!contract && <p>Use the connect button below to connect using web3 and mint you very own Paper Cat!</p>}
      {!contract && <p>There are a few pre-requisites you need to have in order to begin:</p>}
      {!contract && (
        <List elementType="ol">
          <>You will need a web3 wallet like <a href="https://metamask.io/" target="_blank" rel="noreferrer">metamask</a> installed</>
          <>You will need some funds in your wallet.  You can get some test ETH from a faucet like <a href="https://faucets.chain.link/rinkeby" target="_blank" rel="noreferrer">this one</a>.</>
        </List>
      )}
      {contract && library && (
        <p>
          {checkingBalance && <>Fetching balance...</>}
          {!checkingBalance && `Your balance is: ${library.utils.fromWei(balance) }`}
        </p>
      )}
    </Container>
  )
}