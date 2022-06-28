# Displaying Papercat Metadata
In the [last chapter](../chapter-7) we looked at reading from the Papercats contract using the methods provided by `web3.eth.Contract.methods`.  We found that these all return native `Promise` objects that we can either use with `.then` (or `await`) to return the data.  In this chapter we will explore another contract method `tokenUri` which will return the metadata endpoint for a given token id.

## TLDR
Here is our [code repo](https://codesandbox.io/s/papercats-chapter-8-fetching-papercat-data-x61glf) if you want to just look at what we're going to produce in this chapter.

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
  const [tokenUri, setTokenUri] = useLocalStorage(`papercat-${PAPER_CATS_CONTRACT}-${id}-tokenUri`);
  const [error, setError] = useState(null);
  
  return { tokenUri, error };
}

export default useFetchPaperCat;
```
In the example above, along with importing our contract, we've setup the following:
- We have a `id` parameter.
- We are using our `localStorage` hook with a unique key (based on our contract address and token id) to provide (and cache) the `tokenUri`.  
- A state variable to handle an `error` state.
- We also export our state variables for components to use.

### Fetching the tokenUri
Next, let's add a `useEffect` hook to handle our tokenUri loading:
```js
// imports removed
export const useFetchPaperCat = (id) => {
  const { contract } = usePaperCatsContract();
  const [tokenUri, setTokenUri] = useLocalStorage(`papercat-${PAPER_CATS_CONTRACT}-${id}-tokenUri`);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (contract && !tokenUri && !error) {
      contract.methods.tokenURI(id).call().then((tokenURI) => {
        setTokenUri(tokenURI);
      }).catch((err) => {
        setError(err);
      });
    }
  }, [id, contract, tokenUri, setTokenUri, error]);
  
  return { error, tokenUri };
}

export default useFetchPaperCat;
```
In the updated example we've added logic to test if the `contract` exists but the `tokenUri` and the hook isn't in an `error` state, proceed and call tokenUri contract method.  Assuming it resolves we save it to state and localStorage.

This should be all we need so far, so let's create our Papercat component and use our hook!  

### Creating the PaperCat component
Create a new file `src/components/PaperCat.js` and add the following boiler plate:
```js
import { useFetchPaperCat } from "../hooks/useFetchPaperCat";

export function PaperCat({ id }) {
  const { error, tokenUri } = useFetchPaperCat(id);
  const loading = !error && !tokenUri;

  return (
    <>
      { loading && <>Loading Paper Cat...</> }
      { tokenUri && (
        <p>{tokenUri}</p>
      ) }
    </>
  )
}

export default PaperCat;
```
The new component accepts an `id` parameter and uses our new `useFetchPaperCat` hook to import our state variables and outputs either a loading message or the tokenUri depending on if we deem it as loading.  We can assuming the component is loading if `error` and `tokenUri` are falsy.  

We now have the start of our hook and PaperCat component.  Let's try adding it to our `src/components/App.js` file to see if we can output our `tokenUri` state.  With a little javascript magic we can iterate through all of the current token ids in the contract with just a few lines of code:
```js
  {loaded && (
    <>
      {Array.from(Array(Number(totalSupply)).keys()).map((id) => {
        return (
          <PaperCat id={id} key={id} />
        )
      })}
    </>
  )}
```
One assumption that we are making here, is that all of the token ids are in numerical order.  For this example, this is OK however, you may want to add some error checking if you intend your app to appear in a production environment. 

Assuming the code in your repo is correct, you should see a list of `tokenUri`'s when you next refresh your app!  [Here is my version](https://codesandbox.io/s/papercats-chapter-8-tokenuri-s29s26) if you want to compare.  If you open up one of these urls in a browser, you'll see the structure of the papercats metadata!

![image](https://user-images.githubusercontent.com/92721591/176258649-8d36bf7d-2bc8-4e51-816e-7addf6d2ad2d.png)

You can see that as of time of writing, papercats have a name, description, image and two attributes.

### Fetching the PaperCat metadata
We now have all the tools we need to fetch our meta data and have seen what our data looks like, so lets get it into our app.  Create another `localStorage` state variable like the `tokenUri` but name it `paperCat` and `setPaperCat`:
```js
  const [paperCat, setPaperCat] = useLocalStorage(
    `papercat-${PAPER_CATS_CONTRACT}-${id}-metadata`
  );
```
This will be the state that holds our metadata.  Like the `tokenUri` we are giving the `localStorage` value a unique name.  Next, create a new `useEffect` hook in the `src/hooks/useFetchPaperCatData.js` file:
```js
  useEffect(() => {
    if (contract && tokenUri && !paperCat && !error) {
      fetch(
        tokenUri,
        { mode: "cors" }
      ).then((response) => {
        if (response.status !== 200) {
          throw new Error("Invalid response from metadata server");
        }

        response.json().then((data) => {
          setPaperCat({ ...{ id: String(id) }, ...data });
        });
      }).catch((err) => {
        setError(err);
      });
    }
  }, [id, contract, tokenUri, paperCat, setPaperCat, error]);
```
Here we are reacting to the tokenUri being set and using `fetch` (like our ABI file in a previous chapter) to get the metadata json and save it to localStorage.  Lastly, add `paperCat` to our return statement.
```js
  return { tokenUri, paperCat, error }
```
Refreshing our app should see our papercat metadata being fetched in the console:

![image](https://user-images.githubusercontent.com/92721591/176269126-97bd0add-7ed8-4fb7-8454-a5ec6e28a4b1.png)

Almost there! We just have to add our new `paperCat` data into our component:
```js
export function PaperCat({ id }) {
  const { error, tokenUri, paperCat } = useFetchPaperCat(id);
  const loading = !error && !tokenUri;

  return (
    <>
      {loading && <>Loading Paper Cat...</>}
      {paperCat && (
        <>
          <p>{paperCat.name}</p>
          <ul>
            {paperCat.attributes.map((attr, i) => (
              <li key={i}>
                {attr.trait_type}: {attr.value}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
```
Instead of outputting our `tokenUri`, we're testing for existence of our `paperCat` state variable, outputing the name of the cat and looping through our attributes to output the traits and values.  You should see something like this:

![image](https://user-images.githubusercontent.com/92721591/176270893-33b91c01-ffaf-4e7d-80b6-ffd8431767a5.png)

If you've following this far, well done! You've succesfully read from a web3 contact and outputted its data! :+1::partying_face:

## Summary
In this chapter, we've covered caching our data locally, using the `tokenUri` method on the Papercats contract to fetch the metadata uri and finally fetch the metadata itself.  We're also outputting our metadata in a new component.  Time to have a break after that!

## Whats next?
In the [next chapter](../chapter-9), we'll look at minting our very own papercat. See you there!
