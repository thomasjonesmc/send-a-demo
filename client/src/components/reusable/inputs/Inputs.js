import React from "react";
import "./inputs.css";

export const UnderlinedTextInput = (props) => {
  
  return (
    <div>
      <input
        type="text"
        className="underlinedTextInput"
        {...props}
      />
    </div>
  );
};