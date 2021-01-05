import React from "react";
import "components/reusable/button/button.css";

export const Button = ({ path, ...props }) => {
  return <button type="button" className="btnComp" {...props}></button>;
};

export const RedButton = ({ ...props }) => {
  return <Button className="redBtn" {...props} />;
};

export const GreenButton = ({ ...props }) => {
  return <Button className="greenBtn" {...props} />;
};
