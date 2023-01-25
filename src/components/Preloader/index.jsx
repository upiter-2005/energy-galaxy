import React from "react";
import { useEffect, useState } from "react";
import styles from "./Preloader.module.scss";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setFadeOut(true);
    }, 6500);
    setTimeout(() => {
      setIsLoading(false);
    }, 8000);
    console.log("Preloader");
  }, []);

  if (isLoading) {
    return (
      <div className={`${styles.videoBox} ${fadeOut ? "fadeOut" : ""}`}>
        <video
          className={`${styles.preloader} ${styles.preloaderDesktop}`}
          autoPlay={true}
          loop={true}
          controls={false}
          playsInline
          muted
          src="/video/preloader.mov"
          type="video/mov"></video>
        <video
          className={`${styles.preloader} ${styles.preloaderMobile}`}
          autoPlay={true}
          loop={true}
          controls={false}
          playsInline
          muted
          src="/video/preloaderMob.mov"
          type="video/mov"></video>
      </div>
    );
  }
}
