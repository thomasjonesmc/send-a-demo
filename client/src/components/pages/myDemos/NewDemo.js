import Axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import ErrorNotice from "components/reusable/ErrorNotice";

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
          <input
            id="demoTitle"
            type="text"
            onChange={(e) => setDemoTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="btnDiv">
          <button type="submit">New Demo +</button>
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
