import Axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/error/Error";
import { Button } from "components/reusable/button/Button";
import { Form, FormInput } from "components/reusable/form/Form";

export default function CreateDemo() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const [demoTitle, setDemoTitle] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {

    if (demoTitle === "") return setError("Select a Demo Title");

    try {
      const newDemoRes = await Axios.post("/demos/new-demo", {
        creatorId: userData.user.id,
        title: demoTitle
      });
      
      history.push(`/demos/${newDemoRes.data._id}`);
    } catch (e) {
      e.response.data.msg && setError(e.response.data.msg);
    }
  };

  return (
    <Form title="New Demo Title" onSubmit={submit}>
      <FormInput name="demoTitle" onChange={setDemoTitle} autoFocus />
      <div className="center">
        <Button type="submit">Create New Demo</Button>
      </div>
      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  );
}
