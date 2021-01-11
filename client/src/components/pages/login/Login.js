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
  const [error, setError] = useState(null)

  const { user, setUser } = useContext(UserContext);
  const history = useHistory();

  console.log(user);

  const submit = async () => {

    if (email === "" || password === "") {
      return setError("Email and Password are required");
    }

    try {
      const loginUser = { email, password };
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

      <FormInput name="email" type="email" label="Email" onChange={setEmail} autoFocus />
      <FormInput name="password" type="password" label="Password" onChange={setPassword} />

      <div className="center">
        <Button type="submit">Login</Button>
      </div>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  );
}
