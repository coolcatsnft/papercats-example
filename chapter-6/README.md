# Connecting to the Papercats Contract

Now we have a working Web3 connection, in this chapter we're going to get our fisrt taste of using a reading from a smart contract.  The current Paper Cats contract address on the Rinkeby network is `0xB574BC3b58fED191846D678fB1B0127d35832e9A`.  Keeping your contract address up to date is key when doing web3 development so if you are not involved with the development of the contract or contracts yourself make sure you keep informed of its development so you don't use an incorrect version.

## TLDR
As in other projects, if you just want to see some working code, here is our working [code repo](https://codesandbox.io/s/papercats-chapter-6-connecting-to-contract-part-1-n69jsf).

## Obtaining an ABI file
In order to read a smart contract, we need to use an [ABI](https://www.quicknode.com/guides/solidity/what-is-an-abi) (or Application Binary Interface) file to map the contracts methods and structures into an object that our application can use.  If you're not familiar with ABI files, its worth reading the previous link before continuing with this article.  Essentially what we're going to do is fetch some JSON (which is our ABI file) and create a web3 [Contract object](https://github.com/ChainSafe/web3.js/blob/1.x/docs/web3-eth-contract.rst) with it.  

Before we can fetch the ABI file JSON, we need to know where to fetch it from! Smart contracts can be either verified or non verified, the difference between the two is that verified contracts can be fetched from the [etherscan api](https://etherscan.io/apis).  If you work with a non verified contract, you will need to obtain the ABI differently to what I'm going to describe in this article.

To fetch a verified contracts ABI file from the etherscan api, we can use the following http request:
```js
https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=0xB574BC3b58fED191846D678fB1B0127d35832e9A&format=raw
```
If you copy and paste the above line into a browser window you should see the Paper cats ABI file in all its glory!  We could theoretcially copy and paste this JSON into our project and use that as a static import, however, where is the fun in that! :)

### Fetching the ABI programatically
Let's get started with some code!  We are going to create a new hook which will be responsible for performing a HTTP request to the ethercan endpoint (via the native fetch api) and store its response in state for our app to use.  Create a new file in your `hooks` directory and call it `useFetchContract`.  Copy and paste the following code, I will expain what the hook is doing:
```js
import { useEffect, useState } from "react";
import useWeb3 from "./useWeb3";

export function useFetchContract(contractAddress) {
  const { library } = useWeb3();
  const [contract, setContract] = useState();
  const [loadingContract, setLoadingContract] = useState(false);
  const [contractError, setContractError] = useState();

  useEffect(() => {
    const fetchAbi = () => {
      return fetch(
        `//api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&format=raw`
      ).then((res) => {
        if (res.status !== 200) {
          throw new Error("Error connecting to etherscan");
        }
        return res.json().then((json) => {
          if (json.message === "NOTOK") {
            throw new Error(json.result || "Error parsing abi json");
          }

          return json;
        });
      });
    };

    if (library && !contract && !loadingContract && !contractError) {
      setLoadingContract(true);
      fetchAbi().then((json) => {
        setLoadingContract(false);
        setContract(new library.eth.Contract(json, contractAddress));
      }).catch((err) => {
        setContractError(err);
        setLoadingContract(false);
      });
    }

    if (!library && contract) {
      setContract(undefined);
      setLoadingContract(false);
    }
  }, [contractAddress, library, contract, loadingContract, contractError]);

  return { loadingContract, contractError, contract };
}

