import React from "react";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ModalRef.module.scss";
import Copied from "./Copied";
import { projectUrl } from "../../ContractData/contract";
import { getRefGems, getRefEss, setInfoOverlay, getRefs } from "../../redux/slices/accountSlice";
import detectEthereumProvider from "@metamask/detect-provider";

export default function ModalRef({ closeModalRef }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const modalRefClose = useRef();
  const [wallet, setWallet] = useState("");
  const [copiedShow, setCopiedShow] = useState(false);

  const refLink = useSelector((state) => state.account.wallet);
  const ess = useSelector((state) => state.account.refEss);
  const gems = useSelector((state) => state.account.refGems);
  const refs = useSelector((state) => state.account.refs);
  const myInvestemnts = useSelector((state) => state.account.myInvestemnts);

  console.log(refLink);

  const checkMetmask = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      dispatch(getRefGems());
      dispatch(getRefEss());
      dispatch(getRefs());
    }
  };

  useEffect(() => {
    dispatch(setInfoOverlay(true));
    checkMetmask();
    document.body.addEventListener("click", handleOutSideClick);

    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unmount");
      dispatch(setInfoOverlay(true));
    };
  }, []);

  useEffect(() => {
    setWallet(refLink);
  }, [refLink]);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current || path[0] === modalRefClose.current) {
      closeModalRef();
    }
  };

  // const copied = () => {

  //   navigator.clipboard.writeText(`${projectUrl}?ref=${wallet}`);
  // };
  console.log(myInvestemnts);
  return (
    <div className={styles.modalPopup} ref={modalRef}>
      <div className={styles.modalPopup_window}>
        <img
          ref={modalRefClose}
          className={styles.close}
          src="/img/close.png"
          alt="close"
          onClick={closeModalRef}
        />
        <div className={styles.refData}>
          <span className={styles.infoStripe_violet}>+{gems.toFixed(0)}</span>
          <span className={`${styles.refData_center} ${styles.infoStripe_green}`}>
            +{refs.toFixed(0)}
          </span>
          <span className={styles.infoStripe_gold}>+{ess.toFixed(0)}</span>
        </div>
        <div className={styles.copyStripe}>
          {myInvestemnts >= 0.1 ? (
            <input
              type="text"
              className={styles.copyStripe_link}
              value={`${projectUrl}?ref=${wallet}`}
            />
          ) : (
            <input
              type="text"
              className={styles.copyStripe_link}
              value="---------------------------------"
            />
          )}

          <button
            className={styles.copyBut}
            onClick={() => {
              if (myInvestemnts < 0.1) return false;
              navigator.clipboard.writeText(`${projectUrl}?ref=${wallet}`).then(() => {
                setCopiedShow(true);
              });
            }}>
            <img src="/img/copy.png" alt="" />
          </button>
        </div>
      </div>
      {copiedShow && <Copied />}
    </div>
  );
}
