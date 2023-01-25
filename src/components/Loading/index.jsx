import React from "react";
import styles from "./Loading.module.scss";
export default function Loadng() {
  const urlLoading = `./video/loading.mov`;
  return (
    <div className={styles.loading}>
      <video
        className={styles.loadingVideo}
        autoPlay={true}
        loop={true}
        controls={false}
        playsInline
        muted
        src={urlLoading}
        type="video/mp4"></video>
    </div>
  );
}
