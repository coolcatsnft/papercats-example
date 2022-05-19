import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useWeb3 } from "./Web3";

type IPaperCatsContext = {
  contract: any,
  loading: boolean,
  minting: boolean,
  error: Error|null,
  mintingTransaction: string,
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
  paperCats: null,
  mintPaperCats: (): void => {}
};

const PAPER_CATS_CONTRACT = "0x34b30ace737ffe8112da5cf6bfcb86744e9bea87";
const ABI_LOCALSTORAGE_KEY = 'papercats-abi';
const ADOPT_PRICE = ".0005";
const GASPRICE_INCREMENT = 1.13;
const GAS_INCREMENT = 1.2;
const PaperCatsContext = createContext<IPaperCatsContext>(Defaults);

const PaperCatsProvider = ({ children }: IProviderChildren) => {
  const { library, address } = useWeb3();
  const [contract, setContract] = useState<any>(Defaults.contract);
  const [loading, setLoading] = useState<boolean>(Defaults.loading);
  const [minting, setMinting] = useState<boolean>(Defaults.minting);
  const [confirmationNumber, setConfirmationNumber] = useState<number>(Defaults.confirmationNumber);
  const [error, setError] = useState<Error|null>(Defaults.error);
  const [mintingTransaction, setMintingTransaction] = useState<string>(Defaults.mintingTransaction);
  const [paperCats, setPaperCats] = useState<string[]|null>(Defaults.paperCats);
  const [paperCatsAbi, setAbi] = useLocalStorage<any>(ABI_LOCALSTORAGE_KEY, null);

  useEffect(() => {
    if (address && library && !paperCatsAbi) {
      const fetchAbi = () => {
        return fetch(`//api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${PAPER_CATS_CONTRACT}&format=raw`).then((res: any) => {
          if (res.status !== 200) {
            throw new Error('Error connecting to etherscan');
          }
          return res.json().then((json: any) => {
            if (json.message === "NOTOK") {
              throw new Error('Error parsing abi json');
            }
            
            setAbi(JSON.stringify(json));
            return json;
          });
        });
      }

      setLoading(true);
      fetchAbi().then(() => {
        setLoading(false);
      }).catch((err: Error) => {
        setError(err);
      });
    }
  }, [paperCatsAbi, address, library, setAbi])

  useEffect(() => {
    if (paperCatsAbi && !contract && library) {
      setContract(new library.eth.Contract(JSON.parse(paperCatsAbi), PAPER_CATS_CONTRACT));
    }

    if (!library) {
      setContract(Defaults.contract);
    }
  }, [paperCatsAbi, library, contract])

  useEffect(() => {
    if (!contract || !address) {
      setLoading(false);
      setPaperCats(null);
    }

    if (contract && address && !paperCats && !loading) {
      setLoading(true);
      contract.methods.walletOfOwner(
        address
      ).call().then((ids: string[]) => {
        setPaperCats(ids);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [contract, address, loading, paperCats])

  
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
  }

  const handleTransactionConfirmation = (confirmationNumber: number, detail: any) => {
    setConfirmationNumber(confirmationNumber);
    setMinting(false);
    
    if (Array.isArray(detail)) {
      detail.forEach((d: any) => addPaperCat(d));
    } else {
      addPaperCat(detail);
    }
  }

  const addPaperCat = (detail: any) => {
    const newPaperCats = [...(paperCats || [])];
    newPaperCats.push(detail.events.Transfer.returnValues.tokenId);
    setPaperCats(newPaperCats);
  }

  const mintPaperCats = (amount: number) => {
    setError(null);
    setMinting(true);
    const priceInWei = library.utils.toWei(ADOPT_PRICE) * amount;
    
    return library.eth.getBalance(address, (err: Error, balance: string) => {
      if (err || priceInWei > Number(balance)) {
        setError(err || new Error("Insufficient funds to mint"));
        return;
      }

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
            handleTransactionConfirmation
          ).on(
            "error",
            handleMintError
          );
        }).catch(handleMintError)
      }).catch(handleMintError);
    });
  };

  return (
    <PaperCatsContext.Provider value={{
      contract,
      loading,
      minting,
      error,
      mintingTransaction,
      confirmationNumber,
      paperCats,
      mintPaperCats
    }}>
      { children }
    </PaperCatsContext.Provider>
  )
}

const usePaperCats = () => {
  const context = useContext(PaperCatsContext)
  if (context === undefined) {
    throw new Error('usePaperCats must be used within a PaperCatsContext')
  }

  return context
}

const usePaperCat = (id: number) => {
  const { contract } = useContext(PaperCatsContext)
  if (contract === undefined) {
    throw new Error('usePaperCat must be used within a PaperCatsContext')
  }

  const now = (new Date()).toLocaleDateString();
  const [paperCat, setPaperCat] = useLocalStorage<any>(`${now}-papercat-${id}`, null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (contract && !paperCat && !loading) {
      setLoading(true);
      contract.methods.tokenURI(
        id
      ).call().then((tokenURI: string) => {
        return fetch(
          tokenURI,
          { mode: "no-cors" }
        ).then((response) => response.json().then((json) => {
          setPaperCat(json);
        })).catch(() => {
          setPaperCat({
            id: id,
            name: `Paper Cat #${id}`,
            description: "Some description",
            image: "https://ipfs.io/ipfs/QmUVnqroyG94LU2hBQZmhfRPu5NijmZ7ZFYeLAWrB7APrC",
            attributes: [
              {
                "trait_type": "background",
                "value": "#a3c0ac"
              }, {
                "trait_type": "heart colour",
                "value": "#9CB5FE"
              }
            ]
          })
        }).finally(() => {
          setLoading(false);
        });
      });
    }
  }, [id, contract, paperCat, loading, setPaperCat])

  return { loading, paperCat };
}

export { PaperCatsProvider, usePaperCats, usePaperCat }
