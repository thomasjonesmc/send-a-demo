import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "context/UserContext";
import UnderlinedTextInput from "components/reusable/inputs/Inputs";
import { Button } from "components/reusable/button/Button";

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
        <label htmlFor="trackTitle">Track Name</label>
        <UnderlinedTextInput id="trackTitle" onChange={setTrackTitle} />
      </div>
      <div className="pageTitle">
        <Button type="submit">Create New Track</Button>
      </div>
    </form>
  );
}
