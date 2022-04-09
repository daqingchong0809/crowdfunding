import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import styles from "./styles.module.scss";
import Header from "./Header";
import Container from "./container/index";
import { connectors } from "constants/connectors";
export default function Home() {
  const { activate } = useWeb3React();
  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);
  return (
    <div className={styles["home"]}>
      <Header></Header>
      <Container></Container>
    </div>
  );
}
