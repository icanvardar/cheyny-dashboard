import React, { useContext } from "react";
import Container from "../components/Container";
import ProductMintCard from "../components/ProductMintCard";
import useWallet from "../hooks/useWallet";
import { WalletContext } from "../contexts/WalletProvider";

const Home = () => {
  const [connectWallet] = useWallet();
  const { iswalletFetching, isWalletConnected, setWalletConnected } =
    useContext(WalletContext);

  const _handleConnectWallet = async () => {
    await connectWallet((res) => {
      setWalletConnected(res);
    });
  };

  return isWalletConnected ? (
    <Container>
      <ProductMintCard />
    </Container>
  ) : (
    <div className="hero min-h-screen bg-base-200">
      <div className="text-center hero-content">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to Cheyny</h1>
          <p className="py-6">
            In order to mint, transfer or approve your tokens please connect
            your wallet.
          </p>
          <button
            onClick={_handleConnectWallet}
            className={`btn btn-primary ${iswalletFetching && "loading"}`}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
