import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/error/Error";
import { Button } from "components/reusable/button/Button";
import { Form, FormInput } from "components/reusable/form/Form";

export default function Login() {

  // loginIdentifier is the user's email or username
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)

  const { setUser } = useContext(UserContext);
  const history = useHistory();

  const submit = async () => {

    if (loginIdentifier === "" || password === "") {
      return setError("All Fields Required");
    }

    try {
      const loginUser = { loginIdentifier, password };
      const { data: loginRes } = await Axios.post("/users/login", loginUser);
      setUser(loginRes.user);
      localStorage.setItem("auth-token", loginRes.token);
      history.push("/my-demos");
    } catch (err) {
      err.response.data.error && setError(err.response.data.error);
    }
  };

  return (
    <Form title="Login" onSubmit={submit}>

      <FormInput name="loginIdentifier" label="Email or Username" onChange={setLoginIdentifier} autoFocus />
      <FormInput name="password" type="password" label="Password" onChange={setPassword} />

      <div className="center">
        <Button type="submit">Login</Button>
      </div>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  );
}
