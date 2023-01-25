/* eslint-disable no-undef */
import React from "react";
import { useRef, useEffect, useState } from "react";
import styles from "./ModalPlanet.module.scss";
import { ethers } from "ethers";
import { abi, contractAddress } from "../../ContractData/contract";
import { useDispatch, useSelector } from "react-redux";
import { updateGem, setOverlay } from "../../redux/slices/accountSlice";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";

export default function ModalPlanet({ closeModal, planetId, cost, detectIsOwn }) {
  const dispatch = useDispatch();
  const modalRef = useRef();

  const gems = useSelector((state) => state.account.gems);
  const wallet = useSelector((state) => state.account.wallet);

  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");

  const bgPopup = `../../img/buy/b${planetId}.webp`;
  const buyBut = `../../img/buy/bt${planetId}.png`;

  useEffect(() => {
    dispatch(setOverlay(true));
    document.body.addEventListener("click", handleOutSideClick);

    return () => {
      document.body.removeEventListener("click", handleOutSideClick);
      console.log("unount");
      dispatch(setOverlay(false));
    };
  }, []);

  const handleOutSideClick = (e) => {
    const path = e.path || (e.composedPath && e.composedPath());
    console.log(path);
    if (path[0] === modalRef.current) {
      closeModal();
    }
  };

  const buyPlanet = async () => {
    if (gems < cost) {
      alert("Not enought GEMS!");
      return false;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");
    let customGasLimit = 600000;
    let checkInit = await contract.checkInit();
    if (checkInit) {
      customGasLimit = 210000;
    }

    try {
      const txId = await contract.buyPlanet(planetId, {
        gasPrice: gasPrice * 1.1,
        gasLimit: customGasLimit,
      });
      console.log(txId);
      setTxId(txId.hash);
      setIsLoading("loading");
      const receipt = await txId.wait().then(() => {
        dispatch(updateGem());
        detectIsOwn();
        if (localStorage.getItem(`possesions${wallet}`)) {
          const possesionsArr = JSON.parse(localStorage.getItem(`possesions${wallet}`));
          possesionsArr[planetId] = true;
          localStorage.setItem(`possesions${wallet}`, JSON.stringify(possesionsArr));
        } else {
          const possesionsArr = [];
          for (let i = 0; i < 7; i++) {
            possesionsArr[i] = false;
          }
          possesionsArr[planetId] = true;
          localStorage.setItem(`possesions${wallet}`, JSON.stringify(possesionsArr));
        }

        setIsLoading("done");
        setTimeout(() => window.location.reload(), 700);
      });
      console.log(receipt);
    } catch (error) {
      setIsLoading("error");
      console.log(error);
    }
  };
  const closeSucces = () => {
    setIsLoading("off");
    closeModal();
  };
  const closeError = () => {
    setIsLoading("off");
    closeModal();
  };
  return (
    <div className={styles.modalPopup} ref={modalRef}>
      {isLoading === "error" && <Error url={txId} closeError={closeError} />}
      {isLoading === "done" && <Success url={txId} closeSucces={closeSucces} />}
      {isLoading === "loading" && <Loading url={txId} />}
      {isLoading === "off" && (
        <div className={styles.modalPopup_window} style={{ backgroundImage: `url(${bgPopup})` }}>
          <img className={styles.close} src="/img/close.png" alt="close" onClick={closeModal} />
          <button className={styles.buy} onClick={buyPlanet}>
            <img src={buyBut} alt="" />
          </button>
        </div>
      )}
    </div>
  );
}
