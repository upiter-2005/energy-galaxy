import React from "react";
import { useRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import { updateGem, setInfoOverlay } from "../../redux/slices/accountSlice";
import { abi, contractAddress } from "../../ContractData/contract";
import styles from "./ModalReinvest.module.scss";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";

export default function ModalReinvest({ closeModal }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const ess = useSelector((state) => state.account.essentials);
  const [convertedGem, setConvertedGem] = useState(0);
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");

  useEffect(() => {
    dispatch(setInfoOverlay(true));
    document.body.addEventListener("click", handleOutSideClick);

    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unmount");
      dispatch(setInfoOverlay(false));
    };
  }, []);

  useEffect(() => {
    const amountGem = parseInt(ess / 10);
    setConvertedGem(amountGem);
  }, [ess]);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current) {
      closeModal();
    }
  };

  const reinvestGem = async () => {
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

    try {
      const txId = await contract.reinvestEss({
        gasPrice: gasPrice * 1.1,
        gasLimit: 90000,
      });
      setTxId(txId.hash);
      setIsLoading("loading");
      console.log(txId);
      const receipt = await txId.wait().then(() => {
        dispatch(updateGem());
        setIsLoading("done");
      });
      console.log(receipt);
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
          <div className={styles.modalPopup_absBlock}>
            <div className={styles.modalPopup_tokensAmount}>
              <div>{ess.toFixed(0)}</div>
              <div>{convertedGem.toFixed(0)}</div>
            </div>
            <div className={styles.modalPopup_buts}>
              <button onClick={reinvestGem}>
                <img src="img/confirm.png" alt="" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
