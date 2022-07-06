# Minting a PaperCat

In the [last chapter](../chapter-08) we looked at how to fetch and display Paper Cat data from its metadata server and up to this point we have only looked at a web3 contracts `.call()` methods. In this tutorial we're going to focus on minting your own Paper Cat and specifically using the `.adopt()` method.

## TLDR
Similar to other chapters, here is a [code repo](https://codesandbox.io/s/papercats-chapter-9-minting-a-papercat-3urk9c) if you just want to scan over what we're going to produce in this tutorial.

### What is minting?
Before we start, we should briefly cover what the mint process does.  When we ask a contract to mint something (which normally comes at a cost), we will be receiving a token generated from the contract once the transaction has been saved to the blockchain.  In this example, we have seen that the Paper Cat tokenIds are sequential so when we mint a Cat we will be incrementing the sequence by the amount we specify (which is limited to a maximum of 3 cats in our contract).  Users will be asked to pay  a '[gas](https://ethereum.org/en/developers/docs/gas/)' fee in ETH to complete the transaction and my very well also be asked to pay a minting fee as well.  Fortunately, as we are using a test network, we can get test ETH for free from a [faucet](https://faucets.chain.link/rinkeby) that we can use for all of our test mints in this tutorial and beyond.

