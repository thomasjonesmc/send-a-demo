import React from "react";

export default function ErrorNotice({clearError, children, ...props}) {
  return (
    <div {...props}>
        <span>{children}</span>
        <button onClick={props.clearError}>X</button>
    </div>
  );
}
