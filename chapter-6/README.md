# Connecting to the Papercats Contract

Now we have a working Web3 connection, in this chapter we're going to get our fisrt taste of using a reading from a smart contract.  The current Paper Cats contract address on the Rinkeby network is `0xB574BC3b58fED191846D678fB1B0127d35832e9A`.  Keeping your contract address up to date is key when doing web3 development so if you are not involved with the development of the contract or contracts yourself make sure you keep informed of its development so you don't use an incorrect version.

## TLDR
As in other projects, if you just want to see some working code, here is our working [code repo](https://codesandbox.io/s/papercats-chapter-6-connecting-to-contract-part-1-n69jsf).

## Obtaining an ABI file
In order to read a smart contract, we need to use an [ABI](https://www.quicknode.com/guides/solidity/what-is-an-abi) (or Application Binary Interface) file to map the contracts methods and structures into an object that our application can use.  If you're not familiar with ABI files, its worth reading the previous link before continuing with this article.  Essentially what we're going to do is fetch some JSON (which is our ABI file) and create a web3 [Contract object](https://github.com/ChainSafe/web3.js/blob/1.x/docs/web3-eth-contract.rst) with it.  

Before we can fetch the ABI file JSON, we need to know where to fetch it from! Smart contracts can be either verified or non verified, the difference between the two is that verified contracts can be fetched from the [etherscan api](https://etherscan.io/apis).  If you work with a non verified contract, you will need to obtain the ABI differently to what I'm going to describe in this article.

To fetch a verified contracts ABI file from the etherscan api, we can use the following http request:
```
https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=0xB574BC3b58fED191846D678fB1B0127d35832e9A&format=raw
```
If you copy and paste the above line into a browser window you should see the Paper cats ABI file in all its glory!  We could theoretcially copy and paste this JSON into our project and use that as a static import, however, where is the [FUN](https://en.wikipedia.org/wiki/Fun) in that! :)

### Fetching the ABI programatically
Let's get started with some code!  We are going to create a new hook which will be responsible for performing a HTTP request to the ethercan endpoint (via the native fetch api) and store its response in state for our app to use.  Create a new file in your `hooks` directory and call it `useFetchContract`.  Copy and paste the following code, I will expain what the hook is doing:
```
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
        setContractError(err.toString());
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
In this hook we are using the native `fetch` method to call our endpoint with the `contractAddress` property as our address parameter.  The hook, using `useEffect` is calling the `fetchAbi` when the library is fullfilled, the contract hasn't been set, there isn't a contract error and the hook itself isn't in a loading state.

To be continued!
