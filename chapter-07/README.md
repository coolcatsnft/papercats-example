# Reading from the Papercats Contract

In the [last chapter](../chapter-06) we discussed how to fetch an ABI file and instantiate a `web3.eth.Contract` object.  In this chapter we are going to start exploring what methods you as a developer have available in your new contract and again, we're going to use the Etherscan api as its going to be a big help visualising what's possible.  

## TLDR
Like in previous chapters, if you just want to have a look at some code, [this](https://codesandbox.io/s/papercats-chapter-7-reading-the-papercats-contract-n69jsf) is what we're going to be trying to acheive.

## Exploring the Contract
Looking at the 'Read Contract' option on the [contract page](https://rinkeby.etherscan.io/address/0xb574bc3b58fed191846d678fb1b0127d35832e9a#readContract), Etherscan lists out all of the read methods (you should also see a 'Write Contract' button which we will cover in a later chapter).  The methods we're going to use in our app are:

- `_paused`: returns a boolean based on the status of the contract (whether you can mint a token or not)
- `_price`: returns the cost of minting as an integer
- `balanceOf`: for a given address, return the number of paper cats held
- `name`: returns the name of the contract
- `tokenUri`: returns a metadata URL for a given token id
- `totalSupply`: returns the total number of paper cats minted
- `walletOfOwner`: returns an array of tokenIds owned by a given wallet address

When using a web3 contract in javascript, you will encounter [two functions](https://bitsofco.de/calling-smart-contract-functions-using-web3-js-call-vs-send/) that you will use when calling the contracts methods.  These are `.call()` and `.send()`.  Generally, if you are writing data to a contract, `.send()` will be required but for read methods like the ones listed above, `.call()` can be used.

So, how do we use `.call()` or `.send()`?  Both of these are available via the `web3.eth.Contract.methods()` function, for example, assuming our variable `myContract` is a `web3.eth.Contract` object, we would call the `totalSupply` of this contract using:
```
myContract.methods.totalSupply().call()
```
The `.call()` method will return a javascript Promise which you can use in a chain or with `await`.  So lets have a look at that:
```
myContract.methods.totalSupply().call().then(console.log)
```
By using then and passing in the console log we should get 26 (at the time of writing) output in the console.  This means 26 paper cats have been minted!

## Writing the hook
So, we know that `.call()` returns a Promise of data which means we can use in a new hook that our app can use.  Lets create a new hook in `src/hooks/useFetchPaperCatsContractData`.  Like in other chapters, we're again going to use `useEffect` to react to a state change (which in our case would be the contract object being instantiated) and if the current state meets our requirements, call our new contract methods.  Let's take a look at what that might look like:
```js
import { useEffect, useState } from "react";
import usePaperCatsContract from "./usePaperCatsContract";

export function useFetchPaperCatsContractData() {
  const { contract } = usePaperCatsContract();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState();

  useEffect(() => {
    if (contract && !loading && !loaded && !error) {
      setLoading(true);
      setLoaded(false);
      Promise.all([
        contract.methods.name().call()
      ]).then((data) => {
        setName(data[0]);
        setLoaded(true);
      }).catch((e) => {
        setError(e);
      }).finally(() => {
        setLoading(false);
      });
    }
    
    if (!contract) {
      setName('');
    }
  }, [contract, loading, loaded, error]);
  
  return { loading, loaded, name, error }
}

export default useFetchPaperCatsContractData;

```
In the example above, we're importing our previous hook `usePaperCatsContract` and testing to see if the `contract` object is set.  We're also testing that the loading, loaded and error state properties are _falsey_.  Moving down the example, we are now using [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) to resolve an array of our contract method calls (in this example we're just calling `contract.methods.name().call()`).  Assuming that call resolves correctly, we set our name and loaded state properties and if it doesn't we catch our error and also set that as a state property too.  Finally, we export our state variables at the bottom of our hook so they can be used by our app.

Before expanding our hook, lets have a look to see if it works in our `src/components/App.js`!  Add the following import to your App component:
```js
import useFetchPaperCatsContractData from "../hooks/useFetchPaperCatsContractData";
```
Then use our new hook with the following:
```js
const { loading, loaded, name } = useFetchPaperCatsContractData();
```
And then finally, add our new data to the render output:
```js
{ loaded && <p>{name} contract loaded!</p> }
```
After these three code snippets, you should have the Paper Cats contract name added to your page and your code should be similar to [this example](https://codesandbox.io/s/papercats-chapter-7-reading-the-papercats-contract-fetch-data-example-cvq2wo). Great job so far :+1: :partying_face:

Lets expand our hook to include some new state variables as just having the contract name is nice but not really the data we need.  Add the following state variables:
```js
  const [paused, setPaused] = useState(false);
  const [price, setPrice] = useState(0);
  const [totalSupply, setTotalSupply] = useState("");
  const [walletOfOwner, setWalletOfOwner] = useState([]);
```
After that, expand the contract method calls in the `Promise.all` array:
```js
  Promise.all([
    contract.methods._paused().call(),
    contract.methods._price().call(),
    contract.methods.name().call(),
    contract.methods.totalSupply().call(),
    contract.methods.walletOfOwner(contract.currentProvider.selectedAddress).call()
  ]).then((data) => {
    setPaused(data[0]);
    setPrice(data[1]);
    setName(data[2]);
    setTotalSupply(data[3]);
    setWalletOfOwner(data[4]);
    setLoaded(true);
  }).catch((e) => {
```
A couple of things to be aware of here:
1. The `walletOfOwner` method has a required parameter of the current wallets address.  We can use our `useWeb3` hook here to use the address property but in order to simiplify the hook I'm using the `contract.currentProvider.selectedAddress` property instead.
2. Our promise calls are in a different order so where we had `setName(data[0])`, its now set as `setName(data[2])`.

Lets now export our `paused`, `price`, `totalSupply` and `walletOfOwner` variables from our hook and import them into our App.js.  Your component should now look like this:
```js
  function App() {
    const { address, balance } = useWeb3();
    const { error } = usePaperCatsContract();
    const {
      loading,
      loaded,
      paused,
      price,
      name,
      totalSupply,
      walletOfOwner
    } = useFetchPaperCatsContractData();

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
          </>
        )}
      </div>
    );
  }
```
Assuming everything worked, you should now see the total amount of minted cats (26 as of time of writing), the number of cats in your own wallet, the contract status and mint cost of a paper cat in ETH!  

[Here is what we have produced](https://codesandbox.io/s/papercats-chapter-7-reading-the-papercats-contract-fetch-data-extended-example-i5r9uo) so far.

### Adding to a context
To avoid multiple fetches, lets add our new hook into a context.  Create a new file `src/context/PaperCatsData.js` and similar to our contract context, import our hook and create a `Context` object and return Context.Provider component.  It should look like this:
```js
import { createContext } from "react";
import useFetchPaperCatsContractData from "../hooks/useFetchPaperCatsContractData";
export const PaperCatsDataContext = createContext();

export const PaperCatsDataProvider = ({ children }) => {
  const {
    loading,
    loaded,
    paused,
    price,
    name,
    totalSupply,
    walletOfOwner
  } = useFetchPaperCatsContractData();

  return (
    <PaperCatsDataContext.Provider value={{
      loading,
      loaded,
      paused,
      price,
      name,
      totalSupply,
      walletOfOwner
    }}>
      { children }
    </PaperCatsDataContext.Provider>
  )
}

export default PaperCatsDataContext;
```
Let's now add our context to our `index.js` file like we did for the `src/context/Web3` context:
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { PaperCatsContractProvider } from './context/PaperCatsContract';
import { PaperCatsDataProvider } from './context/PaperCatsData';
import { Web3Provider } from './context/Web3';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <PaperCatsContractProvider>
        <PaperCatsDataProvider>
          <App />
        </PaperCatsDataProvider>
      </PaperCatsContractProvider>
    </Web3Provider>
  </React.StrictMode>
);
```
And also create a new hook, `src/hooks/usePaperCatsData.js` to use our context:
```js
import { useContext } from "react";
import { PaperCatsDataContext } from "../context/PaperCatsData";

export function usePaperCatsData() {
  const context = useContext(PaperCatsDataContext)
  if (context === undefined) {
    throw new Error('usePaperCatsData must be used within a PaperCatsDataContext')
  }

  return context;
}

export default usePaperCatsData;
```
We can now replace our `useFetchPaperCatsContractData` hook with our context hook in our `src/components/App.js` component:
```js
import useWeb3 from '../hooks/useWeb3';
import usePaperCatsContract from '../hooks/usePaperCatsContract';
import usePaperCatsData from '../hooks/usePaperCatsData';
import Web3Button from './Web3Button';

function App() {
  const { address, balance } = useWeb3();
  const { error } = usePaperCatsContract();
  const { loading, name, paused, price, totalSupply, loaded, walletOfOwner } = usePaperCatsData();
```
As all of the state variables are the same, it should just be a name replacement from `useFetchPaperCatsContractData` to `usePaperCatsData` and the rest of the file will stay the same.  Reloading your app, you should see the result is the same but now we have our contract data available to any subscribing component!

## Future proofing
Up to this point, we have only been focused on reading data.  In future chapters when we discuss minting, we will also need to update our local state variables `totalSupply` and `walletOfOwner` and to do that we will need to expose the setters `setTotalSupply` and `setWalletOfOwner`.  We could add them to the hook and context we have just created however there is a small problem with this.  If calling one of these setters in a subscribed component, we could potentially cause a double render of our App.  For simple examples, this probably doesn't matter however as your application grows the number of times your data renders starts to get very important.  To get around this we must move our setters into a new context and subscribe to that if we need to update the data.  For more on this topic, [these articles](https://devtrium.com/posts/how-use-react-context-pro#separate-state-and-state-setters-if-necessary) cover the topic in more detail and are an [interesting read](https://kentcdodds.com/blog/how-to-optimize-your-context-value).

To get started, we need to first export our setters in the `src/hooks/useFetchPaperCatsContractData.js` hook like so:
```js
  return { loading, error, paused, price, name, totalSupply, walletOfOwner, loaded, setWalletOfOwner, setTotalSupply };
}

export default useFetchPaperCatsContractData;
```
We can then create a new context in `src/context/PaperCatsData.js` and use these setters as its value:
```js
...
export const PaperCatsSetDataContext = createContext();

export const PaperCatsDataProvider = ({ children }) => {
  const {
    ... // Existing values
    setWalletOfOwner,
    setTotalSupply
  } = useFetchPaperCatsContractData();

  return (
    <PaperCatsDataContext.Provider value={{
      loading,
      loaded,
      paused,
      price,
      name,
      totalSupply,
      walletOfOwner
    }}>
      <PaperCatsSetDataContext.Provider value={{
        setTotalSupply,
        setWalletOfOwner
      }}>
        { children }
      </PaperCatsSetDataContext.Provider>
    </PaperCatsDataContext.Provider>
  )
}
```
By moving our setters into a child context we can avoid the duplicate renders as we can choose which components subscribe to values, setters or both!  This approach is simple but can help our apps performance as it expands and worth covering now rather than later.

## Summary
In this chapter, we have covered how to interact with a `web3.eth.Contract` instance and using its methods, exposed its data into a hook and context.  We now have the tools to start displaying Paper Cat data in our app and in an upcoming chapter, being able to mint our own Paper Cat as well.  [Click here](https://codesandbox.io/s/papercats-chapter-7-reading-the-papercats-contract-n69jsf) for the full code example.

## Whats next?
In the [next chapter](../chapter-08), we'll look at using the `tokenUri` method in our contract object to get our Paper Cats repository location and use that to fetch its metadata.  See you there!
