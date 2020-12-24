import React, { useState } from "react";
import "components/pages/demo/track/tracklist.css";

export default function Track(props) {
  return (
    <div className="">
      {props.tracks.map((track) => {
        return (
          <div key={track._id} className="trackContainer">
            <div className="infoColumn">
              <h4>{track.trackTitle}</h4>
              <p>{track.trackAuthor}</p>
              <div></div>
            </div>
            <div className="audioColumn">
              {/* <Recorder track={track} /> */}
            </div>
            <div className="controls">
              <p>beep</p>
            </div>
            {/* <div>
              <button className="" onClick={(e) => deleteTrack(e, track)}>
                Delete
              </button>
            </div> */}
          </div>
        );
      })}
    </div>
  );
}
