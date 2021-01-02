import React from "react";
import "./inputs.css";

export const UnderlinedTextInput = ({ onChange, ...props }) => {
  let handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        className="underlinedTextInput"
        onChange={handleChange}
        {...props}
      />
    </div>
  );
};

export default UnderlinedTextInput;
