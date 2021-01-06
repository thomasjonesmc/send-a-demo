import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/error/Error";
import { Button } from "components/reusable/button/Button";
import { Form, FormInput } from "components/reusable/form/Form";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {

    if (!email || !password || !passwordCheck || !displayName) {
      return setError("All Fields Required");
    }

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
      e.response.data.msg && setError(e.response.data.msg);
    }
  };

  return (
   
    <Form title="Register" onSubmit={submit}>

      <FormInput name="email" type="email" label="Email" onChange={setEmail} autoFocus />
      <FormInput name="displayName" label="Display Name" onChange={setDisplayName} />
      <FormInput name="password" type="password" label="Password" onChange={setPassword} />

      <FormInput name="passwordCheck" type="password" label="Verify Password" onChange={setPasswordCheck} />

      <div className="center">
        <Button type="submit">Register 😁</Button>
      </div>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  );
}
