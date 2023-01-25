import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { abi, contractAddress } from "../../ContractData/contract";
const initialState = {
  wallet: "",
  isAuth: false,
  bnbBalance: 0.0,
  gems: 0,
  essentials: 0, // ess adding in real time
  claimedEssentials: 0, // ess claimed
  totalPlanets: 0,
  contractBalance: 0,
  myInvestemnts: 0,
  totalGalaxy: 0,
  myWithdrawals: 0,
  essentialsEarned: 0,
  initialLeaveAction: false,
  persentStart: 0,
  levelPrices: [],
  refGems: 0,
  refEss: 0,
  refs: 0,
  overlay: false,
  overlayInfo: false,
  overlayStatus: false,
  perDay: 0,
  perDayEsses: 0,
  willClaimed: 0,
};

export const persents = [105, 225, 630, 1200, 3125, 6750, 18750];
const perDay = 86400; // equel 1 day in seconds

let contract = null;
try {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(0);
  contract = new ethers.Contract(contractAddress, abi, signer);
} catch (error) {
  console.log("Install metamask!!!!!");
}

export const getPerDayEss = createAsyncThunk("user/getPerDayEss", async () => {
  if (!contract) {
    return 0;
  }
  let result = await contract.getEssPerDay();
  result = +ethers.utils.formatEther(result) * 1e18;
  return result;
});

export const getWillClaimedEss = createAsyncThunk("user/getWillClaimedEss", async () => {
  if (!contract) {
    return 0;
  }
  let result = await contract.getWillClaimedEssPerDay();
  result = +ethers.utils.formatEther(result) * 1e18;
  return result;
});

export const getLevePrices = createAsyncThunk("user/getLevePrices", async () => {
  if (!contract) {
    return 0;
  }
  const levelPrices = await contract.getPlanetsPriceUpLevel();
  let arrPrice = [];
  for (let i = 0; i < levelPrices.length; i++) {
    arrPrice.push(+ethers.utils.formatEther(levelPrices[i]) * 1e18);
  }

  return arrPrice;
});

export const updateGem = createAsyncThunk("user/updateGem", async () => {
  if (!contract) {
    return 0;
  }
  const gems = await contract.getGemstonesBalance();

  // let balance = ethers.BigNumber.from(gems);
  let balance = ethers.utils.formatEther(gems) * 1e18;
  balance = (+balance).toFixed(0);
  return balance;
});

export const getPersent = createAsyncThunk("user/getPersent", async () => {
  if (!contract) {
    return 0;
  }
  const startSeconds = await contract.getStart();
  let start = ethers.utils.formatEther(startSeconds) * 1e18;
  if (start !== 0) {
    start = Math.floor(Date.now() / 1000) - start;
    let persentStatus = start / (perDay / 100);
    persentStatus = persentStatus.toFixed(0);
    if (persentStatus > 100) return 100;
    return persentStatus;
  }
  return 0;
});

export const updateEss = createAsyncThunk("user/updateEss", async () => {
  if (!contract) {
    return 0;
  }
  const ess = await contract.getEssentialsBalance();

  // let balance = ethers.BigNumber.from(gems);
  let balance = ethers.utils.formatEther(ess) * 1e18;
  //balance = (+balance).toFixed(1);
  return balance;
});

export const getCurrencyEss = createAsyncThunk("user/getCurrencyEss", async () => {
  if (!contract) {
    return 0;
  }
  const essData = await contract.getEss(); // All user's data in Struct
  const now = Math.floor(Date.now() / 1000);

  let final = 0;
  const startSeconds = await contract.getStart();
  let start = ethers.utils.formatEther(startSeconds) * 1e18;

  if (start !== 0) {
    final = start += perDay;
  }

  let essSum = 0;
  if (final > now) {
    for (let i = 0; i < 7; i++) {
      const planetTime = +ethers.utils.formatUnits(essData[5][i][0]) * 1e18;
      if (planetTime !== 0) {
        const time = (now - planetTime) / perDay;
        const price = +ethers.utils.formatUnits(essData[4][i]) * 1e18;
        const level = +ethers.utils.formatUnits(essData[5][i][1]) * 1e18;
        const claimMinusPersent = (+ethers.utils.formatUnits(essData[5][i][2]) * 1e18) / 100;

        essSum += parseInt(time * price * level);
      }
    }
  } else {
    for (let i = 0; i < 7; i++) {
      const planetTime = +ethers.utils.formatUnits(essData[5][i][0]) * 1e18;
      if (planetTime !== 0) {
        const time = (final - planetTime) / perDay;
        const price = +ethers.utils.formatUnits(essData[4][i]) * 1e18;
        const level = +ethers.utils.formatUnits(essData[5][i][1]) * 1e18;
        const claimMinusPersent = (+ethers.utils.formatUnits(essData[5][i][2]) * 1e18) / 100;

        essSum += parseInt(time * price * level);
      }
    }
  }

  return essSum;
});

