import React from "react";
import { FaExclamationCircle, FaTimes } from "react-icons/fa";
import './error.css';

export default function ErrorNotice({clearError, children, ...props}) {
  return (
    <div className="errorNotice" {...props}>
      <div>
        <FaExclamationCircle className="errorNoticeExclamation"/>
        <span>{children}</span>
      </div>
      <button className="errorNoticeButton" type="button" onClick={clearError}>
        <FaTimes />
      </button>
    </div>
  );
}
