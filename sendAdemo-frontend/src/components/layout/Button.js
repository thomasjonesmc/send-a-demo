import React from "react";
import { useHistory } from "react-router-dom";

export default function Button(props) {
  const history = useHistory();
  const link = () => history.push(props.path);

  return (
    <button
      className="mx-auto bg-white border-solid border-2 border-black hover:bg-gray-200 text-black  py-2 px-4 rounded"
      type="button"
      value={props.name}
      onClick={link}
    >
      {props.name}
    </button>
  );
}
