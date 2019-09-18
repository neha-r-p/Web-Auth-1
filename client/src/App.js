import React from "react";
import "./App.scss";
import Register from "./components/Register";

function App() {
  return (
    <div className="App">
      <div className="header">
        <h1>Web Auth</h1>
        <div className="navBar">
          <a href="#">Register</a>
          <a href="#">Users</a>
          <a href="#">Login</a>
          <a href="#">Logout</a>
        </div>
      </div>
      <Register />
    </div>
  );
}

export default App;
