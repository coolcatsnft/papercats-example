# Minting a PaperCat

In the [last chapter](../chapter-08) we looked at how to fetch and display Paper Cat data from its metadata server and up to this point we have only looked at a web3 contracts `.call()` methods. In this tutorial we're going to focus on minting your own Paper Cat and specifically using the `.adopt()` method.

## TLDR
Similar to other chapters, here is a [code repo](https://codesandbox.io/s/papercats-chapter-9-minting-a-papercat-3urk9c) if you just want to scan over what we're going to produce in this tutorial.

### What is minting?
Before we start, we should briefly cover what the mint process does.  When we ask a contract to mint something (which normally comes at a cost), we will be receiving a token generated from the contract once the transaction has been saved to the blockchain.  In this example, we have seen that the Paper Cat tokenIds are sequential so when we mint a Cat we will be incrementing the sequence by the amount we specify (which is limited to a maximum of 3 cats in our contract).  Users will be asked to pay  a '[gas](https://ethereum.org/en/developers/docs/gas/)' fee in ETH to complete the transaction and my very well also be asked to pay a minting fee as well.  Fortunately, as we are using a test network, we can get test ETH for free from a [faucet](https://faucets.chain.link/rinkeby) that we can use for all of our test mints in this tutorial and beyond.

## Minting our first Cat
Let's get started with our first mint!  What we're going to be doing is attaching a method to a button to call our `.adopt()` contract function.  With this approach we can use our familiar boilerplate of creating a custom hook to provide our new component with the methods and state variables it needs to complete our mint.  We don't necessarily need to use a hook but its nice to separate logic from layout.

Create a new hook `src/hooks/useMintPaperCat.js` with the following boilerplate:
```js
import { useCallback, useEffect, useState } from "react";
import useWeb3 from "./useWeb3";
import usePaperCatsContract from "./usePaperCatsContract";
import usePaperCatsData from "./usePaperCatsData";
import useUpdatePaperCatsData from "./useUpdatePaperCatsData";

export function useMintPaperCat() {
  const { library, balance, address } = useWeb3();
  const { contract } = usePaperCatsContract();
  const { price, walletOfOwner, mintAmount } = usePaperCatsData();
  const { setTotalSupply, setWalletOfOwner, setMintAmount } = useUpdatePaperCatsData();

  /**
   * We decided to use useCallback here.  This creates
   * a memoized function that we can use in our app.  This approach should help
   * reduce a re-render or two.
   * 
   * @param {number} amount
   *
   * @returns {Promise}
   */
  const mint = useCallback((amount) => {    
    // TODO: add minting logic in here
  }, [contract, address, balance, library, price, setMintAmount]);

  return {
    mint,
    mintAmount
  }
}

export default useMintPaperCat;
```
There is quite a lot of code in the new hook but most should be familiar.  We have imported all of our previous hooks, `useWeb3`, `usePaperCatsContract`, `usePaperCatsData` and `useUpdatePaperCatsData` as we're going to utilise all of these in our new hook.  Also included is a `useCallback` function `mint` which will be responsible for performing the mint operation.  We use `useCallback` as it will memoize the method making it possible for react to understand not to re-render any subscribing components.  

We should also create a new component `src/components/MintButton.js` which will handle our mint callback:
```js
import { useCallback, useState } from "react";
import useMintPaperCat from "../hooks/useMintPaperCat"

export function MintButton({ amount }) {
  const { mint, mintAmount } = useMintPaperCat();
  const startMinting = useCallback(() => {
    return mint(amount);
  }, [mint, amount]);

  return (
    <>
      <button disabled={mintAmount > 0} onClick={startMinting}>{mintAmount === amount ? 'Minting...' : `Mint ${amount}`}</button>
    </>
  )
}
```
In this component, we are accepting an `amount` parameter so our `<MintButton>` component can be used for different mint amounts.  We are also disabling our button if our `mintAmount` is greater than zero and setting the text of the button to `Minting...` if the `amount` matches the `mintAmount`.

Now that we have some boilerplate code, let's start filling some of the blanks in!

For every transaction on the ETH network we need to send an additional amount to cover the network processing, there is also a level of competition tied to this amount so the more you pay, the quicker your transaction will go through.  So in order to ensure our transactio goes through we need to send an adequate gas estimation but also not overpay it either.  Fortunately, the web3 library has tools to help so lets see what we can do:

Firstly, lets get the current gas price via the library method [getGasPrice](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#getgasprice) and for good measure, we should check that the mint process is active by checking its paused status again.  If Our `mint` method add the following:
```js
  const mint = useCallback((amount) => {    
    return Promise.all([
      library.eth.getGasPrice(),
      contract.methods._paused().call()
    ]).then((data) => {
      const currentGasPrice = data[0];
      const paused = data[1];
      if (paused === true) {
        throw new Error("Minting is currently paused");
      }
```
In the above code block we are retreiving the gas price and checking the paused status of the contract.

To be continued
