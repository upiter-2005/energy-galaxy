import React from "react";
import { useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInfoOverlay, setStatusOverlay } from "../../redux/slices/accountSlice";

import styles from "./ModalFrame.module.scss";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";

export default function ModalFrame({ closeModal, type, txId }) {
  const dispatch = useDispatch();
  const modalRef = useRef();

  useEffect(() => {
    dispatch(setInfoOverlay(true));
    dispatch(setStatusOverlay(true));
    document.body.addEventListener("click", handleOutSideClick);
    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unount");
      dispatch(setInfoOverlay(false));
      dispatch(setStatusOverlay(false));
    };
  }, []);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current) {
      closeError();
    }
  };

  const closeSucces = () => {
    closeModal();
  };
  const closeError = () => {
    closeModal();
  };

  return (
    <div className={styles.modalPopup} ref={modalRef}>
      {type === "error" && <Error url={txId} closeError={closeError} />}
      {type === "done" && <Success url={txId} closeSucces={closeSucces} />}
      {type === "loading" && <Loading url={txId} />}
    </div>
  );
}
