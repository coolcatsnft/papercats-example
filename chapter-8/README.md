# Displaying Papercat Metadata
In the [last chapter](../chapter-7) we looked at reading from the Papercats contract using the methods provided by `web3.eth.Contract.methods`.  We found that these all return native `Promise` objects that we can either use with `.then` (or `await`) to return the data.  In this chapter we will explore another contract method `tokenUri` which will return the metadata endpoint for a given token id.

## TLDR
Here is our [code repo](https://codesandbox.io/s/papercats-chapter-8-k5dphi) if you want to just look at what we're going to produce in this chapter.

## Optimising query data
Before we look adding more data requests to our app, we should first consider optimising our current query data so its cached locally.  One thing we do know about our contract is that it's not going to change and if we are fetching the metadata for our Papercats we can safely store this in `localStorage` and read from that on subsequent loads safe in the knowledge that this data will be the same as on the metadata server.

### useLocalStorage hook
In order to use `localStorage` we will create another hook to help use read and write data. In true [Blue Peter](https://www.youtube.com/watch?v=CTnKEqEvqNM) fashion, [here is a hook](https://gist.github.com/Alex-CoolCats/4ae77b5d4d5600970d0f8c75e92a7a18) I made earlier!  This hook will mimic `useState` but will also store and read the data from `localStorage` which means we can avoid future data fetches with some small modifications to our `useEffect` conditions.  To use this hook, copy this gist and paste the contents into a new file `src/hooks/useLocalStorage.js`.

After creating the new hook, we want to first address the issue that our app currently fetches the contract ABI file on every refresh so lets try using our new `localStorage` hook in `src/hooks/useFetchContract.js` to negate this.  To start, import the `localStorage` hook and then create a new state variable and setter, `abi` and `setAbi` like in the example below:
```js
import useLocalStorage from "./useLocalStorage";
... // Other imports

export function useFetchContract(contractAddress) {
  const { library } = useWeb3();
  const [abi, setAbi] = useLocalStorage(`${contractAddress}-abi`);
  ...
```
As you can see, we are using `useLocalStorage` just like how we implement `useState`.  We can use the state variable `abi` in our fetch logic and use its setter `setAbi` to save any new data to `localStorage`.  Where this hook deviates from `useState` is that it has three parameters:
- The first parameter is the storage key which indexes our data.  This is a required parameter.
- The second is the default value which like `useState` is optional.
- And the third is the expiry time in seconds.  By default this is `Infinity`.

In the example above, we're just setting the key and leaving the default value and expiry as we can cache this abi datta indefinitely.

Now we have our state variable, we can modify our `useEffect` methods to only fetch our contract abi if `abi` is null, so lets do that.  First, where we fetch our contract data, add a condtion to resolve early if `abi` exists:
```js
  useEffect(() => {
    const fetchAbi = () => {
      if (abi) {
        return Promise.resolve(abi);
      }
```
Second, where our `Promise` resolves, instead of setting our contract state varaible, instead remove this and add our `setAbi` method instead:
```js
    if (library && !abi && !loadingContract && !contractError) {
      setLoadingContract(true);
      fetchAbi().then((json) => {
        setLoadingContract(false);
        setAbi(json);
      }).catch((err) => {
```
Note, that we have also altered the conditional logic to check to see if `abi` doesn't exist instead of `contract`.

Lastly, we can now add a new hook create the contract object when the `abi` variable exists:
```js
  useEffect(() => {
    if (library && abi && !contract) {
      setContract(new library.eth.Contract(abi, contractAddress));
    }
  }, [contractAddress, library, contract, abi]);
```
The combination of these edits, should lead you to something like [this example](https://codesandbox.io/s/papercats-chapter-8-caching-contract-snd3cr?file=/src/hooks/useFetchContract.js). If you reload your app you will see the abi file being fetched like normal.  On the next reload however you will see that the fetch request is gone and still your app functions! At last some basic caching!  That's all we need from our `localStorage` hook for now, but we will use it again when we start fetching from the metadata server.

## Fetching a Papercat
Now that we have our cache layer implemented, we can finally focus on fetching and displaying our metadata.  For a [ERC721](https://docs.openzeppelin.com/contracts/4.x/erc721) token such as the papercat, the metadata location can be retreived using the `web3.eth.Contract.methods.tokenUri` method.  This will return a uri which can then be in turn fetched to get our tokens data.  Given that we already have  used a contract method and `fetch` in our hooks, we'll combine both of these techinques to achieve our goal.

### Creating the PaperCat hook
To start, create a new hook `src/hooks/useFetchPaperCat.js` and import our contract hook, we'll need this to do our first objective of getting the tokenUri:
```js
import { useEffect, useState } from "react";
import { PAPER_CATS_CONTRACT } from "..";
import useLocalStorage from "./useLocalStorage";
import usePaperCatsContract from "./usePaperCatsContract";

export const useFetchPaperCat = (id) => {
  const { contract } = usePaperCatsContract();
  const [loading, setLoading] = useState(false);
  const [tokenUri, setTokenUri] = useLocalStorage(`papercat-${PAPER_CATS_CONTRACT}-${id}-tokenUri`);
  const [error, setError] = useState(null);
  
  return { loading, error };
}

export default useFetchPaperCat;
```
In the example above, along with importing our contract, we've setup some variables to handle loading, error and success state.  We're also using our `localStorage` hook with a unique key (based on our contract address and token id) to cache the tokenUri once its set.

To be continued!
