import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "../../context/UserContext";

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
    <form className="bg-white rounded px-8 pt-6 mb-4" onSubmit={submit}>
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
      <div>
        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
          value="create track"
          // onClick={(e) => props.onClick()}
        />
      </div>
    </form>
  );
}
