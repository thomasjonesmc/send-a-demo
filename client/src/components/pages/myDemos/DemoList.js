import React from "react";
import { useHistory } from "react-router-dom";
import "./demoList.css";

const DemoList = (props) => {

  const { demos } = props;
  const history = useHistory();

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
      {demos.map((demo) => (
        <div key={demo._id} className="demo" onClick={(e) => history.push(`/demos/${demo._id}`)}>
          <h3 className="demoTitle">{demo.title}</h3>
          <DemoText label="author" value={demo.displayName} />
          <DemoText label="created" value={new Date(demo.createdOn).toLocaleDateString()} />
          <DemoText label="last modified" value={new Date(demo.modifiedOn).toLocaleDateString()} />
        </div>  
      ))}
    </>
  );
};

const DemoText = ({label, value}) => <p className="demoText">{label}: <strong>{value}</strong></p>
  
export default DemoList;