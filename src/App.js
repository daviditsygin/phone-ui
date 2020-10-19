import React, { useEffect } from "react";
import "./App.css";
import firebase from "./firebase.js";

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { colors } from "baseui/tokens";
import { LightTheme, DarkTheme, BaseProvider, styled } from "baseui";
import { PhoneInput, COUNTRIES } from "baseui/phone-input";
import { Spinner } from "baseui/spinner";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // dev code
  localStorage.setItem("url", process.env.REACT_APP_FUNCTION_DEV);
} else {
  // production code
  localStorage.setItem("url", process.env.REACT_APP_FUNCTION_URL);
}

const engine = new Styletron();
const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});
function Hello({ updateText, keyUp }) {
  const [text, setText] = React.useState("");
  useEffect(() => {
    updateText(text);
  }, [text]);
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <Centered>
          <PhoneInput
            clearable
            country={COUNTRIES.US}
            text={text}
            type={"number"}
            onTextChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.which === 38 || e.which === 40) {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => keyUp(e)}
            overrides={{
              CountrySelect: {
                style: ({ $theme }) => {
                  return {
                    outline: `${$theme.colors.warning600} solid`,
                    backgroundColor: $theme.colors.warning600,
                    display: "none",
                  };
                },
              },
            }}
          />
        </Centered>
      </BaseProvider>
    </StyletronProvider>
  );
}

function App() {
  const [user, setUser] = React.useState(null);
  const [numbers, setNumbers] = React.useState([]);
  const [idx, setIdx] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [confirm, setConfirm] = React.useState(null);
  const [binding, setBinding] = React.useState(false);

  const getNumbers = async (areaCode, contains) => {
    setLoading(true);
    setNumbers([]);
    let res = await fetch(
      localStorage.getItem("url") +
        "/lookUpNumbers" +
        (areaCode ? "?areaCode=" + areaCode : "") +
        (contains ? "&contains=" + contains : ""),
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    let json = await res.json();
    setNumbers(json);
    setLoading(false);
    console.log(numbers);
  };

  const confirmNumber = async () => {
    console.log("confirming", confirm.friendlyName);
    setBinding(true);
    setTimeout(() => {
      setConfirm(null);
      setBinding(false);
    }, 5000);
  };

  useEffect(() => {
    getNumbers();
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
                <h2 className="text-left mb-2">Choose your work number.</h2>
                <Hello
                  updateText={(t) => {
                    console.log("got this from updateText", t);

                    getNumbers(t.substr(0, 3), t.substr(3));
                    setIdx(0);
                  }}
                  keyUp={(e) => {
                    if (e.which === 40) {
                      setIdx(idx > numbers.length - 1 ? 0 : idx + 1);
                    }
                    if (e.which === 38) {
                      setIdx(idx > 0 ? idx - 1 : numbers.length - 1);
                    }
                    if (e.which === 13) {
                      setConfirm(numbers[idx]);
                    }
                  }}
                />
                {loading ? (
                  <div className="w-16 mx-auto pt-4">
                    <Spinner />
                  </div>
                ) : (
                  <></>
                )}

                <Modal
                  onClose={() => setConfirm(null)}
                  closeable={!binding}
                  isOpen={confirm}
                  autoFocus
                  size={SIZE.default}
                  role={ROLE.dialog}
                  style={{ textAlign: "left" }}
                >
                  <ModalHeader>
                    {confirm ? confirm.friendlyName : "..."}
                  </ModalHeader>
                  <ModalBody>
                    Use this as your work number?
                    <p style={{ opacity: 0.5, fontSize: 12, marginTop: 10 }}>
                      You can't change your number once you've confirmed it.
                    </p>
                  </ModalBody>
                  <ModalFooter>
                    {!binding ? (
                      <ModalButton
                        kind={ButtonKind.tertiary}
                        onClick={() => setConfirm(null)}
                      >
                        Cancel
                      </ModalButton>
                    ) : (
                      <></>
                    )}
                    <ModalButton onClick={confirmNumber} isLoading={binding}>
                      Confirm
                    </ModalButton>
                  </ModalFooter>
                </Modal>

                <ul className="text-left">
                  {numbers.map((n, i) => {
                    return (
                      <li
                        className="p-2 pl-16 hover:text-purple-600 transition duration-300"
                        style={{
                          background:
                            i == idx ? colors.gray700 : colors.gray900,
                          color: i == idx ? colors.purple200 : colors.gray200,
                        }}
                        onMouseOver={(e) => setIdx(i)}
                        onClick={(e) => {
                          setConfirm(numbers[i]);
                        }}
                      >
                        <p className="text-sm">{n.friendlyName}</p>
                        <p className="text-xs">
                          {n.locality
                            ? n.locality
                            : n.region + ", " + n.isoCountry}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}

export default App;
