import { useMemo } from "react";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";

import { getCrowdFundingContract } from "./callContract";
// import { getSomeContract } from "./callContract";

/**
 * example
 * */

// export const useContract = () => {
//   const { library } = useActiveWeb3React();
//   return useMemo(() => getSomeContract(library ? library.getSigner() : undefined), [library]);
// };

export const useCrowdFundingContract = () => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getCrowdFundingContract(library ? library.getSigner() : undefined), [library]);
};
