import React, { useEffect } from "react";
import "./App.css";
import firebase from "./firebase.js";
function App() {
  const [user, setUser] = React.useState(null);
  const [numbers, setNumbers] = React.useState([]);

  const getNumbers = async () => {
    let res = await fetch(
      process.env.REACT_APP_FUNCTION_URL + "/numbers/browse/1",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    let json = await res.json();
    setNumbers(json.data);
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
        {user ? (
          <div className="w-1/4 bg-gray-900 text-white">Sidebar</div>
        ) : (
          <></>
        )}
        <div className="w-full bg-gray-700 text-white">Router goes here</div>
      </div>
    </div>
  );
}

export default App;
