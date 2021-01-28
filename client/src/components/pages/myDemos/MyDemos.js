import React, { useContext } from "react";
import UserContext from "../../../context/UserContext";
import { Button } from "components/reusable/button/Button";
import DemoList from "components/pages/myDemos/DemoList";
import { useMyDemos } from "./useMyDemos";
import "components/pages/myDemos/myDemos.css";
import ErrorNotice from "components/reusable/error/Error";

export default function MyDemos() {
  const { user } = useContext(UserContext);

  const { demos, setDemos, loading, error, setError } = useMyDemos(); 

  return (
    <div id="myDemosContainer">
        
      <h1 className="center" id="userNameHeading">
        {user && `${user.displayName}`}'s demos
      </h1>
  
      <div className="center">
        <Button path="/new-demo">New Demo +</Button>
      </div>

      <hr style={{margin: "15px 0px"}}/>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    
      {loading ? 
        <span className="center">Fetching demos... 🎸</span> : 
        <DemoList demos={demos} setDemos={setDemos} /> 
      }
    </div>
  );
}
