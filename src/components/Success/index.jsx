import React from "react";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInfoOverlay } from "../../redux/slices/accountSlice";
import styles from "./Success.module.scss";

export default function Success({ url, closeSucces }) {
  const modalRef = useRef();
  const succesClose = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setInfoOverlay(false));
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
    if (path[0] === modalRef.current || path[0] === succesClose.current) {
      closeSucces();
    }
  };

  return (
    <div className={styles.loading} ref={modalRef}>
      <img className={styles.close} src="/img/close.png" alt="close" ref={succesClose} />
      <img src="/img/done.png" alt="" />
      <a href={`https://testnet.bscscan.com/tx/${url}`} target="_blank" rel="noreferrer">
        <img src="/img/bsc.png" alt="" className={styles.bscLink} />
      </a>
    </div>
  );
}
