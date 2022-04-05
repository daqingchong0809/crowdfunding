import { Contract } from "@ethersproject/contracts";
import type { Signer } from "@ethersproject/abstract-signer";
import type { Provider } from "@ethersproject/providers";

import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import { useMemo } from "react";
import { simpleRpcProvider } from "./provider";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new Contract(address, abi, signerOrProvider);
};

export function useContract<T extends Contract = Contract>(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true,
): T | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(address, ABI, withSignerIfPossible ? getProviderOrSigner(library, account || "") : undefined);
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]) as T;
}
