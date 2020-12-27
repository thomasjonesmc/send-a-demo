import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import "components/pages/demo/track/tracklist.css";
import Player from "components/pages/demo/Player";
import Dropdown from "components/pages/demo/track/Dropdown";
import Recorder from "components/pages/demo/track/Recorder";

export default function Track(props) {
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
    <div className="">
      <div className="pageTitle">
        <button onClick={() => setIsPlaying(!isPlaying)} className="bigBtn">
          {isPlaying ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
      </div>

      {props.tracks.map((track) => {
        return (
          <div key={track._id} className="trackContainer">
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
            <div className="audioColumn"></div>
            <div className="break"></div>
            <div className="infoSmall">&nbsp;</div>
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
          </div>
        );
      })}
    </div>
  );
}
