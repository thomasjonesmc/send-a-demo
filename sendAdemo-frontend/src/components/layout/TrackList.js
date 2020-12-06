import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

export default function Track(props) {
  let [selectedTrack, setSelectedTrack] = useState(null);
  const history = useHistory();
  const token = localStorage.getItem("auth-token");

  const deleteTrack = async (e) => {
    e.preventDefault();
    try {
      const delTrackRes = await Axios.delete(`/demos/delete-track/`, {
        headers: {
          "x-auth-token": token,
        },
        data: {
          _id: selectedTrack._id,
        },
      });
      console.log(delTrackRes);
      history.push(`/demo/path/?demo=${props.demo}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      {props.tracks.map((track) => {
        return (
          <div
            key={track._id}
            className={
              selectedTrack === track
                ? "rounded overflow-hidden shadow-lg pt-5 border-4 border-solid border-green-400"
                : "rounded overflow-hidden shadow-lg pt-5"
            }
            onClick={(e) => setSelectedTrack(track)}
          >
            <div className="px-6 px-4">
              <h3 className="font-bold text-xl mb-2 underline">
                {track.trackTitle}
              </h3>
              <p className="text-gray-700">{track.trackAuthor}</p>
            </div>
            <div>
              <button onClick={(e) => deleteTrack(e)}>Delete Track</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
