import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/ErrorNotice";
import "components/pages/login/login.css";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault(); //stops the page from reloading upon form submission
    try {
      const loginUser = { email, password };
      const loginRes = await Axios.post("users/login", loginUser);
      setUserData({ token: loginRes.data.token, user: loginRes.data.user });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/my-demos");
    } catch (e) {
      e.response.data.msg && setErrorMsg(e.response.data.msg);
    }
  };

  return (
    <div className="formContainer">
      <h2 className="formHeader">Login</h2>
      <form id="form" onSubmit={submit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input id="loginBtn" type="submit" value="Login" />
        </div>
      </form>
      {errorMsg && (
        <ErrorNotice
          message={errorMsg}
          clearError={() => setErrorMsg(undefined)}
        />
      )}
    </div>
  );
}
