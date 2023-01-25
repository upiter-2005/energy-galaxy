import { persents } from "../redux/slices/accountSlice";
import { ethers } from "ethers";
import { abi, contractAddress } from "../ContractData/contract";

let contract = null;
try {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(0);
  contract = new ethers.Contract(contractAddress, abi, signer);
} catch (error) {
  console.log("Install metamask!!!!!");
}

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner(0);
// const contract = new ethers.Contract(contractAddress, abi, signer);

export const countAwardSixDays = async () => {
  let result = 0;
  for (let i = 0; i < persents.length; i++) {
    const ownable = await contract.getMyPlanets(i);
    if (ownable) {
      result = result + persents[i];
    }
  }
  return result * 6;
};

export const getLevel = async (index) => {
  let level = await contract.getPlanetLevel(index);
  level = ethers.utils.formatEther(level) * 1e18;
  level = +level;
  return level;
};

export const countPerDay = async () => {
  let result = 0;
  for (let i = 0; i < persents.length; i++) {
    const ownable = await contract.getMyPlanets(i);
    if (ownable) {
      let lvl = await getLevel(i);
      result += lvl * persents[i];
    }
  }
  return result;
};
