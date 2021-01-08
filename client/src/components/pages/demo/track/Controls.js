import React, { useState } from "react";
import { Button } from "components/reusable/button/Button";
import Recorder from "components/pages/demo/track/Recorder";
import Player from "components/pages/demo/track/Player";
import VolumeSlider from "components/pages/demo/track/VolumeSlider";

export default function Controls({
  track,
  recordingState,
  playingState: [isPlaying, setIsPlaying],
  player,
  demoid,
  ...props
}) {
  const [trackIsRecording, setTrackIsRecording] = recordingState;
  //volume is measured from -20 to 20 db on slider
  const [volume, setVolume] = useState(0);
  const [localTrack, setLocalTrack] = useState(null);
  
  const handleChange = (event) => {
    setVolume(event.target.value);
  };

  const handleFileChange = (file) => {
    const fileLocation = URL.createObjectURL(file);
    setLocalTrack(fileLocation);
  };

  return (
    <div className="controls">
      {trackIsRecording.recording &&
      trackIsRecording.track._id !== track._id ? (
        <Button className="btnComp" disabled="disabled">
          Recording...
        </Button>
      ) : (
        <>
          <Recorder
            track={track}
            demoid={demoid}
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
            player={player}
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
}
