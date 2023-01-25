import React from "react";
import { useState, useEffect } from "react";
import styles from "./Claim.module.scss";
import ModalClaim from "../ModalClaim";
import ModalReinvest from "../ModalReinvest";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrencyEss,
  getPersent,
  setPerDayVal,
  getPerDayEss,
} from "../../redux/slices/accountSlice";
import { countPerDay } from "../../utils/countAward";

export default function Claim() {
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleReinvest, setVisibleReinvest] = useState(false);
  const [qty, setQty] = useState(null);
  const [perDay, setPerDay] = useState(0);

  const essentials = useSelector((state) => state.account.essentials);
  const persentStart = useSelector((state) => state.account.persentStart);
  const perDayEsses = useSelector((state) => state.account.perDayEsses);

  const openModal = () => {
    setVisibleModal(true);
  };
  const openModalReinvest = () => {
    setVisibleReinvest(true);
  };
  const closeModal = () => {
    setVisibleModal(false);
    setVisibleReinvest(false);
  };

  const countPerDayValue = async () => {
    const perDayValue = await countPerDay();
    dispatch(setPerDayVal(perDayValue));
    setPerDay(perDayValue);
  };
  useEffect(() => {
    if (persentStart % 10 === 0) {
      setQty(persentStart / 10);
    } else {
      setQty(Math.floor(persentStart / 10));
    }
  }, [persentStart]);

  useEffect(() => {
    dispatch(getPersent());
    dispatch(getPerDayEss());
    countPerDayValue();

    const interval = setInterval(() => {
      dispatch(getCurrencyEss());
      dispatch(getPersent());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.claim}>
      <div className={styles.claim_topFon}>
        <div className={styles.claim_essentials}>{perDayEsses.toFixed(0)}</div>
        <div className={styles.claim_persent}>
          <span>{persentStart}</span>
          <div className={styles.scale}>
            {qty > 0 &&
              Array(Math.floor(qty))
                .fill(0)
                .map((obj, i) => <img key={i} src="/img/segment.png" alt="" />)}
            {/* <div className={styles.scale_value} style={{ width: `${persentStart}%` }}></div> */}
          </div>
        </div>
      </div>

      <div className={styles.claim_buts}>
        <button onClick={openModal}>
          <img src="img/claim.png" alt="" />
        </button>
        <button onClick={openModalReinvest}>
          <img src="img/reinvest.png" alt="" />
        </button>
      </div>
      {visibleModal && <ModalClaim closeModal={closeModal} />}
      {visibleReinvest && <ModalReinvest closeModal={closeModal} />}
    </div>
  );
}
