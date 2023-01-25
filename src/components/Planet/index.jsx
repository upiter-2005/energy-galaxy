import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLevePrices, updateGem } from "../../redux/slices/accountSlice";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { ethers } from "ethers";
import styles from "./Planet.module.scss";
import ModalPlanet from "../ModalPlanet";
import { abi, contractAddress, NETWORK_ID } from "../../ContractData/contract";
import { getLevel } from "../../utils/countAward";
import Loading from "../../components/Loading";
import Success from "../../components/Success";
import Error from "../../components/Error";
import ModalFrame from "../../components/ModalFrame";
import { setStatusOverlay } from "../../redux/slices/accountSlice";

export default function Planet({ id, index, name, cost, ess, color, position, positionOwn }) {
  const dispatch = useDispatch();

  const [owner, setOwner] = useState(null);
  const [level, setLevel] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");
  const [essFromContract, setEssFromContract] = useState("0");
  const initialLeaveAction = useSelector((state) => state.account.initialLeaveAction);
  const levelPrices = useSelector((state) => state.account.levelPrices);
  const gems = useSelector((state) => state.account.gems);
  const essCurrent = useSelector((state) => state.account.essentials);
  const wallet = useSelector((state) => state.account.wallet);

  let contract = null;
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(0);
    contract = new ethers.Contract(contractAddress, abi, signer);
  } catch (error) {
    console.log("Install metamask!!!!!");
  }

  function openModal() {
    setVisibleModal(true);

    if (id === 1 && window.innerWidth < 768) {
      window.scrollBy(0, 540);
    }
  }
  const closeModal = () => {
    setVisibleModal(false);
    setIsLoading("off");
  };
  const closeSucces = () => {
    setIsLoading("off");
    closeModal();
  };
  const closeError = () => {
    setIsLoading("off");
    closeModal();
  };
  const urlMov = `./video/${name}.mov`;
  const urlOwnMov = `./video/ownPlanets/${name}.mov`;
  const numberClass = `planetBox_${id}`;
  const biUrl = `/img/buy/bi${index}.png`;
  const biUrlLevel = `/img/up${index}.png`;

  const detectIsOwn = async () => {
    const ownable = await contract.getMyPlanets(index);
    const levelValue = await getLevel(index);
    setLevel(levelValue);

    //detectLevel();
    setOwner(ownable);
  };

  const getOwnFromStorage = async () => {
    console.log("from storage");
    const possesionsArr = JSON.parse(localStorage.getItem(`possesions${wallet}`));
    const ownable = possesionsArr[index];
    const levelValue = await getLevel(index);
    setLevel(levelValue);
    setOwner(ownable);
    if (ownable) {
      console.log(ownable);
      const dataEss = await contract.getEssentialsAwards();
      console.log(dataEss);
      const essValue = +ethers.utils.formatEther(dataEss[index]) * 1e18;
      console.log(essValue);
      setEssFromContract(essValue);
    }
  };

  const levelUpPlanet = async () => {
    if (level === 10) {
      alert("Max planet level has reached!");
      return false;
    }
    //const lvPrice = 2;
    const lvPrice = parseInt(levelPrices[index]); //for deploy
    if (lvPrice > gems) {
      alert("not enought gems!");
      return false;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");

    try {
      const txId = await contract.levelUp(index, {
        gasPrice: gasPrice * 1.1,
        gasLimit: 210000,
      });
      setTxId(txId.hash);
      setIsLoading("loading");
      dispatch(setStatusOverlay(true));
      const receipt = await txId.wait().then(() => {
        dispatch(updateGem());
        dispatch(getLevePrices());
        //detectLevel();
        setIsLoading("done");
        //setLevel((state) => state + 1);
        setTimeout(() => window.location.reload(false), 1000);
      });
    } catch (error) {
      console.log(error);
      setIsLoading("error");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      if (localStorage.getItem(`possesions${wallet}`)) {
        getOwnFromStorage();
      } else {
        detectIsOwn();
      }
      dispatch(getLevePrices());
    }
  }, [wallet]);

  if (owner === true) {
    return (
      <>
        <LazyLoadComponent>
          <div
            className={`${styles.planetBox} ${numberClass} ${owner ? "ownable" : ""}`}
            style={{ marginTop: `${positionOwn.top}`, marginLeft: `${positionOwn.left}` }}>
            {/* {isLoading === "loading" && (
              <div className={styles.loading_absolute}>
                <Loading />
              </div>
            )} */}

            <video
              className={styles.ownableVideo}
              autoPlay={true}
              loop={true}
              controls={false}
              playsInline
              muted
              src={urlOwnMov}
              type="video/mov"></video>
            <div className={styles.boughtInfo}>
              <span className={styles.levelValue}>{level}</span>
              <img src={biUrl} alt="" />

              <div className={styles.essEarn} onClick={levelUpPlanet}>
                {/* {level > 1
                  ? `+${ess} * ${level} - ${100 - (parseInt(levelPrices[index]) / cost) * 100}%`
                  : `+${ess}`} */}
                {/* +{(ess * level * (parseInt(levelPrices[index]) / cost)).toFixed(0)}  */}
                {/* {parseInt(levelPrices[index])} */}
                {essFromContract}
                {/* {(ess * level).toFixed(0)} */}
              </div>
              <img src={biUrlLevel} alt="" className={styles.levelUp} onClick={levelUpPlanet} />
              <p className={styles.levelPrice} onClick={levelUpPlanet}>
                {level === 10 ? "Max" : `${parseInt(levelPrices[index])}`}
              </p>
            </div>
          </div>

          {isLoading === "error" && (
            <ModalFrame
              closeError={closeError}
              url={txId.hash}
              type="error"
              closeModal={closeModal}
            />
          )}
          {isLoading === "done" && (
            <ModalFrame
              closeSucces={closeSucces}
              url={txId.hash}
              type="done"
              closeModal={closeModal}
            />
          )}
          {isLoading === "loading" && (
            <ModalFrame
              closeSucces={closeSucces}
              url={txId}
              type="loading"
              closeModal={closeModal}
            />
          )}
        </LazyLoadComponent>
      </>
    );
  }

  if (wallet === "" || owner === false) {
    return (
      <>
        <LazyLoadComponent>
          <div
            className={`${styles.planetBox} ${numberClass} `}
            style={{ top: `${position.top}`, marginLeft: `${position.left}` }}
            onClick={openModal}>
            <video
              autoPlay={true}
              loop={true}
              controls={false}
              playsInline
              muted
              src={urlMov}
              type="video/mov"></video>
            <div
              className={styles.planetBox_info}
              style={{ backgroundImage: `url(/img/p${id}.png)`, color: `${color}` }}>
              <div className={styles.planetBox_infoText}></div>
            </div>
          </div>

          {visibleModal && (
            <ModalPlanet
              closeModal={closeModal}
              planetId={index}
              cost={cost}
              detectIsOwn={detectIsOwn}
            />
          )}
        </LazyLoadComponent>
      </>
    );
  }
}
