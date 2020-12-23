import React from "react";
import { useHistory } from "react-router-dom";
import "components/reusable/button/button.css";

export default function Button(props) {
  const history = useHistory();
  const link = () => history.push(props.path);

  return (
    <button type="button" className="btnComp" value={props.name} onClick={link}>
      {props.name}
    </button>
  );
}
