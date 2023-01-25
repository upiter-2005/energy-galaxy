import React from "react";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInfoOverlay } from "../../redux/slices/accountSlice";
import styles from "./ModalInstall.module.scss";

export default function ModalInstall({ closeInstall }) {
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
      closeInstall();
    }
  };

  return (
    <div className={styles.modalPopup} ref={modalRef}>
      <div className={styles.modalPopup_window}>
        <img className={styles.close} src="/img/close.png" alt="close" ref={modalRefClose} />

        <a href="https://metamask.io/download/" target="blank">
          <img src="img/metamaskDownload.webp" alt="" />
        </a>
      </div>
    </div>
  );
}
