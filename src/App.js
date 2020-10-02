import React from 'react';
import './App.css';

function App() {

  const [user, setUser] = React.useState(null)


  return (
    <div className="App bg-gray-800">
      <div className="flex h-full ">
        {user ? <div className="w-1/4 bg-gray-900 text-white">
          Sidebar
        </div> : <></>}
        <div className="w-full bg-gray-700 text-white">
          Router goes here
        </div>
      </div>
    </div>
  );
}

export default App;
