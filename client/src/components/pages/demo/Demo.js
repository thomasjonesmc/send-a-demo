import React, { useContext, useState } from "react";
import { Button } from "components/reusable/button/Button";
import { useDemo } from "./useDemo";
import { Track } from "./track/Track";
import { FaPlay, FaPause } from "react-icons/fa";
import "./demo.css";
import ErrorNotice from "components/reusable/error/Error";
import { Form, FormInput } from "components/reusable/form/Form";
import UserContext from "context/UserContext";
import Axios from "axios";
import { Popup } from "components/reusable/popup/Popup";

export default function Demo({location}) {
  
  const [showNewTrack, setShowNewTrack] = useState(false);
  const { demo, error, demoLoading, tracks, tracksLoading, recorder, setTracks, setError } = useDemo(location.state);
  const [ playing, setPlaying ] = useState(false);

  if (demoLoading) return <span className="center">Loading Demo... 🎸</span>;
  if (!demo) return <div className="center">No Demo Found</div>

  return (
    <div className="demoPage">

      <h1 id="demoTitleHeading">{demo.title}</h1>

      <div className="center">
        <Button onClick={() => setShowNewTrack(true)}>
          New Track +
        </Button>
      </div>

      <hr style={{margin: "15px 0px"}}/>
     
      {tracksLoading 
        ? <div className="center">Tracks Loading</div> 
        : <>
          <div className="center">
            <Button onClick={() => setPlaying(p => !p)}>
              {playing ? <FaPause /> : <FaPlay />}
            </Button>
          </div>
          {tracks.map(t => <Track key={t._id} track={t} demo={demo} recorder={recorder} playingState={[playing, setPlaying]} tracksState={[tracks, setTracks]} />)}
          </>
      }

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}


      {showNewTrack && <Popup title="New Track" onExit={() => setShowNewTrack(false)}>
        <NewTrack demoId={demo._id} setTracks={setTracks} setShowNewTrack={setShowNewTrack} />
      </Popup>}
  
    </div>
  );
}

export const NewTrack = ({demoId, setTracks, setShowNewTrack}) => {

  const [trackTitle, setTrackTitle] = useState("");
  const [ error, setError ] = useState(null);
  const { user } = useContext(UserContext);

  const onSubmit = () => {
    if (trackTitle === "") {
      return setError("Track title is required");
    }
    
    Axios.post(`/demos/${demoId}/new-track`, {trackTitle, trackAuthor: user.displayName})
      .then(res => {
        const newTrack = res.data;
        setTracks(tracks => [...tracks, {...newTrack, player: null}]);
      })
      .catch(err => setError(err.message));

    setShowNewTrack(false);
  }

  return (
    <Form onSubmit={onSubmit}>
      <FormInput name="newTrackTitle" label="Track Title" onChange={setTrackTitle} autoFocus/>
    
      <div className="center">
        <Button type="submit">Create New Track</Button>
      </div>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  )
}