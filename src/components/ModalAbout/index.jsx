import React from "react";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInfoOverlay } from "../../redux/slices/accountSlice";
import styles from "./ModalAbout.module.scss";
import { contractAddress } from "../../ContractData/contract";

export default function ModalAbout({ closeAbout }) {
  const dispatch = useDispatch();
  const modalRef = useRef();
  const modalRefClose = useRef();

  useEffect(() => {
    dispatch(setInfoOverlay(true));
    document.body.addEventListener("click", handleOutSideClick);
    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unount");
      dispatch(setInfoOverlay(false));
    };
  }, []);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current || path[0] === modalRefClose.current) {
      closeAbout();
    }
  };

  return (
    <div className={styles.modalPopup} ref={modalRef}>
      <div className={styles.modalPopup_window}>
        <img className={styles.close} src="/img/close.png" alt="close" ref={modalRefClose} />
        <div className={styles.modalPopup_absBlock}>
          <div className={styles.content}>
            <p>Welcome to the exciting world of decentralized technologies!</p>
            <p>
              <span className={styles.blue}>ENERGY GALAXY</span> is a long-term blockchain game in
              which you have to develop and improve the unusual Galaxy.
            </p>
            <div className={`${styles.content_flexBlock} ${styles.content_flexBlockCenter}`}>
              <a
                href={`https://testnet.bscscan.com/address/${contractAddress}`}
                target="blank"
                className={styles.aFlex}>
                <img src="img/bsc.png" alt="" />
                <span>BscScan</span>
              </a>
              <a href="#" target="blank" className={styles.aFlex}>
                <img src="img/whitepaper.png" alt="" />
                <span>Whitepaper</span>
              </a>
            </div>
            <h3>Game mechanics</h3>
            <img src="img/ab1.svg" alt="" className={styles.svgImg} />
            <p>
              After connecting the wallet, you get access to the galaxy, which contains{" "}
              <span className={styles.biruza}>7 different planets</span>. The game has two internal
              currencies - <span className={styles.red}>Gemstones</span> and{" "}
              <span className={styles.yellow}>Intergalactic Essence</span>.
            </p>
            <div className={styles.content_flexBlock}>
              <p>
                <span className={styles.red}>1</span>{" "}
                <img src="img/essentials.svg" alt="" className={styles.smImg} /> =
                <span className={styles.paddingLeftYellow}> 0.0001 BNB</span>
              </p>
              <p>
                <span className={styles.yellow}>1</span>{" "}
                <img src="img/gold.svg" alt="" className={styles.smImg} /> =
                <span className={styles.paddingLeftYellow}> 0.00001 BNB</span>
              </p>
            </div>
            <img src="img/ab2.svg" alt="" className={styles.svgImg} />
            <p>
              Using <span className={styles.red}>Gemstones</span>, you can build mines on any planet
              to extract a valuable resource:
              <span className={styles.yellow}>Intergalactic Essence</span>. You can freely exchange
              your <span className={styles.yellow}>Intergalactic Essence</span> for{" "}
              <span className={styles.yellow}>BNB</span> at any time without any fees.
            </p>
            <h3>LONG TERM INVESTMENT</h3>
            <img src="img/ab5.svg" alt="" className={styles.svgImg} />
            <p>
              The <span className={styles.blue}>Energy Galaxy</span> game is designed specifically
              for those players who love to invest and earn in the long run.
            </p>
            <p>To achieve this result, a reliable system of compound interest was developed.</p>
            <span className={styles.green}>+3% per day. </span>
            <span className={styles.blue}>Reinvest </span>: The player converts all their
            <span className={styles.yellow}>essences </span> earned in
            <span className={styles.green}>24 hours</span> into
            <span className={styles.red}>gems </span> to buy new planets and increase daily income.
            <span className={styles.green}>-3% per day. </span> Claim: The player withdraws all
            their <span className={styles.yellow}>essences </span> earned in{" "}
            <span className={styles.green}>24 hours</span> to exchange them for{" "}
            <span className={styles.yellow}>BNB </span>, but the number of{" "}
            <span className={styles.yellow}>essences </span> produced is reduced.
            <p>In long-term projects, participants achieve the greatest success.</p>
            <h3>Referral program</h3>
            <img src="img/ab6.svg" alt="" className={styles.svgImg} />
            <p>
              The <span className={styles.blue}>ENERGY GALAXY</span> affiliate program will allow
              you to receive <span className={styles.green}>8%</span> in Gemstones and{" "}
              <span className={styles.green}>3%</span> in{" "}
              <span className={styles.yellow}>Essences</span> from the deposit amount of each
              invited participant!
            </p>
            <p>
              By playing <span className={styles.blue}>Energy Galaxy</span>, you earn long-term
              passive income in the secure <span className={styles.yellow}>BNB</span>{" "}
              cryptocurrency! Your prospects and opportunities in this game are simply huge!
            </p>
            <img src="img/ab4.svg" alt="energy-galaxy.com" className={styles.svgImg} />
          </div>
        </div>
      </div>
    </div>
  );
}
