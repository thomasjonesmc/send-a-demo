import Axios from "axios";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Dropdown(props) {
  const [showMenu, setShowMenu] = useState(false);
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
      }).then(deleteFromS3);
      props.onDelete();
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
      <button onClick={() => setShowMenu(!showMenu)} className="smallBtn">
        ...
      </button>

      {showMenu ? (
        <div className="menu py-3">
          <button
            className="btnComp"
            onClick={(e) => deleteTrack(e, props.track)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
