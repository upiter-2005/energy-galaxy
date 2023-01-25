import React from "react";
import { useSelector } from "react-redux";
import styles from "./Home.module.scss";
import Planet from "../components/Planet";
import { planets } from "../local_DB/planetsData";

export default function Home() {
  const overlay = useSelector((state) => state.account.overlay);
  const overlayStatus = useSelector((state) => state.account.overlayStatus);
  return (
    <>
      <div
        className={` ${styles.homeWrapper} ${overlay ? `${styles.overlay}` : ""} ${
          overlayStatus ? `${styles.overlayStatus}` : ""
        } `}>
        {planets.map((obj) => (
          <Planet {...obj} key={obj.id} />
        ))}
      </div>
    </>
  );
}
