import React from "react";
import styles from "./ModalLevelStatus.module.scss";
export default function ModalLevelStatus({ type, url }) {
  const urlLoading = `./video/loading.mp4`;
  return (
    <div className={styles.loading}>
      {type === "error" && (
        <>
          <img src="/img/error.png" alt="" />
          <a href={`https://testnet.bscscan.com/tx/${url}`} target="_blank" rel="noreferrer">
            <img src="/img/bsc.png" alt="" className={styles.bscLink} />
          </a>
        </>
      )}
      {type === "done" && (
        <>
          <img src="/img/done.png" alt="" />
          <a href={`https://testnet.bscscan.com/tx/${url}`} target="_blank" rel="noreferrer">
            <img src="/img/bsc.png" alt="" className={styles.bscLink} />
          </a>
        </>
      )}

      {type === "loading" && (
        <video
          className={styles.loadingVideo}
          autoPlay={true}
          loop={true}
          controls={false}
          playsInline
          muted
          src={urlLoading}
          type="video/mp4"></video>
      )}
    </div>
  );
}
