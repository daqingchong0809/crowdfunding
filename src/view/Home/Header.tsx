import React from "react";
import styles from "./styles.module.scss";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { connectors } from "constants/connectors";
import { NETWORK_ICON } from "constants/networkIcon";

import { Button, message } from "antd";
import { getSubStr } from "utils/formatData";
export default function Header() {
  const { account, activate, error, active, chainId, deactivate } = useWeb3React();

  const setProvider = () => {
    window.localStorage.setItem("provider", "injected");
  };
  const handleConnect = () => {
    if (error instanceof UnsupportedChainIdError) {
      message.warning("UnsupportedChainId");
    }

    activate(connectors.injected);

    setProvider();
  };
  const handleDisconnect = () => {
    deactivate();
  };
  return (
    <div className={styles["header"]}>
      <div className={styles["header-left"]}>
        <div className={styles["header-left-logo"]}></div>
      </div>
      <div className={styles["header-right"]}>
        {!active && (
          <div>
            <Button onClick={handleConnect}>
              <div className={styles["header-radius"]}></div> Connect
            </Button>
          </div>
        )}
        {account && (
          <div className={styles["header-right-account"]}>
            <div className={styles["header-right-chain"]}>
              {chainId && (
                <img
                  src={NETWORK_ICON[chainId]}
                  alt="Network"
                  width="25px"
                  height="25px"
                  style={{ borderRadius: "50px", marginRight: "20px" }}
                />
              )}
            </div>
            {account ? getSubStr(account) : ""}

            <div className={styles["header-right-disconnect"]} onClick={handleDisconnect}>
              Disconnect
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
