import React, { useState } from "react";
import "components/pages/demo/track/tracklist.css";
import Player from "../Player";
import Dropdown from "./Dropdown";

export default function Track(props) {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <div className="">
      {/* <Player tracks={props.tracks} /> */}
      <button onClick={() => setIsPlaying(!isPlaying)} className="btnComp">
        {isPlaying ? "Pause" : "Play"}
      </button>
      {props.tracks.map((track) => {
        return (
          <div key={track._id} className="trackContainer">
            <div className="infoColumn">
              <h4>{track.trackTitle}</h4>
              <p>{track.trackAuthor}</p>
              <div>
                <Player isPlaying={isPlaying} track={track} />
              </div>
            </div>
            <div className="audioColumn"></div>
            <div className="controls">
              <p>beep</p>
            </div>
            <div>
              <Dropdown
                demo={props.demo}
                track={track}
                onDelete={props.onDelete}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
