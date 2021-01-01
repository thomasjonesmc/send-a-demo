import React from "react";
import { useHistory } from "react-router-dom";
import "components/reusable/button/button.css";

// export default function Button({ path, ...props }) {
//   const history = useHistory();

//   return (
//     <button
//       type="button"
//       className="btnComp"
//       onClick={() => history.push(path)}
//       {...props}
//     ></button>
//   );
// }

export const Button = ({ path, ...props }) => {
  const history = useHistory();
  return (
    <button
      type="button"
      className="btnComp"
      onClick={() => history.push(path)}
      {...props}
    ></button>
  );
};

export const RedButton = ({ ...props }) => {
  return <Button className="redBtn" {...props} />;
};

export const GreenButton = ({ ...props }) => {
  return <Button className="greenBtn" {...props} />;
};
