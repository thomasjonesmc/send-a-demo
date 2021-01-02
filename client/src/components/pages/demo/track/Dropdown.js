import Axios from "axios";
import React from "react";
import { RedButton } from "components/reusable/button/Button";

export default function Dropdown(props) {
  const token = localStorage.getItem("auth-token");

  const deleteTrack = async (e, track) => {
    e.preventDefault();
    try {
      console.log(`Deleting ${track.trackTitle}...`);
      await Axios.delete(`/demos/delete-track/`, {
        headers: {
          "x-auth-token": token,
        },
        data: {
          _id: track._id,
        },
      }).then(deleteFromS3);
      console.log(`${track.trackTitle} removed!`);
      props.refreshDemo();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFromS3 = async () => {
    try {
      Axios.post(`/delete-track-s3`, {
        key: `${props.demo}/${props.track._id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="dropdownDiv">
      <RedButton onClick={(e) => deleteTrack(e, props.track)}>
        Delete Track
      </RedButton>
    </div>
  );
}