export default useFetchContract;
```
In this hook we are using the native `fetch` method to call our endpoint with the `contractAddress` property as our address parameter.  The hook, using `useEffect` is calling the `fetchAbi` method when the library from our `useWeb3` hook is fullfilled providing that the contract hasn't been already been set, there isn't a contract error (rating limiting from the etherscan api is quite restrictive for free accounts) and the hook itself isn't in a loading state. 

Once the rest call from `fetch` is completed, the resulting json body (our ABI file) can then be used to create our web3 contract object!  We are instantiating our contract and saving it to state in one line `setContract(library.eth.Contract(json, contractAddress))`.  Saving this to state means this can then be used by our app.  There are however, a couple of things that we need to be aware of with this code:

1. On every refresh of our app, the contract will be downloaded.  This is not ideal as it can mean that the etherscan api will rate limit your requests.  In a following chapter, we'll look at using localStorage to cache the json response so we don't have to call the api end every time.  This and any other unexpected errors are caught in the `catch` and will be saved in our state (more on this later).
2. Currently the Rinkeby network is hardcoded in the api URL.  If Papercats ever went to etheruem mainnet, we would need to make a change to accomodate this.  In our final example, I've added [some logic](https://codesandbox.io/s/papercats-chapter-6-connecting-to-contract-hr5ppr?file=/src/hooks/useFetchContract.js:86-610) to query the network id to get the correct api url.  Much better!

Now that we have our hook, lets look at integrating it into a context, much like how we did our web3 context in the previous chapter.  Create a new context in `src/hooks` called `PaperCatsContract.js` and copy and paste the following example:
```js
import { createContext } from "react";
import useFetchContract from "../hooks/useFetchContract";
const PAPER_CATS_CONTRACT = "0xB574BC3b58fED191846D678fB1B0127d35832e9A";
export const PaperCatsContractContext = createContext();

export const PaperCatsContractProvider = ({ children }) => {
  const { contract, loadingContract, contractError } = useFetchContract(
    PAPER_CATS_CONTRACT
  );

  return (
    <PaperCatsContractContext.Provider
      value={{
        contract,
        loading: loadingContract,
        error: contractError
      }}
    >
      {children}
    </PaperCatsContractContext.Provider>
  );
};

export default PaperCatsContractContext;
```
As you can see we are using our hook with the Paper Cats contract address and passing the values from our hook into the context provider.  To make this data available, lets add our provider to our `index.js` file:
```js
  <React.StrictMode>
    <Web3Provider>
      <PaperCatsContractProvider>
        <App />
      </PaperCatsDataProvider>
    </Web3Provider>
  </React.StrictMode>
```
Order is quite important when nesting multiple providers.  You should think about how the data flows in your app and have you most base level providers at the top of the tree with the more specific ones further down.  In this case, we want our contract provider to be dependent on our web3 provider, so the contract provider should be its child.

Finally, in order to complete this last step of our contract provider, we should create a consumer hook for our app components.  Like the web3 hook, we just need to utilise `useContext` in our hook.  Create a new file in `src/hooks` and call it `usePaperCatsContract`.  Copy and past the following:
```js
import { useContext } from "react";
import { PaperCatsContractContext } from "../context/PaperCatsContract";

export function usePaperCatsContract() {
  const context = useContext(PaperCatsContractContext)
  if (context === undefined) {
    throw new Error('usePaperCatsContract must be used within a PaperCatsContractContext')
  }

  return context;
}

export default usePaperCatsContract;
```
If you compare this code to the `src/hooks/useWeb3.js` file you should see that their contents are almost identical.  This pattern we will use for all of our context work throughout this series which hopefully you will find useful.

Let's now try adding some output to our app.  We are going to test the rate limiting error, so in our `src/components/App.js` import the `usePaperCatsContract` hook and add destrucuture the error property into our App file like so:
```js
import { usePaperCatsContract } from "../hooks/usePaperCatsContract";
import { useWeb3 } from "../hooks/useWeb3";
import Web3Button from "./Web3Button";

function App() {
  const { address, balance } = useWeb3();
  const { error } = usePaperCatsContract();
```
Then in the components output, add the following:
```js
{ error && <p>{error.toString()}</p> }
```
Your `src/components/App.js` should now be very similar to the code in our [example file](https://codesandbox.io/s/papercats-chapter-6-connecting-to-contract-hr5ppr?file=/src/components/App.js).  If you refresh your example quickly a few times, you should now hit the rate limiting error which etherscan will enforce:

<img width="472" alt="image" src="https://user-images.githubusercontent.com/92721591/174454762-952b05d3-1b0e-43ca-8b94-f16cb18c17b1.png">

Perfect! We have that error handled.  In a future chapter we'll look at making sure we don't hit that error but for now, its good that its handled in a graceful manner.

## Summary
In this chapter we've covered what an ABI file is, how to fetch a (verified) contracts ABI file from the etherscan api and how to instantiate a web3 contract object from the web3.eth library.

## Whats next?
In the [next chapter](../chapter-7) we will look at exporing and reading data from our contract. See you there!
