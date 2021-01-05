import React, { useState } from "react";
import NewTrack from "components/pages/demo/track/NewTrack";
import { Button } from "components/reusable/button/Button";
import { useDemo } from "./useDemo";
import { useParams } from "react-router-dom";
import "./demo.css";

export default function DemoHub() {
  
  // lets us extract the demo id from the route parameters
  const { demoID } = useParams();
  
  const [showNewTrack, setShowNewTrack] = useState(false);
  const { demo, error, loading } = useDemo(demoID);

  if (loading) return null;
  if (!demo) return <div>No Demo Found</div>
 
  return (
    <div>
      <div>{error}</div>
      <h1 className="centerInDiv" id="demoTitleHeading">
        {demo.demoTitle}
      </h1>
      <div className="centerInDiv">
        <Button onClick={() => setShowNewTrack(!showNewTrack)}>
          {showNewTrack ? "Close" : "New Track +"}
        </Button>
      </div>
      <div>
        {showNewTrack ? (
          <NewTrack demo={demo} onClick={() => setShowNewTrack(false)} />
        ) : null}
      </div>
    
      <div></div>

    </div>
  );
}
