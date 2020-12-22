import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/ErrorNotice";
import "components/pages/login/login.css";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault(); //stops the page from reloading upon form submission

    try {
      const newUser = { email, password, passwordCheck, displayName };
      await Axios.post("users/register", newUser);
      const loginRes = await Axios.post("users/login", {
        email,
        password,
      });
      setUserData({ token: loginRes.data.token, user: loginRes.data.user });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/");
    } catch (e) {
      e.response.data.msg && setErrorMsg(e.response.data.msg);
    }
  };

  return (
    <div className="formContainer">
      <h2 className="formHeader">Register</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            id="passwordCheck"
            type="password"
            placeholder="Verify Password"
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </div>
        <div>
          <input type="submit" value="Register 😁" />
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
