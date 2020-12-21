import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthOptions from "components/header/AuthOptions";
import logo from "img/demo.svg";
import UserContext from "context/UserContext";

export default function Header() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const myDemos = () => history.push("/my-demos");

  return (
    <header id="header">
      {userData.user ? (
        <>
          <Link className="title" to="#">
            <img
              src={logo}
              onClick={myDemos}
              width="40px"
              height="40px"
              alt="send a demo logo"
            />
          </Link>
          <AuthOptions />
        </>
      ) : (
        <>
          <Link className="title" to="/">
            <img src={logo} width="40px" height="40px" alt="send a demo logo" />
          </Link>
          <AuthOptions />
        </>
      )}
    </header>
  );
}
