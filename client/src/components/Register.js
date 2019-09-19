import React, { useState } from "react";
import axios from "axios";

const Register = props => {
  const [user, setUser] = useState({
    username: "",
    password: ""
  });

  const changeHandler = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = e => {
    e.preventDefault();
    axios
      .post("http://localhost:4545/api/register", user)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        alert("We're sorry. Please try again.");
        setUser({
          username: "",
          password: ""
        });
      });
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Register:</h2>
      <label>
        {" "}
        Username:
        <input
          type="text"
          name="username"
          placeholder="username"
          value={user.username}
          onChange={changeHandler}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          placeholder="password"
          value={user.password}
          onChange={changeHandler}
        />
      </label>
      <button>Register</button>
    </form>
  );
};

export default Register;
