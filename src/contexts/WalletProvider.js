import { ethers } from "ethers";
import { createContext, useEffect, useState } from "react";

export const WalletContext = createContext();

const WalletProvider = ({ children }) => {
  const [isWalletConnected, setWalletConnected] = useState(false);
  const [iswalletFetching, setWalletFetching] = useState(true);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log(address);
      setWalletConnected(true);
    } catch (err) {
      setWalletConnected(false);
      console.log(err);
    } finally {
      setWalletFetching(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{ isWalletConnected, iswalletFetching, setWalletConnected }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
