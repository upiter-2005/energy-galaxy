import React from "react";
import { useState } from "react";
import styles from "./Buy.module.scss";
import ModalBuy from "../ModalBuy";
import { useSelector, useDispatch } from "react-redux";
import { updateGem } from "../../redux/slices/accountSlice";
import { useEffect } from "react";

export default function Buy() {
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(false);

  const gems = useSelector((state) => state.account.gems);

  const openModal = () => {
    console.log("open");
    setVisibleModal(true);
  };
  const closeModal = () => {
    setVisibleModal(false);
  };

  useEffect(() => {
    dispatch(updateGem());
  }, []);

  return (
    <>
      <div className={styles.buy}>
        <img src="/img/essentials.webp" alt="" />
        <span>{gems}</span>

        <button className={styles.buyEssentials} onClick={openModal}>
          <img src="img/buy.svg" alt="" />
        </button>

        {visibleModal && <ModalBuy closeModal={closeModal} />}
      </div>
    </>
  );
}
