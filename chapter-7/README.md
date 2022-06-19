# Reading from the Papercats Contract

In the [last chapter](../chapter-6) we discussed how to fetch an ABI file and instantiate a `web3.eth.Contract` object.  In this chapter we are going to start exploring what methods you as a developer have available in your new contract and again, we're going to use the Etherscan api as its going to be a big help visualising what's possible.  

## TLDR
Like in previous chapters, if you just want to have a look at some code, [this](https://codesandbox.io/s/papercats-chapter-7-reading-the-papercats-contract-n69jsf) is what we're going to be trying to acheive.

## Exploring the Contract
Looking at the 'Read Contract' option on the [contract page](https://rinkeby.etherscan.io/address/0xb574bc3b58fed191846d678fb1b0127d35832e9a#readContract), Etherscan lists out all of the read methods (you should also see a 'Write Contract' button which we will cover in a later chapter).  As you can see from the previous link, this page lists out all of the various contract methods such as:

- `_paused`: returns a boolean based on the status of the contract (whether you can mint a token or not)
- `_price`: returns the cost of minting as an integer
- `balanceOf`: for a given address, return the number of paper cats held
- `name`: returns the name of the contract
- `tokenUri`: returns a metadata URL for a given token id
- `totalSupply`: returns the total number of paper cats minted
- `walletOfOwner`: returns an array of tokenIds owned by a given wallet address

When using a web3 contract in javascript, you will encounter [two functions](https://bitsofco.de/calling-smart-contract-functions-using-web3-js-call-vs-send/) that you will use when calling the contracts methods.  These are `.call()` and `.send()`.  Generally, if you are writing data to a contract, `.send()` will be required but for read methods like the ones listed above, `.call()` can be used.

So, how can we use these methods?  All of these will be available via its `.methods()` function, for example, assuming our variable `myContract` is a `web3.eth.Contract` object, we would call the totalSupply of this contract using:
```
myContract.methods.totalSupply().call()
```
The `.call()` method will return a javascript Promise which you can use in a chain or with `await`.  So lets have a look at that:
```
myContract.methods.totalSupply().call().then(console.log)
```
By using then and passing in the console log we should get 26 (at the time of writing) output in the console.  This means 26 paper cats have been minted!

## Writing the hook
So, we know that `.call()` returns a Promise of data which means we can use in a new hook that our app can use.  Lets create a new hook in `src/hooks/useFetchPaperCatsContractData`.

To be continued!

