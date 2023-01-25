import React from "react";
import { useRef, useEffect, useState } from "react";
import styles from "./ModalSell.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { updateEss } from "../../redux/slices/accountSlice";
import { ethers } from "ethers";
import { abi, contractAddress } from "../../ContractData/contract";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";

export default function ModalSell({ closeModal, changeToLeave }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const changebleLeave = useRef();
  const ess = useSelector((state) => state.account.claimedEssentials);
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");

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
    if (path[0] === changebleLeave.current) {
      changeToLeave();
    }
  };

  const withdrawToBnb = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");
    try {
      const txId = await contract.withdrawAward({
        gasPrice: gasPrice * 1.1,
        gasLimit: 100000,
      });
      setTxId(txId.hash);
      setIsLoading("loading");
      console.log(txId);
      const receipt = await txId.wait().then(() => {
        dispatch(updateEss());
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
  console.log(typeof ess);
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
              <div>{(ess * 0.00001).toFixed(4)}</div>
            </div>
            <div className={styles.modalPopup_buts}>
              <button onClick={withdrawToBnb}>
                <img src="img/but-withdraw.png" alt="" />
              </button>
              {/* <button>
                <img src="img/leave.png" alt="" ref={changebleLeave} />
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
