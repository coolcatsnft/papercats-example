import { useCallback, useState } from "react";
import useWeb3 from "./useWeb3";
import usePaperCatsContract from "./usePaperCatsContract";
import usePaperCatsData from "./usePaperCatsData";
// import useUpdatePaperCatsData from "./useUpdatePaperCatsData";

const GAS_INCREMENT = 1.2;
const GASPRICE_INCREMENT = 1.2;

export function useAdoptPaperCat() {
  const { library, balance, address } = useWeb3();
  const { contract } = usePaperCatsContract();
  const { price } = usePaperCatsData();
  const [adopting, setAdopting] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState();

  const handleAdoptError = (err) => {
    setError(err);
    setAdopting(false);
    setTransactionHash('');
  }

  const adopt = useCallback((amount) => {
    setTransactionHash('');

    return Promise.all([
      library.eth.getGasPrice(),
      contract.methods._paused().call()
    ]).then((data) => {
      if (data[1] === true) {
        throw new Error("Adopting is currently paused");
      }
      
      const priceInWei = library.utils.toWei(price) * amount;
      const currentGasPrice = data[0];
      if (priceInWei > Number(balance)) {
        throw new Error("Insufficient balance to Adopt");
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
            setAdopting(true);
          }
        ).on(
          "transactionHash",
          (hash) => {
            setTransactionHash(hash);
          }
        ).on(
          "confirmation",
          (confirmationNumber, detail) => {
            console.log(confirmationNumber, detail);
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
    error,
    transactionHash
  }
}

export default useAdoptPaperCat;
