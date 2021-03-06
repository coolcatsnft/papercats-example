import { useCallback, useEffect, useState } from "react";
import useWeb3 from "./useWeb3";
import usePaperCatsContract from "./usePaperCatsContract";
import usePaperCatsData from "./usePaperCatsData";
import useUpdatePaperCatsData from "./useUpdatePaperCatsData";

const GAS_INCREMENT = 1.2;
const GASPRICE_INCREMENT = 1.2;

export function useMintPaperCat() {
  const { library, balance, address } = useWeb3();
  const { contract } = usePaperCatsContract();
  const { price, walletOfOwner, mintAmount } = usePaperCatsData();
  const { setTotalSupply, setWalletOfOwner, setMintAmount } = useUpdatePaperCatsData();
  const [mintedTokens, setMintedTokens] = useState([]);
  const [error, setError] = useState();

  /**
   * React to the mintedTokens state changing.
   * 
   * This will create a unique array of token ids for the user and set
   * that array as their walletOfOwner array if the length is larger.  
   * 
   * This will not account for transfers.
   */
  useEffect(() => {
    if (mintedTokens.length) {
      const newTokens = [...new Set([...walletOfOwner].concat(mintedTokens))];
      if (newTokens.length > walletOfOwner.length) {
        setWalletOfOwner(newTokens);
        setTotalSupply(s => s + mintedTokens.length);
        setMintAmount(0);
      }
    }
  }, [mintedTokens, walletOfOwner, setWalletOfOwner, setTotalSupply, setMintAmount]);

  /**
   * React to the error state changing.
   * 
   * If there is an error, set the mint amount to its default value.  
   * 
   * This will cause the app to revert out of its 'minting' state.
   */
  useEffect(() => {
    if (error) {
      setMintAmount(0);
    }
  }, [error, setMintAmount]);

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
    setError(undefined);

    return Promise.all([
      library.eth.getGasPrice(),
      contract.methods._paused().call()
    ]).then((data) => {
      const priceInWei = library.utils.toWei(price) * amount;
      const currentGasPrice = data[0];
      if (priceInWei > Number(library.utils.toWei(balance))) {
        throw new Error("Insufficient balance to Mint");
      }

      if (data[1] === true) {
        throw new Error("Minting is currently paused");
      }

      setMintAmount(amount);

      // In order for a smooth transaction to happen, we need to estimate the
      // amount of gas its going to cost.  By using .estimateGas(), this returns
      // a suitable amount of gas which we will use when we call .send().
      return contract.methods.adopt(
        amount
      ).estimateGas({
        from: address,
        value: priceInWei
      }).then((gas) => {
        return contract.methods.adopt(
          amount
        ).send({
          from: address,
          value: priceInWei,
          gas: parseInt((parseInt(gas, 10) * GAS_INCREMENT).toFixed(0), 10),
          gasPrice: (GASPRICE_INCREMENT * parseInt(currentGasPrice, 10)).toFixed(0),

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
        ).on("error", setError);
      }).catch(setError)
    })
  }, [contract, address, balance, library, price, setMintAmount]);

  return {
    mint,
    mintAmount,
    error
  }
}

export default useMintPaperCat;
