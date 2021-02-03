import React, { useContext, useState, useEffect } from "react";
import { Button, IconButton } from "components/reusable/button/Button";
import { useDemo } from "./useDemo";
import { Track } from "./track/Track";
import { FaPlay, FaPause,FaBackward, FaForward,  FaRegTrashAlt } from "react-icons/fa";
import "./demo.css";
import ErrorNotice from "components/reusable/error/Error";
import { Form, FormInput } from "components/reusable/form/Form";
import UserContext from "context/UserContext";
import Axios from "axios";
import { Popup } from "components/reusable/popup/Popup";
import { AudioScrubber } from "components/pages/demo/Scrubber"
import * as Tone from "tone";
import { MdPersonAdd, MdSettings } from "react-icons/md";
import { ContributorSearch } from "components/userSearch/ContributorSearch";
import { DemoSettings } from "./DemoSettings";

export default function Demo({ location }) {
  Tone.start();
  const [showNewTrack, setShowNewTrack] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { demo, error, demoLoading, tracks, tracksLoading, setTracks, setDemo, setError, lengthState: [trackLengths, setTrackLengths], demoLength } = useDemo(
    location.state
  );
  const [playing, setPlaying] = useState(false);
  const [ showSearch, setShowSearch ] = useState(false);
  const [ showSettings, setShowSettings ] = useState(false);

  //Controls play/pause
  useEffect(() => {
    playing ? Tone.Transport.start() : Tone.Transport.pause();
  }, [playing]);

  useEffect(() => {
    if (currentTime >= demoLength){
      setPlaying(false);
      Tone.Transport.stop();
    }
  }, [currentTime, demoLength]);


  const onAddContributor = (updatedDemo) => {
    setDemo(updatedDemo);
  }

  const skipTime = (seconds) => {
    if (Tone.Transport.seconds + seconds < 0) {
      Tone.Transport.seconds = 0;
      setCurrentTime(0);
    } else if (Tone.Transport.seconds + seconds > demoLength) {
      Tone.Transport.seconds = demoLength;
      setCurrentTime(demoLength);
    } else {
      Tone.Transport.seconds = currentTime + seconds;
      setCurrentTime(currentTime + seconds);
    }
  }

  if (demoLoading) return <span className="center">Loading Demo... 🎸</span>;
  if (!demo) return <div className="center">No Demo Found</div>;
  
  return (
    <div className="demoPage">
      <h1 id="demoTitleHeading">{demo.title}</h1>

      <div className="center">
        <Button onClick={() => setShowNewTrack(true)}>New Track +</Button>
      </div>

      <div className="demoControlButtonsContainer">
        <IconButton component={FaRegTrashAlt} />
        <IconButton component={MdPersonAdd} onClick={() => setShowSearch(show => !show)} />
        <IconButton component={MdSettings} onClick={() => setShowSettings(show => !show)} />
      </div>
        
      <hr style={{ margin: "15px 0px" }} />

      {tracksLoading ? (
        <div className="center">Tracks Loading</div>
      ) : (
        <>
          {tracks.length !== 0 ? 
          <>
            <div className="demoControlButtonsContainer">
              <Button onClick={() => skipTime(-5)}><FaBackward /></Button>
              <Button onClick={() => setPlaying((p) => !p)}>{playing ? <FaPause /> : <FaPlay />}</Button>
              <Button onClick={() => skipTime(5)}><FaForward /></Button>
            </div>
            <AudioScrubber
              demoLength={demoLength}
              timeState={[currentTime, setCurrentTime]}
              playingState={[playing, setPlaying]}
            />
          </> : null}
          {tracks.map((t) => (
            <Track
              key={t._id}
              track={t}
              demo={demo}
              demoLength={demoLength}
              lengthState={[trackLengths, setTrackLengths]}
              playingState={[playing, setPlaying]}
              timeState={[currentTime, setCurrentTime]}
              tracksState={[tracks, setTracks]}
            />
          ))}
        </>
      )}

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}

      {showNewTrack && (
        <Popup title="New Track" onExit={() => setShowNewTrack(false)}>
          <NewTrack demoId={demo._id} setTracks={setTracks} setShowNewTrack={setShowNewTrack} />
        </Popup>
      )}

      {showSearch && <ContributorSearch demo={demo} onAddContributor={onAddContributor} onExit={() => setShowSearch(false)} />}
      
      {showSettings && <DemoSettings demo={demo} onUpdateDemo={updatedDemo => setDemo(updatedDemo)} onExit={() => setShowSettings(false)} />}
    </div>
  );
}

export const NewTrack = ({ demoId, setTracks, setShowNewTrack }) => {
  const [trackTitle, setTrackTitle] = useState("");
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const onSubmit = () => {
    if (trackTitle === "") {
      return setError("Track title is required");
    }

    Axios.post(`/demos/${demoId}/new-track`, {
      trackTitle,
      trackAuthor: user.displayName,
    })
      .then((res) => {
        const newTrack = res.data;
        setTracks((tracks) => [...tracks, { ...newTrack, player: null }]);
      })
      .catch((err) => setError(err.message));

    setShowNewTrack(false);
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormInput name="newTrackTitle" label="Track Title" onChange={e => setTrackTitle(e.target.value)} autoFocus />

      <div className="center">
        <Button type="submit">Create New Track</Button>
      </div>

      {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
    </Form>
  );
};