export const getTotalPlanets = createAsyncThunk("user/getTotalPlanets", async () => {
  if (!contract) {
    return 0;
  }
  const totalPlanets = await contract.getTotalPlanets();
  let value = ethers.BigNumber.from(totalPlanets);
  value = ethers.utils.formatEther(value) * 1e18;
  return value;
});
export const getMyInvestemnts = createAsyncThunk("user/getMyInvestemnts", async () => {
  if (!contract) {
    return 0;
  }
  const myInvestemnts = await contract.getMyInvestemnts();
  let value = ethers.BigNumber.from(myInvestemnts);
  value = ethers.utils.formatEther(value);
  value = (+value).toFixed(4);
  return value;
});

export const getTotalGalaxy = createAsyncThunk("user/getTotalGalaxy", async () => {
  if (!contract) {
    return 0;
  }
  const totalGalaxy = await contract.getTotalGalaxy();
  let value = ethers.BigNumber.from(totalGalaxy);
  value = ethers.utils.formatEther(value) * 1e18;
  return value;
});

export const getContractBalance = createAsyncThunk("user/getContractBalance", async () => {
  if (!contract) {
    return 0;
  }
  const contractBalance = await contract.getContractBalance();

  let value = ethers.BigNumber.from(contractBalance);
  value = ethers.utils.formatEther(value);
  value = (+value).toFixed(4);
  return value;
});

export const getMyWithdrawals = createAsyncThunk("user/getMyWithdrawals", async () => {
  if (!contract) {
    return 0;
  }
  const myWithdrawals = await contract.getMyWithdrawals();
  let value = ethers.BigNumber.from(myWithdrawals);
  value = ethers.utils.formatEther(value);
  value = (+value).toFixed(4);
  return value;
});

export const getEssentialsEarned = createAsyncThunk("user/getEssentialsEarned", async () => {
  if (!contract) {
    return 0;
  }
  const totalEss = await contract.getEssentialsEarned();
  let value = ethers.BigNumber.from(totalEss);
  value = ethers.utils.formatEther(value) * 1e18;
  return value;
});
export const getRefGems = createAsyncThunk("user/getRefGems", async () => {
  if (!contract) {
    return 0;
  }
  const totalEss = await contract.getrefGems();
  let value = ethers.BigNumber.from(totalEss);
  value = ethers.utils.formatEther(value) * 1e18;
  return value;
});

export const getRefEss = createAsyncThunk("user/getRefEss", async () => {
  if (!contract) {
    return 0;
  }
  const totalEss = await contract.getrefEss();
  let value = ethers.BigNumber.from(totalEss);
  value = ethers.utils.formatEther(value) * 1e18;
  return value;
});

export const getRefs = createAsyncThunk("user/getRefs", async () => {
  if (!contract) {
    return 0;
  }
  const refs = await contract.getRefs();
  let value = ethers.BigNumber.from(refs);
  value = ethers.utils.formatEther(value) * 1e18;
  return value;
});

// export const checkInit = createAsyncThunk("user/checkInit", async()=>{
//   if (!contract) {
//     return 0;
//   }

// });

