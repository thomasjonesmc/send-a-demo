import React, { useState } from "react";
import Axios from "axios";
import Recorder from "../misc/Recorder";

export default function Track(props) {
  let [selectedTrack, setSelectedTrack] = useState();
  const token = localStorage.getItem("auth-token");

  const deleteTrack = async (e, track) => {
    e.preventDefault();
    try {
      await Axios.delete(`/demos/delete-track/`, {
        headers: {
          "x-auth-token": token,
        },
        data: {
          _id: track._id,
        },
      });
      props.onDelete();
    } catch (err) {}
  };

  return (
    <div className="container">
      {props.tracks.map((track) => {
        return (
          <div
            key={track._id}
            className={
              selectedTrack === track
                ? "rounded overflow-hidden shadow-lg mt-5 pt-3 grid grid-cols-5 border-2 border-dashed border-green-400"
                : "rounded overflow-hidden shadow-lg mt-5 pt-3 grid grid-cols-5"
            }
            onClick={
              selectedTrack === track
                ? (e) => setSelectedTrack()
                : (e) => setSelectedTrack(track)
            }
          >
            <div className="px-3 col-start-1 col-span-1 pt-5">
              <h4 className="font-bold">{track.trackTitle}</h4>
              <p>{track.trackAuthor}</p>
              <div className="py-3"></div>
            </div>
            <div className="col-start-2 col-span-4 border border-gray-200">
              <Recorder track={track} />
            </div>
            <div className="p-2 border border-solid border-gray-200 col-span-5">
              <button
                className="mx-auto bg-white border-solid border border-red-400 hover:bg-gray-200 text-black  py-2 px-4 rounded"
                onClick={(e) => deleteTrack(e, track)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
