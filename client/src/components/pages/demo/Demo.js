import React, { useState } from "react";
import NewTrack from "components/pages/demo/track/NewTrack";
import { Button } from "components/reusable/button/Button";
import { useDemo } from "./useDemo";
import { useParams } from "react-router-dom";
import { Track } from "./track2/Track";
import { FaPlay, FaPause } from "react-icons/fa";
import "./demo.css";

export default function Demo() {
  
  // lets us extract the demo id from the route parameters
  const { demoId } = useParams();
  
  const [showNewTrack, setShowNewTrack] = useState(false);
  const { demo, error, loading, tracks } = useDemo(demoId);
  const [ playing, setPlaying ] = useState(false);

  if (loading) return null;
  if (!demo) return <div>No Demo Found</div>
 
  return (
    <div className="demoPage">
      <div>{error}</div>

      <h1 id="demoTitleHeading">{demo.demoTitle}</h1>

      <div className="center">
        <Button onClick={() => setShowNewTrack(!showNewTrack)}>
          {showNewTrack ? "Close" : "New Track +"}
        </Button>
      </div>

      <hr style={{margin: "15px 0px"}}/>

      <div className="center">
        <Button onClick={() => setPlaying(p => !p)}>
          {playing ? <FaPause /> : <FaPlay />}
        </Button>
      </div>

      {showNewTrack && <NewTrack demo={demo} onClick={() => setShowNewTrack(false)} />}
       
      {tracks.map(t => <Track key={t._id} track={t} playing={playing} />)}
    </div>
  );
}