import React from "react";
import { useRef, useEffect, useState } from "react";
import styles from "./ModalLeave.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { updateEss, leaveProjectInit, persents } from "../../redux/slices/accountSlice";
import { ethers } from "ethers";
import { abi, contractAddress } from "../../ContractData/contract";
import { countAwardSixDays } from "../../utils/countAward";
import detectEthereumProvider from "@metamask/detect-provider";

import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";

export default function ModalLeave({ closeModalLeave }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const [leavingEss, setLeavingEss] = useState(0);
  const essentials = useSelector((state) => state.account.essentials);
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current) {
      closeModalLeave();
      setIsLoading("off");
    }
  };

  const countResult = async () => {
    let result = await countAwardSixDays();
    result += essentials;
    setLeavingEss(result);
  };

  const leaveProject = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");
    try {
      const txId = await contract.leaveProject(essentials, {
        gasPrice: gasPrice * 1.2,
        gasLimit: 500000,
      });
      console.log(txId);
      setTxId(txId.hash);
      setIsLoading("loading");
      const receipt = await txId.wait().then(() => {
        dispatch(updateEss());
        dispatch(leaveProjectInit());
        setIsLoading("done");
      });
      console.log(receipt);
    } catch (error) {
      console.log(error);
      setIsLoading("error");
    }
  };

  const checkMetmask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      countResult();
    }
  };

  useEffect(() => {
    checkMetmask();
    //countResult()
    document.body.addEventListener("click", handleOutSideClick);
    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unount");
    };
  }, []);

  return (
    <div className={styles.modalPopup} ref={modalRef}>
      {isLoading === "error" && <Error url={txId} />}
      {isLoading === "done" && <Success url={txId} />}
      {isLoading === "loading" && <Loading url={txId} />}
      {isLoading === "off" && (
        <div className={styles.modalPopup_window}>
          <img
            className={styles.close}
            src="/img/close.png"
            alt="close"
            onClick={closeModalLeave}
          />
          <div className={styles.modalPopup_absBlock}>
            <div className={styles.modalPopup_tokensAmount}>
              <div>{leavingEss}</div>
            </div>
            <div className={styles.modalPopup_buts}>
              <button onClick={leaveProject}>
                <img src="img/okay.svg" alt="" />
              </button>
              <button onClick={closeModalLeave}>
                <img src="img/cansel.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
