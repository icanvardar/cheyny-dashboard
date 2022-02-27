import { ethers } from "ethers";
import { useState } from "react";
import CheynyInstance from "../abis/Cheyny.json";

const GAS_LIMIT = "0x100000";
const CONTRACT_ADDRESS = "0x90752051a56079471e76a72c1bb4796945D2f871";

const useWallet = () => {
  const [provider, setProvider] = useState();

  const connectWallet = async (cb) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log(signer);
        cb(true);
      }
    } catch (err) {
      console.log(err);
      cb(false);
    }
  };

  const mintItem = async (uri, address) => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const currentGasPrice = await provider.getGasPrice();
      let gasPrice = ethers.utils.hexlify(parseInt(currentGasPrice));
      const signer = provider.getSigner();
      const connectedAddress = await signer.getAddress();

      const cheynyContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CheynyInstance.abi,
        signer
      );

      const txnResult = await cheynyContract.mintItem(address.toString(), uri, {
        value: 0,
        gasLimit: GAS_LIMIT,
        gasPrice,
        nonce: provider.getTransactionCount(connectedAddress, "latest"),
      });

      console.log(txnResult);
    } catch (err) {
      console.log(err);
    }
  };

  return [connectWallet, mintItem];
};

export default useWallet;
