import React, { createContext, useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { env } from "../utils";
import { useWeb3 } from "./Web3";

type TPaperCatsContext = {
  contract: any,
  loading: boolean,
  minting: boolean,
  error: Error|null,
  mintingTransaction: string,
  mintingAmount: number,
  confirmationNumber: number,
  paperCats: string[]|null,
  mintPaperCats: Function
};

interface IProviderChildren {
  children: React.ReactNode
}

const Defaults = {
  contract: null,
  loading: false,
  minting: false,
  error: null,
  mintingTransaction: "",
  confirmationNumber: 0,
  mintingAmount: 0,
  paperCats: null,
  mintPaperCats: (): void => {}
};

export const PAPER_CATS_CONTRACT = env('REACT_APP_PAPER_CATS_CONTRACT');
const ABI_LOCALSTORAGE_KEY = env('REACT_APP_ABI_LOCALSTORAGE_KEY');
const ADOPT_PRICE = env('REACT_APP_ADOPT_PRICE');
const GASPRICE_INCREMENT = env('REACT_APP_GASPRICE_INCREMENT');
const GAS_INCREMENT = env('REACT_APP_GAS_INCREMENT');

const fetchAbi = (): Promise<string> => {
  return fetch(`//api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${PAPER_CATS_CONTRACT}&format=raw`).then((res: any) => {
    if (res.status !== 200) {
      throw new Error('Error connecting to etherscan');
    }
    return res.json().then((json: any) => {
      if (json.message === "NOTOK") {
        throw new Error('Error parsing abi json');
      }
      
      return json;
    });
  });
}

const PaperCatsContext = createContext<TPaperCatsContext>(Defaults);

const PaperCatsProvider = ({ children }: IProviderChildren) => {
  const { library, address } = useWeb3();
  const [contract, setContract] = useState<any>(Defaults.contract);
  const [fetchingAbi, setFetchingAbi] = useState<boolean>(false);
  const [minting, setMinting] = useState<boolean>(Defaults.minting);
  const [mintingAmount, setMintingAmount] = useState<number>(Defaults.mintingAmount);
  const [confirmationNumber, setConfirmationNumber] = useState<number>(Defaults.confirmationNumber);
  const [error, setError] = useState<Error|null>(Defaults.error);
  const [mintingTransaction, setMintingTransaction] = useState<string>(Defaults.mintingTransaction);
  const [paperCats, setPaperCats] = useState<string[]|null>(Defaults.paperCats);
  const [paperCatsAbi, setAbi] = useLocalStorage<string|null>(ABI_LOCALSTORAGE_KEY, null);

  useEffect(() => {
    if (address && library && !paperCatsAbi && !fetchingAbi) {
      setFetchingAbi(true);
    }
  }, [paperCatsAbi, address, library, fetchingAbi])

  useEffect(() => {
    if (fetchingAbi && !error) {
      fetchAbi().then((newAbi: string) => {
        setAbi(newAbi);
        setFetchingAbi(false);
      }).catch((err: Error) => {
        console.error(err);
        setError(new Error(`Error fetching ABI file: ${err.toString()}`));
        setFetchingAbi(false);
      });
    }
  }, [fetchingAbi, setAbi, error]);

  useEffect(() => {
    if (paperCatsAbi && !contract && library) {
      setContract(new library.eth.Contract(paperCatsAbi, PAPER_CATS_CONTRACT));
    }

    if (!library) {
      setContract(Defaults.contract);
    }
  }, [paperCatsAbi, library, contract])

  const fetchCats = useCallback(() => {
    if (!contract || !address) {
      return;
    }

    return contract.methods.walletOfOwner(
      address
    ).call().then((ids: string[]) => {
      setPaperCats(ids);
    });
  }, [contract, address]);

  useEffect(() => {
    if (contract) {
      fetchCats();
    }
  }, [contract, fetchCats])

  useEffect(() => {
    if (!library || !address) {
      setPaperCats(null);
      setContract(null);
    }
  }, [library, address])
  
  const handleMintSent = () => {
    setError(null);
    setMintingTransaction("");
    setMinting(true);
    setConfirmationNumber(0);
  }

  const handleMintTransactionHash = (hash: string) => {
    setMintingTransaction(hash);
  }

  const handleMintError = (error: Error) => {
    setMinting(false);
    setError(error);
    setMintingAmount(0);
  }

  const handleTransactionConfirmation = (confirmationNumber: number, detail: any, callback?: Function) => {
    setConfirmationNumber(confirmationNumber);
    setMinting(false);
    fetchCats();
    setMintingAmount(0);

    if (callback) {
      callback();
    }
  }

  const mintPaperCats = (amount: number, callback?: Function) => {
    setError(null);
    const priceInWei = library.utils.toWei(ADOPT_PRICE) * amount;
    setMintingAmount(amount);
    
    return library.eth.getBalance(address, (err: Error, balance: string) => {
      if (err || priceInWei > Number(balance)) {
        setError(err || new Error("Insufficient balance to mint"));
        return;
      }

      setMinting(true);
      return library.eth.getGasPrice().then((currentGasPrice: string) => {
        return contract?.methods.adopt(
          amount
        ).estimateGas({
          from: address,
          value: priceInWei
        }).then((gas: string) => {
          return contract?.methods.adopt(
            amount
          ).send({
            from: address,
            value: priceInWei,
            gas: parseInt((parseInt(gas, 10) * GAS_INCREMENT).toFixed(0), 10),
            gasPrice: (GASPRICE_INCREMENT * parseInt(currentGasPrice, 10)).toFixed(0),
          }).on(
            "sent",
            handleMintSent
          ).on(
            "transactionHash",
            handleMintTransactionHash
          ).on(
            "confirmation",
            (confirmationNumber: number, detail: any) => {
              handleTransactionConfirmation(confirmationNumber, detail, callback);
            }
          ).on(
            "error",
            handleMintError
          );
        }).catch(handleMintError)
      }).catch(handleMintError);
    });
  };

  const getSortedPaperCats = () => {
    if (paperCats) {
      return [...paperCats].sort((a: string, b: string) => {
        return Number(a) - Number(b);
      })
    }

    return paperCats;
  }

  return (
    <PaperCatsContext.Provider value={{
      contract,
      loading: fetchingAbi,
      minting,
      error,
      mintingTransaction,
      mintingAmount,
      confirmationNumber,
      paperCats: getSortedPaperCats(),
      mintPaperCats
    }}>
      { children }
    </PaperCatsContext.Provider>
  )
}

export { PaperCatsProvider, PaperCatsContext }
