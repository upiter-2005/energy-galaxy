import React from "react";
import styles from "./InfoBottom.module.scss";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTotalPlanets,
  getMyInvestemnts,
  getTotalGalaxy,
  getEssentialsEarned,
} from "../../redux/slices/accountSlice";
import ModalAbout from "../../components/ModalAbout";
import ModalInfo from "../../components/ModalInfo";
import ModalRef from "../../components/ModalRef";

export default function InfoBottom() {
  const dispatch = useDispatch();

  const [openAbout, setOpenAbout] = useState(false);
  const [openGeneral, setOpenGeneral] = useState(false);
  const [openRef, setOpenRef] = useState(false);

  useEffect(() => {
    dispatch(getTotalPlanets());
    dispatch(getMyInvestemnts());
    dispatch(getTotalGalaxy());
    dispatch(getEssentialsEarned());
  }, []);

  const closeAbout = () => {
    setOpenAbout(false);
  };
  const openModalAbout = () => {
    setOpenAbout(true);
  };

  const closeModalGeneral = () => {
    console.log("close general");
    setOpenGeneral(false);
  };
  const openModalGeneral = () => {
    setOpenGeneral(true);
  };

  const closeModalRef = () => {
    console.log("close general");
    setOpenRef(false);
  };
  const openModalRef = () => {
    setOpenRef(true);
  };
  return (
    <div className={styles.infoBottom}>
      <div className={styles.infoBox_general}>
        <div className={styles.infoBox_link} onClick={openModalRef}>
          <img src="img/gen11.png" alt="" />
          {openRef && <ModalRef closeModalRef={closeModalRef} />}
        </div>
        <div className={styles.infoBox_link} onClick={openModalAbout}>
          <img src="img/info11.png" alt="" />
          {openAbout && <ModalAbout closeAbout={closeAbout} />}
        </div>
        <div className={styles.infoBox_link} onClick={openModalGeneral}>
          <img src="img/gen33.png" alt="" />
          {openGeneral && <ModalInfo closeModalGeneral={closeModalGeneral} />}
        </div>
        <div className={styles.infoBox_link}>
          <img src="img/telegram.png" alt="" />
        </div>
        <div className={styles.infoBox_link}>
          <img src="img/audit.png" alt="" />
        </div>
      </div>
    </div>
  );
}
