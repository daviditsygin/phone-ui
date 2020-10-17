import React, { useEffect } from "react";
import "./App.css";
import firebase from "./firebase.js";

import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { colors } from "baseui/tokens";
import { LightTheme, DarkTheme, BaseProvider, styled } from "baseui";
import { PhoneInput, COUNTRIES, SIZE } from "baseui/phone-input";
import { StatefulInput } from "baseui/input";
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
            size={SIZE.compact}
            text={text}
            type={"number"}
            onTextChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.which === 38 || e.which === 40) {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => keyUp(e)}
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

  const getNumbers = async (areaCode, contains) => {
    let res = await fetch(
      process.env.REACT_APP_FUNCTION_URL +
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
    console.log(numbers);
  };

  useEffect(() => {
    getNumbers();
    const itemsRef = firebase.database().ref("items");
    console.log("itemsref", itemsRef);
  }, []);

  return (
    <div className="App bg-gray-800">
      <div className="flex h-full ">
        <div
          className="w-1/4 text-white p-8"
          style={{
            background: colors.gray600,
          }}
        >
          Sidebar
        </div>
        {user ? <></> : <></>}
        <div
          className="w-full bg-gray-800 text-white p-8"
          style={{
            background: colors.gray800,
          }}
        >
          <h2 className="text-left mb-2">Choose your work phone number.</h2>
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
            }}
          />
          <ul className="text-left">
            {numbers.map((n, i) => {
              return (
                <li
                  className="p-2 pl-16 hover:text-purple-600 transition duration-300"
                  style={{
                    background: i == idx ? colors.gray700 : colors.gray900,
                    color: i == idx ? colors.purple200 : colors.gray200,
                  }}
                  onMouseOver={(e) => setIdx(i)}
                >
                  <p className="text-sm">{n.friendlyName}</p>
                  <p className="text-xs">
                    {n.locality ? n.locality : n.region + ", " + n.isoCountry}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
