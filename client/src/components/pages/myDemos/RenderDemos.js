import React from "react";
import { useHistory } from "react-router-dom";
import "components/pages/myDemos/renderDemos.css";

const DemoList = (props) => {
  const { demos } = props;
  const history = useHistory();
  if (!demos || demos.length === 0)
    return (
      <div style={{ textAlign: "center" }}>
        <h1>You don't have any demos yet!</h1>
        <p>Time to get cooking 🍔 </p>
      </div>
    );

  return (
    <div className="demoListContainer">
      {demos.map((demo) => {
        const linkTo = (d) => {
          history.push(`/demo/path/?demo=${d._id}`);
        };
        return (
          <div key={demo._id} className="demo" onClick={(e) => linkTo(demo)}>
            <div>
              <h3 className="demoTitle">{demo.demoTitle}</h3>
              <p className="demoText">
                author: <strong>{demo.displayName}</strong>
              </p>
              <p className="demoText">
                created:
                <strong>
                  {" "}
                  {new Date(demo.createdOn).toLocaleDateString()}
                </strong>
              </p>
              <p className="demoText">
                last modified:
                <strong>
                  {" "}
                  {new Date(demo.modifiedOn).toLocaleDateString()}
                </strong>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DemoList;
