import Axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ErrorNotice from "../misc/ErrorNotice";

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
    <div className="container">
      <form className="bg-white rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="demoTitle"
          >
            demo title
          </label>
          <input
            id="demoTitle"
            type="text"
            onChange={(e) => setDemoTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <input
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            value="create demo"
          />
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
