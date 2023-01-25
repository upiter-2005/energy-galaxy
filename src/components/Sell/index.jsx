import React from "react";
import { useState, useEffect } from "react";
import styles from "./Sell.module.scss";
import ModalSell from "../ModalSell";
import ModalLeave from "../ModalLeave";
import { useSelector, useDispatch } from "react-redux";
import { updateEss } from "../../redux/slices/accountSlice";

export default function Sell() {
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalLeave, setVisibleModalLeave] = useState(false);
  let ess = useSelector((state) => state.account.claimedEssentials);
  ess = parseInt(ess);
  const openModal = () => {
    console.log("open");
    setVisibleModal(true);
  };
  const closeModal = () => {
    setVisibleModal(false);
  };

  const openModalLeave = () => {
    console.log("open");
    setVisibleModalLeave(true);
  };
  const closeModalLeave = () => {
    setVisibleModalLeave(false);
  };

  const changeToLeave = () => {
    closeModal();
    openModalLeave();
  };

  useEffect(() => {
    dispatch(updateEss());
  }, []);
  return (
    <div className={styles.sell}>
      <span>{ess}</span>
      <img src="/img/gold.webp" alt="" />

      <button className={styles.sellEssentials} onClick={openModal}>
        <img src="img/sell.svg" alt="" />
      </button>
      {visibleModal && <ModalSell closeModal={closeModal} changeToLeave={changeToLeave} />}
      {visibleModalLeave && (
        <ModalLeave closeModalLeave={closeModalLeave} changeToLeave={changeToLeave} />
      )}
    </div>
  );
}
