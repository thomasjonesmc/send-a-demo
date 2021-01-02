import Axios from "axios";
import React, { useContext, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/ErrorNotice";
import UnderlinedTextInput from "components/reusable/inputs/Inputs";
import { Button } from "components/reusable/button/Button";

export default function CreateDemo() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const [userId] = useState(userData.user.id);
  const [displayName] = useState(userData.user.displayName);
  const [demoTitle, setDemoTitle] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const newDemo = { userId, displayName, demoTitle };
      const newDemoRes = await Axios.post("demos/new-demo", newDemo);
      history.push(`/demo/path/?demo=${newDemoRes.data._id}`);
    } catch (e) {
      e.response.data.msg && setErrorMsg(e.response.data.msg);
    }
  };

  return (
    <div id="">
      <form className="formContainer" onSubmit={submit}>
        <div className="mb-4">
          <label className="pageTitle" htmlFor="demoTitle">
            new demo title
          </label>
          <UnderlinedTextInput id="demoTitle" onChange={setDemoTitle} />
        </div>
        <div className="btnDiv">
          <Button type="submit">New Demo +</Button>
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
