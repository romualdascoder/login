import React, { useState } from "react";
import axios from "../api/axios";
import "../styles/Login.scss";
import { ImUser } from "react-icons/im";
import { RiLock2Fill } from "react-icons/ri";
import useAuth from "../hooks/useAuth";

function Login() {
  const { auth, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("/login", {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setAuth(response.data.auth);
        setError("");
      })
      .catch((error) => setError(error.response.data.message));
  };

  return (
    <div className="container">
      <div className="formWrapper">
        <form onSubmit={handleLogin}>
          <div className="formHeader">
            <p>Login Form</p>
          </div>
          <div className="inputWrapper">
            {error && <p className="error">{error}</p>}
            <div className="emailWrapper">
              <ImUser className="userIcon" />
              <input
                className="emailInput"
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Email"
                name="email"
              />
            </div>
            <div className="pswWrappe">
              <RiLock2Fill className="lockIcon" />
              <input
                className="pswInput"
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="Password"
                name="psw"
              />
            </div>
            <button
              className="loginBtn"
              type="submit"
              disabled={auth && true}
              style={{ cursor: auth && "not-allowed" }}
            >
              Sign In
            </button>
          </div>
        </form>
        {auth && (
          <div className="successMsg">
            <p>Login Successful!</p>
            <p>Credentials = true</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
