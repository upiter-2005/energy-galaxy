export const projectUrl = "http://www.energy-galaxy.com/";
export const NETWORK_ID = "56";
export const adminWallet = "0x03eCac55179fEF71fc430a8252DEf83C0c9C77Cb";
export const adminWalletForRef = "0xE1360Dd5AEBF6977c2Bf720bc3BaD74ad294971E";
// essentialy adminWallet & adminWalletForRef are equal wallets for referal rewards
// main wallet for admin yield should set in contract constructor
export const contractAddress = "0x33e13f6ACbf0C4864fD383A82F5E9AbE95792233";
export const contractAddressOrigin = "0x5aD4FE750100BaF31551118c871188CEbC7180ed";

// export const contractAddress = "0x4E058DA2B9f653398E004C5daa640Eb3f86657EF";
// export const contractAddressOrigin = "0x5aD4FE750100BaF31551118c871188CEbC7180ed";
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_adminWallet",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "ADMIN_WALLET",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "ref",
        type: "address",
      },
    ],
    name: "buyGemstones",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "buyPlanet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkInit",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimEssentials",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "freePlanetsCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEss",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "lastVisit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gemBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "essentialsBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256[7]",
            name: "essentionsByPlanet",
            type: "uint256[7]",
          },
          {
            internalType: "uint256[3][7]",
            name: "planetsOwn",
            type: "uint256[3][7]",
          },
          {
            internalType: "bool",
            name: "init",
            type: "bool",
          },
          {
            internalType: "uint256[7]",
            name: "planetsPriceUpLevel",
            type: "uint256[7]",
          },
          {
            internalType: "uint256",
            name: "refGems",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "refEss",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "refs",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "myInvestment",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "myWithdrawals",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "parentRef",
            type: "address",
          },
          {
            internalType: "bool",
            name: "endAction",
            type: "bool",
          },
        ],
        internalType: "struct EnergyGalaxyPlanets.Planets",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEssPerDay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEssentialsAwards",
    outputs: [
      {
        internalType: "uint256[7]",
        name: "",
        type: "uint256[7]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getEssentialsBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFrePlanets",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getGemstonesBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyInvestemnts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getMyPlanets",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyWithdrawals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getPlanetLevel",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlanetsPriceUpLevel",
    outputs: [
      {
        internalType: "uint256[7]",
        name: "",
        type: "uint256[7]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getRefs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStart",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalGalaxy",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWillClaimedEssPerDay",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getrefEss",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getrefGems",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "levelUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reinvestEss",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalGalaxy",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawAward",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
