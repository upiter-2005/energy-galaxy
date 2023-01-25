import React from "react";
import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import qs from "qs";
import { useDispatch } from "react-redux";
import styles from "./ModalBuy.module.scss";
import { abi, contractAddress, adminWalletForRef } from "../../ContractData/contract";
import {
  updateGem,
  getMyInvestemnts,
  getTotalGalaxy,
  setBnbBalance,
} from "../../redux/slices/accountSlice";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";

export default function ModalBuy({ closeModal }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const bnbRef = useRef(0.1);
  const gemRef = useRef(1);
  const [bnb, setBnb] = useState(0.1);
  const [gem, setGem] = useState(1000);
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");

  const bnbBalance = useSelector((state) => state.account.bnbBalance);
  const wallet = useSelector((state) => state.account.wallet);

  useEffect(() => {
    document.body.addEventListener("click", handleOutSideClick);
    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unount");
    };
  }, []);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current) {
      closeModal();
      setIsLoading("off");
    }
  };

  const calcBnb = () => {
    let bnbVal = bnbRef.current.value;
    let gemVal = gemRef.current.value;
    let findGem = bnbVal / 0.0001;
    findGem = findGem.toFixed(0);
    setBnb(bnbVal);
    setGem(findGem);
  };
  const calcGems = () => {
    let bnbVal = bnbRef.current.value;
    let gemVal = gemRef.current.value;
    let findBnb = (gemVal * 0.0001).toFixed(3);
    setBnb(findBnb);
    setGem(gemVal);
  };

  const callBuyGem = async () => {
    if (bnbBalance < bnb) {
      alert("Not enought BNB");
      return false;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");
    const query = qs.parse(window.location.search.substring(1));
    console.log(query);
    let referral = "";
    if (Object.keys(query).length === 0 && query.constructor === Object) {
      referral = adminWalletForRef;
      console.log(adminWalletForRef);
    } else {
      referral = query.ref;
    }
    try {
      const txId = await contract.buyGemstones(referral, {
        value: ethers.utils.parseEther(bnb.toString()),
        gasPrice: gasPrice * 1.1,
        gasLimit: 350000,
      });
      setTxId(txId.hash);
      setIsLoading("loading");
      console.log(txId);
      const receipt = await txId.wait().then(() => {
        dispatch(updateGem());
        dispatch(getMyInvestemnts());
        setIsLoading("done");
      });
      console.log(receipt);

      let newBalance = await provider.getBalance(wallet);
      let balance = ethers.BigNumber.from(newBalance);
      balance = ethers.utils.formatEther(balance);
      balance = (+balance).toFixed(4);
      dispatch(setBnbBalance(balance));
    } catch (error) {
      console.log(error);
      setIsLoading("error");
    }
  };

  const closeSucces = () => {
    setIsLoading("off");
    closeModal();
  };
  const closeError = () => {
    setIsLoading("off");
    closeModal();
  };
  return (
    <div className={styles.modalPopup} ref={modalRef}>
      {isLoading === "error" && <Error url={txId} closeError={closeError} />}
      {isLoading === "done" && <Success url={txId} closeSucces={closeSucces} />}
      {isLoading === "loading" && <Loading url={txId} />}
      {isLoading === "off" && (
        <div className={styles.modalPopup_window}>
          <img className={styles.close} src="/img/close.png" alt="close" onClick={closeModal} />
          <div className={styles.balanceBNB}>
            <div className={styles.balanceBNB_fon}>
              <span>{bnbBalance > 0 ? bnbBalance : "0.0000"}</span>
            </div>
          </div>
          <div className={styles.changing}>
            <div className={styles.changing_fields}>
              <input
                type="number"
                // placeholder="0"
                min="0.01"
                step="0.001"
                value={bnb}
                ref={bnbRef}
                className={styles.fromBnb}
                onChange={calcBnb}
              />
              <input
                type="number"
                // placeholder="0"
                value={gem}
                min="10"
                step="1"
                ref={gemRef}
                className={styles.toGem}
                onChange={calcGems}
              />
            </div>
            <button className={styles.buyEssentials} onClick={callBuyGem}></button>
          </div>
        </div>
      )}
    </div>
  );
}
