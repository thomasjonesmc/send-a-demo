import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "context/UserContext";
import "components/header/header.css";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();

  const home = () => history.push("/");
  const myDemos = () => history.push("/my-demos");

  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    home();
  };

  return (
    <nav className="authOptions">
      {userData.user ? (
        <>
          <button className="headerBtn" onClick={myDemos}>
            My Demos
          </button>
          <button className="headerBtn" onClick={logout}>
            Log Out
          </button>
        </>
      ) : (
        <>
          {/* <button onClick={register}>Register</button>
          <button onClick={login}>Login</button> */}
        </>
      )}
    </nav>
  );
}
