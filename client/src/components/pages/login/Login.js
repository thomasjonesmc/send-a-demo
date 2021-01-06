import Axios from "axios";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/error/Error";
import { Button } from "components/reusable/button/Button";
import { Form, FormInput } from "components/reusable/form/Form";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const submit = async (e) => {

    if (email === "" || password === "") {
      return setError("Email and Password are required");
    }

    try {
      const loginUser = { email, password };
      const loginRes = await Axios.post("/users/login", loginUser);
      setUserData({ token: loginRes.data.token, user: loginRes.data.user });
      localStorage.setItem("auth-token", loginRes.data.token);
      history.push("/my-demos");
    } catch (e) {
      e.response.data.msg && setError(e.response.data.msg);
    }
  };

  return (
    <Form title="Login" onSubmit={submit}>

      <FormInput name="email" type="email" label="Email" onChange={setEmail} autoFocus />
      <FormInput name="password" type="password" label="Password" onChange={setPassword} />

      <div className="center">
        <Button type="submit">Login</Button>
      </div>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  );
}
