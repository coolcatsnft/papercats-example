# Welcome to Paper Cats!

<img src="./assets/Paper_Cat.svg" alt="Paper Cat" height="200">

<h2><img src="./assets/Warning.svg" alt="Work in progress!" width="20" />&nbsp;&nbsp;&nbsp;Work in progress&nbsp;&nbsp;&nbsp;<img src="./assets/Warning.svg" alt="Work in progress!" width="20" /></h2>

This project is currently work in progress.  We will be adding step by step tutorials over time.  You can however, view the final code [here](https://github.com/coolcatsnft/papercats-example/tree/main/final).

## Prerequisites

There will be a considerable amount of code in this guide so familiarity in the following will be a major help:

- HTML
- CSS
- JavaScript
- Command line (linux, macOS, WSL or Windows)
- Node.js and npm (Node.js package manager)

You will also need:

- A Web3 wallet (we will be connecting via metamask in this guide)
- Lots of time to read!

## Aims of this Project

In this series of tutorials, we will be taking a user through all the necessary steps they will need to create a [React](https://reactjs.org) based application that can connect to a [Wallet](https://moralis.io/what-is-a-web3-wallet-web3-wallets-explained/) and call a blockchain contract on the [Rinkeby](https://www.rinkeby.io/) network.

This repository will guide you through the following:

- Setup an environment suitable for developing a [React](https://reactjs.org) based application.
  - [View Tutorial](chapter-1)
- Bootstrap a new site using the [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) toolchain.
  - [View Tutorial](chapter-2)
- Customising your Project
  - [View Tutorial](chapter-3)
- Integrating a [library](https://github.com/coolcatsnft/web3-widget) to handle connecting to a web3 wallet.
  - [View Tutorial](chapter-4)
- Adding [Context](https://reactjs.org/docs/context.html) to our app to help make our web3 variables available to any subscribing components.
  - [View Tutorial](chapter-5)
- Connecting to and reading data from the [Paper Cats contract](https://testnets.opensea.io/collection/paper-cats-v1-1-beta).
  - [View Tutorial](chapter-6)
- Minting your first paper cat!
- Styling your app.
- Hosting your app on github.

### Rinkeby?
Throughout this series of tutorials, we will be referring to a Paper Cats Contract which is hosted on the Rinkeby blockchain test network (or _testnet_).  If you haven't heard of Rinkeby or even a blockchain network, it would be worth taking some time to learn about these and how they operate.

Several concepts which will be of use would be:
- [What is a Blockchain?](https://en.wikipedia.org/wiki/Blockchain)
- What are the [Etheruem](https://ethereum.org/en/) and [Rinkeby](http://www.alchemy.com/overviews/rinkeby-testnet) networks?
- [Understanding](https://www.ledger.com/academy/how-to-read-a-blockchains-transaction-history) and viewing blockchain transactions (in our case this would be using [Etherscan](https://rinkeby.etherscan.io/)).
- What is a [Smart Contract](https://ethereum.org/en/developers/docs/smart-contracts/)?
