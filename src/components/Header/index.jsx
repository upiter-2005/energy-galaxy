import React from "react";
import styles from "./Header.module.scss";
import Buy from "../Buy";
import Sell from "../Sell";

export default function Home({ toConnect, walletNum }) {
  const wallet = walletNum
    ? walletNum.slice(0, 5) + "....." + walletNum.slice(-6)
    : `Connect wallet`;
  return (
    <>
      <div className={`${styles.header}  `}>
        <div className={styles.logo}>
          <img src="./img/logo.png" alt="" />
        </div>
        <div className={styles.interactiveBlock}>
          <Buy />
          <Sell />
        </div>
        <div className={styles.connectBlock}>
          <button className={styles.connectWallet} onClick={toConnect}>
            {wallet}
          </button>
        </div>
      </div>
    </>
  );
}
