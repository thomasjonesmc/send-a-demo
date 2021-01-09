import React, { useState } from "react";
import NewTrack from "components/pages/demo/track/NewTrack";
import { Button } from "components/reusable/button/Button";
import { useDemo } from "./useDemo";
import { Track } from "./track2/Track";
import { FaPlay, FaPause } from "react-icons/fa";
import "./demo.css";
import ErrorNotice from "components/reusable/error/Error";

export default function Demo({location}) {
  
  const [showNewTrack, setShowNewTrack] = useState(false);
  const { demo, error, loading, tracks, recorder, setTracks, setError } = useDemo(location.state);
  const [ playing, setPlaying ] = useState(false);

  if (loading) return <span className="center">Loading Demos... 🎸</span>;
  if (!demo) return <div>No Demo Found</div>

  return (
    <div className="demoPage">

      <h1 id="demoTitleHeading">{demo.title}</h1>

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

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}

      {showNewTrack && <NewTrack demo={demo} setTracks={setTracks} onClick={() => setShowNewTrack(false)} />}
       
      {tracks.map(t => <Track key={t._id} track={t} demo={demo} recorder={recorder} playingState={[playing, setPlaying]} tracksState={[tracks, setTracks]} />)}
  
    </div>
  );
}