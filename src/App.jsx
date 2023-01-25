import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Home from "./pages/Home";
import Header from "./components/Header";
import Info from "./components/Info";
import Preloader from "./components/Preloader";
import InfoBottom from "./components/InfoBottom";
import { abi, contractAddress, NETWORK_ID } from "./ContractData/contract";
import { useDispatch } from "react-redux";
import { setBnbBalance, updateGem, setWallet, updateEss } from "./redux/slices/accountSlice";
import detectEthereumProvider from "@metamask/detect-provider";
import ModalInstall from "./components/ModalInstall";

//NETWORK_ID = "56"; // CHANGE ON DEPLOY

function App() {
  const metamaskMobileLink = "https://metamask.app.link/dapp/planet.creation.support/";
  const dispatch = useDispatch();

  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState(0);
  const [txBeingSent, setTxBeingSent] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [detected, setDetected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  //=======================================================================

  const _connectWallet = async () => {
    const provider = await detectEthereumProvider();

    if (provider !== window.ethereum) {
      setNetworkError("Please install Metamask");
      return;
    }
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // if (!_checkNetwork()) {
    //   return;
    // }
    _initialize(selectedAddress);

    window.ethereum.on("connect", ([connectInfo]) => {
      console.log("first connection");
      setTimeout(() => window.location.reload(false), 1000);
    });
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      if (newAddress === undefined) {
        return _resetState();
      }
      _initialize(newAddress);
      setTimeout(() => window.location.reload(false), 100);
    });
    window.ethereum.on("chainChanged", ([networkId]) => {
      _resetState();
      setTimeout(() => window.location.reload(false), 100);
    });
  };

  //=======================================================================

  const _initialize = async (selectedAddress) => {
    setAccount(selectedAddress);
    setDetected(true);
    dispatch(setWallet(selectedAddress));
  };

  //=======================================================================
  const _updateBalace = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (account) {
      let newBalance = await provider.getBalance(account);
      let balance = ethers.BigNumber.from(newBalance);
      balance = ethers.utils.formatEther(balance);
      balance = (+balance).toFixed(4);
      dispatch(setBnbBalance(balance));
      setBalance(balance);
    }
  };
  //=======================================================================

  const _resetState = () => {
    setAccount(null);
    dispatch(setWallet(null));
    setTxBeingSent(null);
    setNetworkError(null);
    setTransactionError(null);
    setBalance(null);
  };
  //=======================================================================
  const _checkNetwork = () => {
    window.ethereum.on("chainChanged", (_chainId) => window.location.reload());

    if (window.ethereum.networkVersion === NETWORK_ID) {
      return false;
    } else {
      setNetworkError("Please connect to BSC Smart Chain");
      alert("Please connect to BSC Smart Chain");
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${Number(56).toString(16)}`,
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            chainName: "Smart Chain",
            nativeCurrency: {
              name: "Binance Smart Chain",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://bscscan.com"],
          },
        ],
      });
    }

    return false;
  };
  //=======================================================================
  const _dismissNetworkError = () => {
    setNetworkError(null);
  };

  useEffect(() => {
    _connectWallet();
    let contract = null;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(0);
      contract = new ethers.Contract(contractAddress, abi, signer);
    } catch (error) {
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }
  }, []);

  useEffect(() => {
    _updateBalace();
    dispatch(updateGem());
    dispatch(updateEss());
  }, [account]);

  const closeInstall = () => {
    setIsVisible(false);
  };

  return (
    <div
      className="galaxy-app"
      style={{ background: `url('${process.env.PUBLIC_URL}/img/stars.webp')` }}>
      <Header toConnect={_connectWallet} walletNum={account} />
      <Info />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
      <InfoBottom />
      <Preloader />
      {isVisible ? <ModalInstall closeInstall={closeInstall} /> : ""}
    </div>
  );
}

export default App;
