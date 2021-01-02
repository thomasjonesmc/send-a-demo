import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/ErrorNotice";
import "components/pages/login/login-register.css";
import UnderlinedTextInput from "components/reusable/inputs/Inputs";
import { Button } from "components/reusable/button/Button";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();

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
      <h2 className="pageTitle">Register</h2>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="email">Email</label>
          <UnderlinedTextInput id="email" type="email" onChange={setEmail} />
        </div>
        <div>
          <label htmlFor="displayName">Display Name</label>
          <UnderlinedTextInput id="displayName" onChange={setDisplayName} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <UnderlinedTextInput
            id="password"
            type="password"
            onChange={setPassword}
          />
        </div>
        <div>
          <label htmlFor="passwordCheck">Verify Password</label>
          <UnderlinedTextInput
            id="passwordCheck"
            type="password"
            onChange={setPasswordCheck}
          />
        </div>
        <div className="btnDiv">
          <Button type="submit">Register 😁</Button>
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
