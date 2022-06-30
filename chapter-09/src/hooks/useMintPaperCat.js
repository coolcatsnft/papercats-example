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

  useEffect(() => {
    if (error) {
      setMintedTokens([]);
      setMintAmount(0);
    }
  }, [error, setMintAmount]);

  const mint = useCallback((amount) => {    
    setError(undefined);

    return Promise.all([
      library.eth.getGasPrice(),
      contract.methods._paused().call()
    ]).then((data) => {
      const priceInWei = library.utils.toWei(price) * amount;
      const currentGasPrice = data[0];
      if (priceInWei > Number(balance)) {
        throw new Error("Insufficient balance to Mint");
      }

      if (data[1] === true) {
        throw new Error("Minting is currently paused");
      }

      setMintAmount(amount);

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
