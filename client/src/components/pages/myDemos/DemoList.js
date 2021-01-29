import React from "react";
import { DemoItem } from "./DemoItem";
import './myDemos.css';

const DemoList = ({demos, setDemos}) => {

  if (!demos || demos.length === 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>You don't have any demos yet!</h1>
        <p>Time to get cooking 🍔 </p>
      </div>
    );
  }

  return (
    <>
      {demos.map((demo) => <DemoItem key={demo._id} demo={demo} setDemos={setDemos} />)}
    </>
  );
};
  
export default DemoList;