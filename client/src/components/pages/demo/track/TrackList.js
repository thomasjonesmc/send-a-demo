import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "components/pages/demo/track/tracklist.css";
import Player from "components/pages/demo/Player";
import Dropdown from "components/pages/demo/track/Dropdown";
import Recorder from "components/pages/demo/track/Recorder";
import AudioTimeline from "components/pages/demo/track/AudioTimeline";
import VolumeSlider from "components/pages/demo/track/VolumeSlider";
import { Button } from "components/reusable/button/Button";
import * as Tone from "tone";

export default function TrackList(props) {
  //Tone.start() enables audio to be played on mobile browsers
  Tone.start();
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIsRecording, setTrackIsRecording] = useState({
    recording: false,
    track: null,
  });
  const recording = trackIsRecording.recording;

  useEffect(() => {
    try {
      if (recording) setIsPlaying(true);
      if (!recording) {
        setTrackIsRecording({ recording: false, track: null });
      }
    } catch (e) {
      console.log(e);
    }
  }, [recording, isPlaying]);

  return (
    <div>
      <PlayAllButton playingState={[isPlaying, setIsPlaying]} />
      <div className="centerTrack">
        {props.tracks.map((track) => (
          <Track
            key={track._id}
            track={track}
            playingState={[isPlaying, setIsPlaying]}
            recordingState={[trackIsRecording, setTrackIsRecording]}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}

const PlayAllButton = ({ playingState: [isPlaying, setIsPlaying] }) => {
  useEffect(() => {
    isPlaying ? Tone.Transport.start() : Tone.Transport.pause();
  }, [isPlaying]);

  return (
    <div className="centerInDiv">
      <Button onClick={() => setIsPlaying(!isPlaying)} className="bigBtn">
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </Button>
    </div>
  );
};

const Track = ({ track, playingState, recordingState, ...props }) => {
  return (
    <div className="centerInDiv">
      <div key={track._id} className="trackContainer">
        <InfoColumn track={track} playingState={playingState} {...props} />

        <div className="audioColumn">
          <AudioTimeline playingState={playingState.isPlaying} track={track} />
        </div>
        <div className="break"></div>
        <div className="infoSmall">&nbsp;</div>

        <Controls
          track={track}
          recordingState={recordingState}
          playingState={playingState}
          {...props}
        />
      </div>
    </div>
  );
};

const InfoColumn = ({ track, playingState: [isPlaying], ...props }) => {
  const [showMenu, setShowMenu] = useState();
  return (
    <div className="infoColumn">
      <h4>{track.trackTitle}</h4>
      <p>{track.trackAuthor}</p>
      <div>{/* <Player isPlaying={isPlaying} track={track} /> */}</div>
      <div>
        <Button onClick={() => setShowMenu(!showMenu)} className="smallBtn">
          ...
        </Button>

        <div className="dropdownParent">
          {showMenu ? (
            <Dropdown
              demo={props.demo}
              track={track}
              refreshDemo={props.refreshDemo}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

const Controls = ({
  track,
  recordingState,
  playingState: [isPlaying, setIsPlaying],
  ...props
}) => {
  const [trackIsRecording, setTrackIsRecording] = recordingState;
  //volume is measured from -20 to 20 db on slider
  const [volume, setVolume] = useState(0);
  const [localTrack, setLocalTrack] = useState(null);
  const handleChange = (event) => {
    setVolume(event.target.value);
  };
  const handleFileChange = (file) => {
    // console.log(file);
    const fileLocation = URL.createObjectURL(file);
    setLocalTrack(fileLocation);
  };

  return (
    <div className="controls">
      {trackIsRecording.recording && trackIsRecording.track !== track ? (
        <Button className="btnComp" disabled="disabled">
          Recording...
        </Button>
      ) : (
        <>
          <Recorder
            track={track}
            demoId={props.demo}
            localTrackState={[localTrack, setLocalTrack]}
            setLocalBuffer={handleFileChange}
            refreshDemo={props.refreshDemo}
            trackIsRecording={() => {
              setTrackIsRecording({
                recording: !trackIsRecording.recording,
                track: track,
              });
              if (!recordingState.trackIsRecording) {
                setIsPlaying(false);
              }
            }}
          />
        </>
      )}
      {track.trackSignedURL || localTrack ? (
        <>
          <Player
            isPlaying={isPlaying}
            track={track}
            localTrack={localTrack}
            volume={volume}
            trackBeingRecorded={trackIsRecording.track}
          />
          <VolumeSlider value={volume} onChange={handleChange} />
        </>
      ) : (
        ""
      )}
    </div>
  );
};
