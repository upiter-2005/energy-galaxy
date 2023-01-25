import React from "react";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getContractBalance,
  getMyWithdrawals,
  getTotalGalaxy,
  getTotalPlanets,
  setInfoOverlay,
} from "../../redux/slices/accountSlice";
import styles from "./ModalInfo.module.scss";

export default function ModalInfo({ closeModalGeneral }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const modalRefClose = useRef();
  const myInvestemnts = useSelector((state) => state.account.myInvestemnts);
  const totalGalaxy = useSelector((state) => state.account.totalGalaxy);
  const contractBalance = useSelector((state) => state.account.contractBalance);
  const myWithdrawals = useSelector((state) => state.account.myWithdrawals);

  useEffect(() => {
    dispatch(getContractBalance());
    dispatch(getMyWithdrawals());
    dispatch(getTotalGalaxy());
    dispatch(getTotalPlanets());
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
    console.log(path);
    if (path[0] === modalRef.current || path[0] === modalRefClose.current) {
      closeModalGeneral();
    }
  };

  return (
    <div className={styles.modalPopup} ref={modalRef}>
      <div className={styles.modalPopup_window}>
        <img
          ref={modalRefClose}
          className={styles.close}
          src="/img/close.png"
          alt="close"
          onClick={closeModalGeneral}
        />
        <div className={styles.modalPopup_list}>
          <div className={`${styles.infoStripe} ${styles.infoStripe_violet}`}>
            <span>
              contract balance <img src="/img/bnb-ico.svg" alt="" />
            </span>
            <span>{contractBalance}</span>
          </div>
          <div className={`${styles.infoStripe} ${styles.infoStripe_red}`}>
            <span>total planets </span>
            <span>{totalGalaxy}</span>
          </div>
          <div className={`${styles.infoStripe} ${styles.infoStripe_green}`}>
            <span>
              my investments <img src="/img/bnb-ico.svg" alt="" />
            </span>
            <span>{myInvestemnts}</span>
          </div>
          <div className={`${styles.infoStripe} ${styles.infoStripe_gold}`}>
            <span>
              my withdrawals <img src="/img/bnb-ico.svg" alt="" />
            </span>
            <span>{myWithdrawals}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
