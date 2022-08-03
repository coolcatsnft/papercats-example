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
In the above code block we are retreiving the gas price and checking the paused status of the contract.  As an enchancement, we could also check that the user has enough ETH in their balance to cover the mint cost.  We can use the library method `utils.toWei` to get the wei amount of a number so what we've done is throw an exception if the users balance in wei is less than the cost of the eth to mint (also in wei:
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
      
      const priceInWei = library.utils.toWei(price) * amount;
      if (priceInWei > Number(library.utils.toWei(balance))) {
        throw new Error("Insufficient balance to Mint");
      }
```
Now that we have performed some basic client side validation, we can start looking at calling our contract.  Firstly, lets set our mint amount using `setMintAmount`, this is important as we can test against this value to see if the there is a mint ongoing or not.  Secondly, we can call the `estimateGas` ([see docs](https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#contract-estimategas)) method returned from the `adopt` method on the contract.  This is also important as it allows us to send a gas threshold when performing the proper transaction.
```js
    setMintAmount(amount);

    // In order for a smooth transaction to happen, we need to estimate the
    // amount of gas its going to cost.  By using .estimateGas(), this returns
    // a suitable amount of gas which we will use when we call .send().
    return contract.methods
      .adopt(amount)
      .estimateGas({
        from: address,
        value: priceInWei
      }).then((gas) => {
        // ... Further transaction code will go here
      }).catch(setError);
```
The above example also calls `setError`, a local state variable to hold any errors that the mint process might encounter.  We can also react to this error using `useEffect` and set the mintAmount variable back to zero, effectively cancelling our mint process.
```js
    useEffect(() => {
      if (error) {
        setMintAmount(0);
      }
    }, [error]);
```
Let's now continue the `adopt` process by calling `.send` instead of `.estimateGas` now:
```js
    // ...continued from previous
    }).then((gas) => {
      return contract.methods
        .adopt(amount)
        .send({
          from: address,
          value: priceInWei,
          gas: parseInt(
            (parseInt(gas, 10) * 1.2).toFixed(0),
            10
          ),
          gasPrice: (
            1.2 * parseInt(currentGasPrice, 10)
          ).toFixed(0)

          // React to the confirmation event and add the new tokens from the
          // events object
        }).on(
          "confirmation",
          (transactionConfirmationNumber, detail) => {
            const newTokens = [];
            if (Array.isArray(detail.events.Transfer)) {
              detail.events.Transfer.forEach((d) => {
                newTokens.push(d.returnValues.tokenId);
              });
            } else {
              newTokens.push(detail.events.Transfer.returnValues.tokenId);
            }

            setMintedTokens(newTokens);
          }

          // Also react to the error event incase anything unexpected happens
        )
        .on("error", setError);
```
In the above code, we are calling `.adopt().send()` with four parameters.  The address of the user, the value (currently this is zero), the `gas` which is the maximum amount of gas in wei that should be used for this transaction (note, we are adding a safety net of a 1.2 multiplier to avoid any gas fluctations) and the `gasPrice` which is the current gas price (note, also multiplied by 1.2 to allow for fluctuations).  Once called, the `.send` method returns a [Promise Event](https://web3js.readthedocs.io/en/v1.2.11/callbacks-promises-events.html#promievent) that we are using to subscribe to the events emited from the blockchain.  In our code, we are listening to the `confirmation` and `error` events.  The error event is simple, we react to an error event in the same way we handle a promise error by setting the error property using `setError`, this will again cancel the mint process if this event occurs.  The confirmation event is the final event of the transaction and will include our newly minted token ids in the receipt data.  Depending on how many tokens we chose to mint will determine if the receipt data is an Array or Object, so we're doing a quick check using `Array.isArray` on the value and either returning the `detail.events.Transfer.returnValues.tokenId` or iterate through `detail.events.Transfer` to return all of the `tokenId` properties it contains.  Once complete, we then set our newly minted tokens as a state variable (via setMintedTokens) where we can react to the change using `useEffect`:
```js

  /**
   * React to the mintedTokens state changing.
   *
   * This will create a unique array of token ids for the user and set
   * that array as their walletOfOwner array if the length is larger.
   */
  useEffect(() => {
    if (mintedTokens.length) {
      const newTokens = [...new Set([...walletOfOwner].concat(mintedTokens))];
      if (newTokens.length > walletOfOwner.length) {
        setWalletOfOwner(newTokens);
        setTotalSupply((s) => s + mintedTokens.length);
        setMintAmount(0);
      }
    }
  }, [
    mintedTokens,
    walletOfOwner,
    setWalletOfOwner,
    setTotalSupply,
    setMintAmount
  ]);
```
Here we are responding to the mintedTokens change and passing a new set of ids back to our context.  The react app will respond and show the new paper cats in the users inventory!

## Summary
In our [final example ](https://codesandbox.io/s/papercats-chapter-9-minting-a-papercat-3urk9c), I have compiled all of the code in the chapter into a working example.  The `components/App.js` file now has three `MintButton` components which allow for minting one to three cats at once!

## Whats next?
In the [next chapter](../chapter-10), we'll look at adding some style to our app via `styled-components`.  See you there!
