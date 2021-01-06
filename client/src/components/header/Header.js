import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import logo from "img/demo.svg";
import UserContext from "context/UserContext";
import "components/header/header.css";

export default function Header() {

  const { userData, setUserData } = useContext(UserContext);
  const history = useHistory();

  const logout = () => {
    setUserData({
      token: null,
      user: null,
    });
    localStorage.setItem("auth-token", "");
    history.push("/");
  }

  const imageClick = () => {
    if (userData.user) history.push("/my-demos")
    else history.push("/");
  }

  return (
    <div id="headerContainer">
      <header id="header">

        <img
          src={logo}
          alt="send a demo logo"
          onClick={imageClick}
        />
    
        {userData.user && <div>
          <button className="headerButton" onClick={() => history.push("/my-demos")}>My Demos</button>
          <button className="headerButton" onClick={logout}>Log Out</button>
        </div>}

      </header>
    </div>
  );
}
