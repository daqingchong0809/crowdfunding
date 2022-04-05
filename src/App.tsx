import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import getLibrary from "utils/getLibrary";
import "./App.scss";
import { Auth } from "./routes/auth";
import { routerConfig } from "./routes/RouterConfig";

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Router>
        <Switch>
          <Auth config={routerConfig} />
        </Switch>
      </Router>
    </Web3ReactProvider>
  );
}

export default App;
