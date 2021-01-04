import React from "react";
import "./dropdown.css";

export default function Dropdown({ ...props }) {
  return (
    <div className="dropdownParent">
      <div className="dropdownDiv" {...props}></div>
    </div>
  );
}
