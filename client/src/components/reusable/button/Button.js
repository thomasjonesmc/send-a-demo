import React from "react";
import "components/reusable/button/button.css";
import { useHistory } from "react-router-dom";

export const Button = ({ path, ...props }) => {

  const history = useHistory();

  return <button type="button" className="btnComp" onClick={path ? () => history.push(path) : null} {...props}></button>;
};

export const RedButton = ({ ...props }) => {
  return <Button className="redBtn" {...props} />;
};

export const GreenButton = ({ ...props }) => {
  return <Button className="greenBtn" {...props} />;
};

export const IconButton = ({ component: Component, ...props}) => {
  return (
    <button type="button" className="iconButton" {...props}>
      <Component />
    </button>
  )
}