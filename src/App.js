import React, { useEffect } from "react";
import "./App.css";
import firebase from "./firebase.js";

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { colors } from "baseui/tokens";
import { LightTheme, DarkTheme, BaseProvider } from "baseui";
import {
  BrowserRouter as Router,
  Route,
  Link,
} from "react-router-dom";
import Onboarding from "./Onboarding";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // dev code
  localStorage.setItem("url", process.env.REACT_APP_FUNCTION_DEV);
} else {
  // production code
  localStorage.setItem("url", process.env.REACT_APP_FUNCTION_URL);
}

const engine = new Styletron();


function App() {
  const [user, setUser] = React.useState(null);

  useEffect(() => {
    const itemsRef = firebase.database().ref("items");
    console.log("itemsref", itemsRef);
  }, []);

  return (
    <div
      className="App"
      style={{
        background: colors.gray800,
      }}
    >
      <StyletronProvider value={engine}>
        <BaseProvider theme={DarkTheme}>
          <div className="flex h-full  ">
            <div
              className="w-1/4 hidden text-white p-8"
              style={{
                background: colors.gray600,
              }}
            >
              worknumber
            </div>
            {user ? <></> : <></>}
            <div className="w-full text-white ">
              <div
                className="w-full p-4 text-left"
                style={{
                  background: colors.gray700,
                }}
              >
                <p>worknumber</p>
              </div>
              <div className="lg:p-8 p-4 container mx-auto" id="router">
                <Router basename="/app">
                  <Route path="/" exact>
                    <p> Sign in here. </p>
                  </Route>
                  <Route path="/onboarding/:step" exact>
                    <Onboarding />
                  </Route>
                  <Route path="/home/:module" exact>
                    <p>home</p>
                  </Route>
                </Router>
              </div>
            </div>
          </div>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}

export default App;
