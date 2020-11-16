import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";
import Button from "../layout/Button";
import DemoList from "../layout/DemoList";
import DemosLoading from "../misc/DemosLoading";

export default function MyDemos() {
  const { userData } = useContext(UserContext);
  const [appState, setAppState] = useState({
    loading: true,
    demos: null,
  });

  const LoadDemos = DemosLoading(DemoList);

  let token = localStorage.getItem("auth-token");

  useEffect(() => {
    const getUserDemos = async () => {
      await Axios.get("http://192.168.86.105:8080/demos/get-demo-list", {
        headers: { "x-auth-token": token },
      })
        .then((res) => {
          console.log(res.data);
          setAppState({ loading: false, demos: res.data });
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    getUserDemos();
  }, [setAppState]);

  return (
    <div className="container">
      <div>
        <h1 className="text-3xl text-bold text-center py-5">
          {userData.user.displayName}'s demos
        </h1>
      </div>
      <hr></hr>
      <div className="flex pt-5">
        <Button name="New Demo +" path="/create-demo" />
      </div>
      <div>
        <LoadDemos isLoading={appState.loading} demos={appState.demos} />
      </div>
    </div>
  );
}
