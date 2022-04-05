import { toHex } from "utils/formatData";

export const CHAIN_ID = process.env.CHAINID;

declare enum ChainId {
  ETHEREUM = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GÖRLI = 5,
  KOVAN = 42,
  MATIC = 137,
  MATIC_TESTNET = 80001,
  FANTOM = 250,
  FANTOM_TESTNET = 4002,
  XDAI = 100,
  BSC = 56,
  BSC_TESTNET = 97,
  ARBITRUM = 42161,
  ARBITRUM_TESTNET = 79377087078960,
  MOONBEAM_TESTNET = 1287,
  AVALANCHE = 43114,
  AVALANCHE_TESTNET = 43113,
  HECO = 128,
  HECO_TESTNET = 256,
  HARMONY = 1666600000,
  HARMONY_TESTNET = 1666700000,
  OKEX = 66,
  OKEX_TESTNET = 65,
  CELO = 42220,
  PALM = 11297108109,
  PALM_TESTNET = 11297108099,
  MOONRIVER = 1285,
  FUSE = 122,
  TELOS = 40,
  HARDHAT = 31337,
  MOONBEAM = 1284,
}

export const SUPPORTED_NETWORKS: {
  [key: number]: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
} = {
  [ChainId.ETHEREUM]: {
    chainId: "0x1",
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/9d4ae57309184c559c1bbfa84a3de032"],
    blockExplorerUrls: ["https://etherscan.com"],
  },
  [ChainId.RINKEBY]: {
    chainId: "0x4",
    chainName: "Rinkeby",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/9d4ae57309184c559c1bbfa84a3de032"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
  },
  [ChainId.FANTOM]: {
    chainId: "0xfa",
    chainName: "Fantom",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpcapi.fantom.network"],
    blockExplorerUrls: ["https://ftmscan.com"],
  },
  [ChainId.BSC]: {
    chainId: "0x38",
    chainName: "Binance Smart Chain",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
  },
  [ChainId.MATIC]: {
    chainId: "0x89",
    chainName: "Matic",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"], // ['https://matic-mainnet.chainstacklabs.com/'],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  [ChainId.HECO]: {
    chainId: "0x80",
    chainName: "Heco",
    nativeCurrency: {
      name: "Heco Token",
      symbol: "HT",
      decimals: 18,
    },
    rpcUrls: ["https://http-mainnet.hecochain.com"],
    blockExplorerUrls: ["https://hecoinfo.com"],
  },
  [ChainId.XDAI]: {
    chainId: "0x64",
    chainName: "xDai",
    nativeCurrency: {
      name: "xDai Token",
      symbol: "xDai",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.xdaichain.com"],
    blockExplorerUrls: ["https://blockscout.com/poa/xdai"],
  },
  [ChainId.HARMONY]: {
    chainId: "0x63564C40",
    chainName: "Harmony",
    nativeCurrency: {
      name: "One Token",
      symbol: "ONE",
      decimals: 18,
    },
    rpcUrls: [
      "https://api.harmony.one",
      "https://s1.api.harmony.one",
      "https://s2.api.harmony.one",
      "https://s3.api.harmony.one",
    ],
    blockExplorerUrls: ["https://explorer.harmony.one/"],
  },
  [ChainId.AVALANCHE]: {
    chainId: "0xA86A",
    chainName: "Avalanche Mainnet C-Chain",
    nativeCurrency: {
      name: "Avalanche Token",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"],
  },
  [ChainId.OKEX]: {
    chainId: "0x42",
    chainName: "OKEx",
    nativeCurrency: {
      name: "OKEx Token",
      symbol: "OKT",
      decimals: 18,
    },
    rpcUrls: ["https://exchainrpc.okex.org"],
    blockExplorerUrls: ["https://www.oklink.com/okexchain"],
  },
  [ChainId.ARBITRUM]: {
    chainId: "0xA4B1",
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
  },
  [ChainId.CELO]: {
    chainId: "0xA4EC",
    chainName: "Celo",
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
    rpcUrls: ["https://forno.celo.org"],
    blockExplorerUrls: ["https://explorer.celo.org"],
  },
  [ChainId.MOONRIVER]: {
    chainId: "0x505",
    chainName: "Moonriver",
    nativeCurrency: {
      name: "Moonriver",
      symbol: "MOVR",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.moonriver.moonbeam.network"],
    blockExplorerUrls: ["https://moonriver.moonscan.io"],
  },
  [ChainId.FUSE]: {
    chainId: "0x7A",
    chainName: "Fuse",
    nativeCurrency: {
      name: "Fuse",
      symbol: "FUSE",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.fuse.io"],
    blockExplorerUrls: ["https://explorer.fuse.io"],
  },
  [ChainId.TELOS]: {
    chainId: "0x28",
    chainName: "Telos",
    nativeCurrency: {
      name: "Telos",
      symbol: "TLOS",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.telos.net/evm"],
    blockExplorerUrls: ["https://rpc1.us.telos.net/v2/explore"],
  },
  [ChainId.PALM]: {
    chainId: "0x2A15C308D",
    chainName: "Palm",
    nativeCurrency: {
      name: "Palm",
      symbol: "PALM",
      decimals: 18,
    },
    rpcUrls: ["https://palm-mainnet.infura.io/v3/da5fbfafcca14b109e2665290681e267"],
    blockExplorerUrls: ["https://explorer.palm.io"],
  },
  [ChainId.MOONBEAM]: {
    chainId: "0x504",
    chainName: "Moonbeam",
    nativeCurrency: {
      name: "Glimmer",
      symbol: "GLMR",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    blockExplorerUrls: ["https://moonbeam.moonscan.io"],
  },
};

export const switchNetwork = async (chainId: number, library: any) => {
  try {
    await library.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: toHex(chainId) }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await library.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...SUPPORTED_NETWORKS[chainId],
            },
          ],
        });
      } catch (error) {
        // setError(error);
      }
    }
  }
};
