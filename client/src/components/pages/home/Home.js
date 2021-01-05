import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "components/reusable/button/Button";
import UserContext from "context/UserContext";
import "components/pages/home/home.css";

export default function Home() {
  const { userData } = useContext(UserContext);
  const history = useHistory();

  const signedIn = () => history.push("/my-demos");

  return (
    <>
      {userData.user ? (
        signedIn()
      ) : (
        <div id="page">
          <div id="container">
            <div id="homeHeader">
              <h2>Welcome to Send A Demo!</h2>
              <h3>To get started making/sharing demos, register or sign in!</h3>
              <div id="homeBtns">
                <Button onClick={() => history.push("/register")}>
                  Register
                </Button>
                <Button onClick={() => history.push("/login")}>Login</Button>
              </div>
            </div>
            <div id="homeBody">
              <div>
                <h2>Demos done easy</h2>
                <p>
                  Record, share, collaborate, create! It has never been easier
                  to record with a friend.
                </p>
              </div>
              <div>
                <h2>Rock on! 🎸</h2>
                <p>Go ahead and make an account to start recording!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
