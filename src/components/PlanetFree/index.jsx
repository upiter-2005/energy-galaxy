import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLevePrices, updateGem } from "../../redux/slices/accountSlice";
import { ethers } from "ethers";
import styles from "./Planet.module.scss";
import ModalPlanet from "../ModalPlanet";
import { abi, contractAddress } from "../../ContractData/contract";
import { getLevel } from "../../utils/countAward";
import Loading from "../Loading";
import Success from "../Success";
import Error from "../Error";
import ModalLevelStatus from "../ModalLevelStatus";

export default function Planet({ id, index, name, cost, ess, color, position, positionOwn }) {
  const dispatch = useDispatch();

  const [owner, setOwner] = useState(null);
  const [level, setLevel] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [isLoading, setIsLoading] = useState("off");
  const [txId, setTxId] = useState("");
  const initialLeaveAction = useSelector((state) => state.account.initialLeaveAction);
  const levelPrices = useSelector((state) => state.account.levelPrices);
  const gems = useSelector((state) => state.account.gems);
  const essCurrent = useSelector((state) => state.account.essentials);

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
  }
  const closeModal = () => {
    setVisibleModal(false);
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

    console.log(ownable);
  };

  const levelUpPlanet = async () => {
    //const lvPrice = 11;
    const lvPrice = parseInt(levelPrices[index]);
    if (lvPrice > gems) {
      alert("not enought gems!");
      return false;
    }
    const amountGem = parseInt(essCurrent / 100);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "wei");

    try {
      const txId = await contract.levelUp(index, lvPrice, amountGem, {
        gasPrice: gasPrice * 1.2,
        gasLimit: 1000000,
      });
      setTxId(txId.hash);
      setIsLoading("loading");
      const receipt = await txId.wait().then(() => {
        dispatch(updateGem());
        dispatch(getLevePrices());
        detectLevel();
        setIsLoading("done");
      });
    } catch (error) {
      console.log(error);
      setIsLoading("error");
    }
  };

  // const detectLevel = async () => {
  //   const levelValue = await getLevel(index);
  //   setLevel(levelValue);
  // };

  // useEffect(() => {
  //   if (window.ethereum) {
  //     detectIsOwn();
  //     dispatch(getLevePrices());
  //   }
  // }, [initialLeaveAction]);

  useEffect(() => {
    if (window.ethereum) {
      //  detectLevel();
      detectIsOwn();
      dispatch(getLevePrices());
    }
  }, []);

  if (owner)
    return (
      <>
        <div
          className={`${styles.planetBox} ${numberClass} ${owner ? "ownable" : ""}`}
          style={{ marginTop: `${positionOwn.top}`, marginLeft: `${positionOwn.left}` }}>
          {isLoading === "loading" && (
            <div className={styles.loading_absolute}>
              <Loading />
            </div>
          )}

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
            <img src={biUrlLevel} alt="" className={styles.levelUp} onClick={levelUpPlanet} />
            <div className={styles.essEarn} onClick={levelUpPlanet}>
              +{ess}
            </div>
            <p className={styles.levelPrice}>{parseInt(levelPrices[index])}</p>
          </div>
        </div>
      </>
    );

  if (!owner) {
    return (
      <>
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
      </>
    );
  }
}
