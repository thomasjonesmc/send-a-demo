import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "context/UserContext";
import UnderlinedTextInput from "components/reusable/inputs/Inputs";
import { Button } from "components/reusable/button/Button";
import "./newTrack.css";

export default function NewTrack(props) {
  const [trackTitle, setTrackTitle] = useState("");
  const { userData } = useContext(UserContext);

  const submit = async (e) => {
    e.preventDefault();
    if (trackTitle === "") return;
    try {
      const newTrack = { trackTitle, trackAuthor: userData.user.displayName };
      await Axios.post(`/demos/new-track/${props.demo._id}`, newTrack);
      await props.onClick();
    } catch (e) {}
  };

  return (
    <div className="newTrackParent">
      <div id="newTrackDiv">
        <form style={{ width: "75%" }} onSubmit={submit}>
          <div>
            <label htmlFor="newTrackTitle">Track Name:</label>
            <UnderlinedTextInput id="newTrackTitle" onChange={setTrackTitle} />
          </div>
          <div className="centerInDiv">
            <Button type="submit">Create New Track</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
