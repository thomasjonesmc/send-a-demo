import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "components/pages/demo/track/tracklist.css";
import Player from "components/pages/demo/Player";
import Dropdown from "components/pages/demo/track/Dropdown";
import Recorder from "components/pages/demo/track/Recorder";

export default function TrackList(props) {
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
        setTrackIsRecording({ track: null });
      }
    } catch (e) {
      console.log(e);
    }
  }, [recording, isPlaying]);

  return (
    <div>
      <PlayAllButton playingState={[isPlaying, setIsPlaying]} />

      {props.tracks.map((track) => (
        <Track 
          track={track}
          playingState={[isPlaying, setIsPlaying]} 
          recordingState={[trackIsRecording, setTrackIsRecording]}
          {...props}
        />
      ))}
    </div>
  );
}

const PlayAllButton = ({playingState: [isPlaying, setIsPlaying]}) => (
  <div className="pageTitle">
    <button onClick={() => setIsPlaying(!isPlaying)} className="bigBtn">
      {isPlaying ? (
        <FontAwesomeIcon icon={faPause} />
      ) : (
        <FontAwesomeIcon icon={faPlay} />
      )}
    </button>
  </div>
)

const Track = ({track, playingState, recordingState, ...props}) => {
    
  return (
    <div key={track._id} className="trackContainer">
      
      <InfoColumn track={track} playingState={playingState} {...props} />
      
      <div className="audioColumn"></div>
      <div className="break"></div>
      <div className="infoSmall">&nbsp;</div>

      <Controls track={track} recordingState={recordingState} {...props} />
   
    </div>
  );
}

const InfoColumn = ({track, playingState: [isPlaying], ...props}) => (
  <div className="infoColumn">
    <h4>{track.trackTitle}</h4>
    <p>{track.trackAuthor}</p>
    <div>
      <Player isPlaying={isPlaying} track={track} />
    </div>
    <div>
      <Dropdown
        demo={props.demo}
        track={track}
        onDelete={props.onDelete}
      />
    </div>
  </div>
)

const Controls = ({track, recordingState, ...props}) => {

  const [trackIsRecording, setTrackIsRecording] = recordingState;

  return (
    <div className="controls">
      {trackIsRecording.recording &&
      trackIsRecording.track !== track ? (
        <button className="bg-white border-solid border border-gray-400 hover:bg-gray-200 text-black  py-2 px-4 rounded">
          Recording...
        </button>
      ) : (
        <Recorder
          track={track}
          demoId={props.demo}
          onUpload={props.onDelete}
          trackIsRecording={() =>
            setTrackIsRecording({
              recording: !trackIsRecording.recording,
              track: track,
            })
          }
        />
      )}
    </div>
  )
}