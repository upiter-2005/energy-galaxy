import React from "react";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateEss,
  getLevePrices,
  setInfoOverlay,
  getWillClaimedEss,
} from "../../redux/slices/accountSlice";
import { ethers } from "ethers";
import { abi, contractAddress } from "../../ContractData/contract";
import styles from "./ModalClaim.module.scss";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";
import { countPerDay } from "../../utils/countAward";

export default function ModalClaim({ closeModal }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");
  const ess = useSelector((state) => state.account.essentials);
  const perDay = useSelector((state) => state.account.perDay);
  const perDayEsses = useSelector((state) => state.account.perDayEsses);
  const willClaimed = useSelector((state) => state.account.willClaimed);

  useEffect(() => {
    dispatch(getLevePrices());
    dispatch(getWillClaimedEss());
    dispatch(setInfoOverlay(true));

    document.body.addEventListener("click", handleOutSideClick);

    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unmount");
      dispatch(setInfoOverlay(false));
    };
  }, []);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    if (path[0] === modalRef.current) {
      closeModal();
    }
  };

  const claimEssentials = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddress, abi, signer);

    let checkInit = await contract.checkInit();
    if (!checkInit) {
      alert("You have not any planet!");
      return false;
    }

    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");
    let txId = null;
    try {
      txId = await contract.claimEssentials({
        gasPrice: gasPrice * 1.1,
        gasLimit: 240000,
      });
      setTxId(txId.hash);
      setIsLoading("loading");
      console.log(txId);
      const receipt = await txId.wait().then(() => {
        dispatch(updateEss());
        dispatch(getLevePrices());
        setIsLoading("done");
      });
      console.log(receipt);
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      console.log(error);
      setIsLoading("error");
      setTxId(txId.hash);
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
          <div className={styles.modalPopup_absBlock}>
            <div className={styles.modalPopup_tokensAmount}>
              <div>{perDayEsses.toFixed(0)}</div>
              <div>{willClaimed.toFixed(0)}</div>
            </div>
            <div className={styles.modalPopup_blockCenter}>
              <img src="/img/Text.png" alt="" className={styles.modalPopup_blockCenter_img} />
              <span className={styles.realEss}>{ess}</span>
            </div>

            <div className={styles.modalPopup_buts}>
              <button onClick={claimEssentials}>
                <img src="img/confirm.png" alt="" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
