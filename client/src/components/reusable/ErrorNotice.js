import React from "react";

export default function ErrorNotice(props) {
  return (
    <div className="">
      <div className="flex justify-between border-dashed border-2 border-red-800 text-red-600 p-1 text-center max-w-xs mx-auto py-2 px-4 bg-red-200 bg-opacity-25 rounded">
        <span>{props.message}</span>
        <button onClick={props.clearError}>X</button>
      </div>
    </div>
  );
}
