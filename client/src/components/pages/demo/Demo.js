import React, { useState } from "react";
import NewTrack from "components/pages/demo/track/NewTrack";
import { Button } from "components/reusable/button/Button";
import { useDemo } from "./useDemo";
import { useParams } from "react-router-dom";
import "./demo.css";


export default function Demo() {
  
  // lets us extract the demo id from the route parameters
  const { demoId } = useParams();
  
  const [showNewTrack, setShowNewTrack] = useState(false);
  const { demo, error, loading, tracks } = useDemo(demoId);

  if (loading) return null;
  if (!demo) return <div>No Demo Found</div>
 
  return (
    <div className="demoPage">
      <div>{error}</div>
      <h1 id="demoTitleHeading">
        {demo.demoTitle}
      </h1>
      <Button onClick={() => setShowNewTrack(!showNewTrack)}>
        {showNewTrack ? "Close" : "New Track +"}
      </Button>

      {showNewTrack && <NewTrack demo={demo} onClick={() => setShowNewTrack(false)} />}
       
      {tracks.map(t => (
        <div style={{padding: "10px", margin: "10px 0px", border: "1px solid gray"}}>
          <div style={{padding: "10px", borderBottom: "2px solid black"}}>{t.trackTitle}</div>
          <div style={{padding: "10px", borderBottom: "2px solid black"}}>{t.trackAuthor}</div>
        </div>
      ))}
    </div>
  );
}