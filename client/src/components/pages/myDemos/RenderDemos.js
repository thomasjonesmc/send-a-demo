import React from "react";
import { useHistory } from "react-router-dom";
import "components/pages/myDemos/renderDemos.css";

const DemoList = (props) => {
  const { demos } = props;
  const history = useHistory();
  if (!demos || demos.length === 0)
    return (
      <div id="container">
        <h1 className="">You don't have any demos yet!</h1>
        <p className="">Time to get cooking 🍔 </p>
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
            <div className="demoText">
              <h3>{demo.demoTitle}</h3>
              <p>
                author: <strong>{demo.displayName}</strong>
              </p>
              <p>
                created:
                <strong>
                  {" "}
                  {new Date(demo.createdOn).toLocaleDateString()}
                </strong>
              </p>
              <p>
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
