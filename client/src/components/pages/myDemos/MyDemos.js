import React, { useContext } from "react";
import UserContext from "../../../context/UserContext";
import { Button } from "components/reusable/button/Button";
import DemoList from "components/pages/myDemos/DemoList";
import { useMyDemos } from "./useMyDemos";
import "components/pages/myDemos/mydemos.css";

export default function MyDemos() {
  const { user } = useContext(UserContext);

  const { demos, loading, error } = useMyDemos(); 

  return (
    <div id="myDemosContainer">
    
      {error && <div>{error}</div>}

      <h1 className="center" id="userNameHeading">
        {user && `${user.displayName}`}'s demos
      </h1>
  
      <div className="center">
        <Button path="/new-demo" style={{margin: "10px 0px"}}>New Demo +</Button>
      </div>
    
      {loading ? 
        <span className="center">Fetching demos... 🎸</span> : 
        <DemoList demos={demos} /> 
      }
    </div>
  );
}
