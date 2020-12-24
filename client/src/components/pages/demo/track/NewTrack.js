import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "context/UserContext";

export default function NewTrack(props) {
  const [trackTitle, setTrackTitle] = useState("");
  const { userData } = useContext(UserContext);

  const submit = async (e) => {
    e.preventDefault();
    if (trackTitle === "") return;
    try {
      const newTrack = { trackTitle, trackAuthor: userData.user.displayName };
      await Axios.post(`/demos/new-track/${props.demo._id}`, newTrack);
      props.onClick();
    } catch (e) {}
  };

  return (
    <form id="container" onSubmit={submit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="trackTitle"
        >
          Track Name
        </label>
        <input
          id="trackTitle"
          type="text"
          onChange={(e) => setTrackTitle(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="pageTitle">
        <button type="submit">Create New Track</button>
      </div>
    </form>
  );
}
