import React from "react";
import { usePaperCats } from "../hooks/usePaperCats";
import { useWeb3 } from "../context/Web3";
import Error from "./Error";
import Header from "./Header";

export function Faucet({ children, className = "" }: { children?: React.ReactNode, className?: string }) {
  return (
    <a href="https://faucets.chain.link/rinkeby" target="_blank" rel="noreferrer" className={className}>{children}</a>
  )
}

function convertBalance(balance: string) {
  return Number(balance).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }
  )
}

export default function Intro() {
  const { contract, loading, error } = usePaperCats();
  const { balance, checkingBalance, library } = useWeb3();
  return (
    <>
      <Header size={1}>Welcome to Paper Cats!</Header>
      {!contract && <p>Use the connect button to connect using web3 and mint you very own Paper Cat!</p>}
      {!contract && <p>There are a few pre-requisites you need to have in order to begin:</p>}
      {!contract && (
        <ol>
          <li>You will need a web3 wallet like <a href="https://metamask.io/" target="_blank" rel="noreferrer">metamask</a> installed.</li>
          <li>You will need some funds in your wallet.  You can get some test ETH from a faucet like <Faucet>this one</Faucet>.</li>
        </ol>
      )}
      {!contract && loading && <p>Fetching abi file...</p>}
      {contract && library && (
        <p>
          {checkingBalance && <>Fetching balance...</>}
          {!checkingBalance && <>{`Your balance is: ${convertBalance(library.utils.fromWei(balance)) } `}<abbr title="Ethereum">Ξ</abbr></>}
          {error && error.toString().indexOf('balance') >= 0 && <>{' '}<Faucet className="button">Need More ETH?</Faucet></>}
        </p>
      )}
      <Error />
    </>
  )
}