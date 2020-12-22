import Axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../../context/UserContext";
import Button from "components/reusable/button//Button";
import DemoList from "components/pages/myDemos/DemoList";

export default function MyDemos() {
  const { userData } = useContext(UserContext);
  const [appState, setAppState] = useState({
    loading: true,
    demos: null,
  });

  let loadingTimeout = useRef(null);

  let token = localStorage.getItem("auth-token");

  useEffect(() => {
    const getUserDemos = async () => {
      await Axios.get("demos/get-demo-list", {
        headers: { "x-auth-token": token },
      })
        .then((res) => {
          loadingTimeout.current = setTimeout(() => {
            setAppState({ loading: false, demos: res.data });
          }, 750);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    getUserDemos();
  }, [setAppState, token]);

  return (
    <div className="container">
      <div>
        <h1 className="text-3xl text-bold text-center py-5">
          {userData.user && `${userData.user.displayName}`}'s demos
        </h1>
      </div>
      <hr></hr>
      <div className="flex pt-5">
        <Button name="New Demo +" path="/create-demo" />
      </div>
      <div>
        {appState.loading ? (
          <div className="text-center py-20">
            <p className="text-2xl">Fetching demos... 🎸 </p>
          </div>
        ) : (
          <DemoList demos={appState.demos} />
        )}
      </div>
    </div>
  );
}