export const accountSlice = createSlice({
  name: "account",
  initialState,
  extraReducers: {
    [getWillClaimedEss.pending]: (state) => {
      //state.willClaimed = 0;
    },
    [getWillClaimedEss.fulfilled]: (state, action) => {
      state.willClaimed = action.payload;
    },
    [getWillClaimedEss.rejected]: (state) => {
      state.willClaimed = 0;
    },
    [getRefs.pending]: (state) => {
      //state.myWithdrawals = 0;
    },
    [getRefs.fulfilled]: (state, action) => {
      state.refs = action.payload;
    },
    [getRefs.rejected]: (state) => {
      state.refs = 0;
    },
    [getPerDayEss.pending]: (state) => {
      //state.myWithdrawals = 0;
    },
    [getPerDayEss.fulfilled]: (state, action) => {
      state.perDayEsses = action.payload;
    },
    [getPerDayEss.rejected]: (state) => {
      state.perDayEsses = 0;
    },
    [getMyWithdrawals.pending]: (state) => {
      //state.myWithdrawals = 0;
    },
    [getMyWithdrawals.fulfilled]: (state, action) => {
      state.myWithdrawals = action.payload;
    },
    [getMyWithdrawals.rejected]: (state) => {
      state.myWithdrawals = 0;
    },
    [getRefEss.pending]: (state) => {
      //state.refEss = 0;
    },
    [getRefEss.fulfilled]: (state, action) => {
      state.refEss = action.payload;
    },
    [getRefEss.rejected]: (state) => {
      state.refEss = 0;
    },
    [getRefGems.pending]: (state) => {
      //state.refGems = 0;
    },
    [getRefGems.fulfilled]: (state, action) => {
      state.refGems = action.payload;
    },
    [getRefGems.rejected]: (state) => {
      state.refGems = 0;
    },
    [getLevePrices.pending]: (state) => {
      //state.levelPrices = 0;
    },
    [getLevePrices.fulfilled]: (state, action) => {
      state.levelPrices = action.payload;
    },
    [getLevePrices.rejected]: (state) => {
      state.levelPrices = 0;
    },
    [getPersent.pending]: (state) => {
      //state.persentStart = 0;
    },
    [getPersent.fulfilled]: (state, action) => {
      state.persentStart = action.payload;
    },
    [getPersent.rejected]: (state) => {
      state.persentStart = 0;
    },
    [updateGem.pending]: (state) => {
      //state.gems = 0;
    },
    [updateGem.fulfilled]: (state, action) => {
      state.gems = action.payload;
    },
    [updateGem.rejected]: (state) => {
      state.gems = 0;
    },
    [updateEss.pending]: (state) => {
      //state.claimedEssentials = 0;
    },
    [updateEss.fulfilled]: (state, action) => {
      state.claimedEssentials = action.payload;
    },
    [updateEss.rejected]: (state) => {
      state.claimedEssentials = 0;
    },
    [getCurrencyEss.pending]: (state) => {
      //state.essentials = 0;
    },
    [getCurrencyEss.fulfilled]: (state, action) => {
      state.essentials = action.payload;
    },
    [getCurrencyEss.rejected]: (state) => {
      state.essentials = 0;
    },
    [getTotalPlanets.pending]: (state) => {
      state.totalPlanets = 0;
    },
    [getTotalPlanets.fulfilled]: (state, action) => {
      state.totalPlanets = action.payload;
    },
    [getTotalPlanets.rejected]: (state) => {
      state.totalPlanets = 0;
    },
    [getMyInvestemnts.pending]: (state) => {
      state.myInvestemnts = 0;
    },
    [getMyInvestemnts.fulfilled]: (state, action) => {
      state.myInvestemnts = action.payload;
    },
    [getMyInvestemnts.rejected]: (state) => {
      state.myInvestemnts = 0;
    },
    [getContractBalance.pending]: (state) => {
      state.contractBalance = 0;
    },
    [getContractBalance.fulfilled]: (state, action) => {
      state.contractBalance = action.payload;
    },
    [getContractBalance.rejected]: (state) => {
      state.contractBalance = 0;
    },
    [getTotalGalaxy.pending]: (state) => {
      state.totalGalaxy = 0;
    },
    [getTotalGalaxy.fulfilled]: (state, action) => {
      state.totalGalaxy = action.payload;
    },
    [getTotalGalaxy.rejected]: (state) => {
      state.totalGalaxy = 0;
    },
    [getEssentialsEarned.pending]: (state) => {
      state.essentialsEarned = 0;
    },
    [getEssentialsEarned.fulfilled]: (state, action) => {
      state.essentialsEarned = action.payload;
    },
    [getEssentialsEarned.rejected]: (state) => {
      state.essentialsEarned = 0;
    },
  },
  reducers: {
    setBnbBalance: (state, action) => {
      if (!contract) {
        state.bnbBalance = 0.0;
      } else {
        state.bnbBalance = action.payload;
      }
    },
    updateGemstones: (state, action) => {
      if (!contract) {
        state.gems = 0;
      } else {
        state.gems = action.payload;
      }
    },
    leaveProjectInit: (state) => {
      if (!contract) {
        state.initialLeaveAction = false;
      } else {
        state.initialLeaveAction = true;
      }
    },
    setWallet: (state, action) => {
      if (!contract) {
        state.wallet = null;
      } else {
        state.wallet = action.payload;
      }
    },
    setOverlay: (state, action) => {
      if (!contract) {
        state.overlay = false;
      } else {
        state.overlay = action.payload;
      }
    },
    setInfoOverlay: (state, action) => {
      if (!contract) {
        state.overlayInfo = false;
      } else {
        state.overlayInfo = action.payload;
      }
    },
    setStatusOverlay: (state, action) => {
      if (!contract) {
        state.overlayStatus = false;
      } else {
        state.overlayStatus = action.payload;
      }
    },
    setPerDayVal: (state, action) => {
      if (!contract) {
        state.perDay = false;
      } else {
        state.perDay = action.payload;
      }
    },
  },
});
export const {
  addOrderSell,
  setBnbBalance,
  updateGemstones,
  leaveProjectInit,
  setWallet,
  setOverlay,
  setInfoOverlay,
  setStatusOverlay,
  setPerDayVal,
} = accountSlice.actions;

export default accountSlice.reducer;
