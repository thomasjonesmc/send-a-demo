import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/ErrorNotice";
import "components/pages/login/login-register.css";
import { UnderlinedTextInput } from "components/reusable/inputs/Inputs";
import { Button } from "components/reusable/button/Button";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
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
      <h2 className="centerInDiv">Login</h2>
      <form id="form" onSubmit={submit}>
        <div>
          <label htmlFor="email">Email</label>
          <UnderlinedTextInput id="email" type="email" onChange={setEmail} />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <UnderlinedTextInput
            id="password"
            type="password"
            onChange={setPassword}
          />
        </div>
        <div className="btnDiv">
          <Button type="submit">Login</Button>
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
