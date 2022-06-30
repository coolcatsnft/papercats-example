import { useCallback, useEffect, useState } from "react";
import useWeb3 from "./useWeb3";
import usePaperCatsContract from "./usePaperCatsContract";
import usePaperCatsData from "./usePaperCatsData";
import useUpdatePaperCatsData from "./useUpdatePaperCatsData";

const GAS_INCREMENT = 1.2;
const GASPRICE_INCREMENT = 1.2;

export function useAdoptPaperCat() {
  const { library, balance, address } = useWeb3();
  const { contract } = usePaperCatsContract();
  const { price, walletOfOwner } = usePaperCatsData();
  const { setTotalSupply, setWalletOfOwner } = useUpdatePaperCatsData();
  const [adopting, setAdopting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [mintedTokens, setMintedTokens] = useState([]);
  const [error, setError] = useState();

  const handleAdoptError = (err) => {
    setError(err);
    setAdopting(false);
    setStarting(false);
    setTransactionHash('');
    setMintedTokens([]);
  };

  useEffect(() => {
    if (mintedTokens.length) {
      const newTokens = [...new Set([...walletOfOwner].concat(mintedTokens))];
      if (newTokens.length > walletOfOwner.length) {
        setWalletOfOwner(newTokens);
        setTotalSupply(s => s + mintedTokens.length);
        setAdopting(false);
      }
    }
  }, [mintedTokens, walletOfOwner, setWalletOfOwner, setTotalSupply]);

  const adopt = useCallback((amount) => {
    setTransactionHash('');
    setError(undefined);

    return Promise.all([
      library.eth.getGasPrice(),
      contract.methods._paused().call()
    ]).then((data) => {
      const priceInWei = library.utils.toWei(price) * amount;
      const currentGasPrice = data[0];
      if (priceInWei > Number(balance)) {
        throw new Error("Insufficient balance to Adopt");
      }

      if (data[1] === true) {
        throw new Error("Adopting is currently paused");
      }

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
          "sent",
          () => {
            setStarting(true);
          }
        ).on(
          "transactionHash",
          (hash) => {
            setTransactionHash(hash);
            setStarting(false);
            setAdopting(true);
          }
        ).on(
          "confirmation",
          (transactionConfirmationNumber, detail) => {
            const newTokens = [];
            if (Array.isArray(detail)) {
              detail.forEach((d) => {
                newTokens.push(d.events.Transfer.returnValues.tokenId);
              });
            } else {
              newTokens.push(detail.events.Transfer.returnValues.tokenId);
            }

            setMintedTokens(newTokens);
          }
        ).on(
          "error",
          handleAdoptError
        );
      }).catch(handleAdoptError)
    })
  }, [contract, address, balance, library, price]);

  return {
    adopt,
    adopting,
    starting,
    minting: adopting || starting,
    error,
    transactionHash
  }
}

export default useAdoptPaperCat;
