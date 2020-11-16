import React from "react";
import { useHistory } from "react-router-dom";

const DemoList = (props) => {
  const { demos } = props;
  const history = useHistory();
  if (!demos || demos.length === 0)
    return (
      <div className="text-center pt-20">
        <h1 className="text-xl font-bold">You don't have any demos yet!</h1>
        <p className="text-lg">Time to get cooking 🍔 </p>
      </div>
    );

  return (
    <div className="">
      {demos.map((demo) => {
        const linkTo = (d) => {
          history.push(`/demo/path/?demo=${d._id}`);
        };
        return (
          <div
            key={demo._id}
            className="rounded overflow-hidden shadow-lg pt-5"
            onClick={(e) => linkTo(demo)}
          >
            <div className="px-6 py-4">
              <h3 className="font-bold text-xl mb-2 underline">
                {demo.demoTitle}
              </h3>
              <p className="text-gray-700 text-base">
                author: <strong>{demo.displayName}</strong>
              </p>
              <p className="text-gray-700 text-base">
                created:
                <strong>
                  {" "}
                  {new Date(demo.createdOn).toLocaleDateString()}
                </strong>
              </p>
              <p className="text-gray-700 text-base">
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
