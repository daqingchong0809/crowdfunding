import { StaticJsonRpcProvider } from "@ethersproject/providers";

export const simpleRpcProvider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_RPCURL);

export default null;
