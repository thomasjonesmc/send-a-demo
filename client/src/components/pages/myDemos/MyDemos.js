import Axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import { Button } from "components/reusable/button/Button";
import DemoList from "components/pages/myDemos/RenderDemos";
import "components/pages/myDemos/mydemos.css";

export default function MyDemos() {
  const { userData } = useContext(UserContext);
  const [appState, setAppState] = useState({
    loading: true,
    demos: null,
  });

  const history = useHistory();

  let loadingTimeout = useRef(null);

  let token = localStorage.getItem("auth-token");

  useEffect(() => {
    const getUserDemos = async () => {
      const userDemos = await Axios.get("demos/get-demo-list", {
        headers: { "x-auth-token": token },
      });
      loadingTimeout.current = setTimeout(() => {
        setAppState({ loading: false, demos: userDemos.data });
      }, 750);
    };
    getUserDemos();
  }, [setAppState, token]);

  return (
    <div id="myDemosContainer">
      <div>
        <h1 className="centerInDiv" id="userNameHeading">
          {userData.user && `${userData.user.displayName}`}'s demos
        </h1>
      </div>
      <hr></hr>
      <div id="newDemo">
        <Button onClick={() => history.push("/new-demo")}>New Demo +</Button>
      </div>
      <div>
        {appState.loading ? (
          <div id="loading">
            <p>Fetching demos... 🎸 </p>
          </div>
        ) : (
          <DemoList demos={appState.demos} />
        )}
      </div>
    </div>
  );
}
