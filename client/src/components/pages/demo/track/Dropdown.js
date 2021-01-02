import Axios from "axios";
import React, { useState } from "react";
import { Button, RedButton } from "components/reusable/button/Button";
import { FiTrash } from "react-icons/fi";

export default function Dropdown(props) {
  const [showMenu, setShowMenu] = useState(false);
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
    <div>
      <Button onClick={() => setShowMenu(!showMenu)} className="smallBtn">
        ...
      </Button>

      {showMenu ? (
        <div className="">
          <RedButton onClick={(e) => deleteTrack(e, props.track)}>
            <FiTrash />
          </RedButton>
        </div>
      ) : null}
    </div>
  );
}
