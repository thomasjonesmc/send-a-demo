import React, { useState, useContext } from "react";
import Axios from "axios";
import UserContext from "context/UserContext";
import UnderlinedTextInput from "components/reusable/inputs/Inputs";
import { Button } from "components/reusable/button/Button";
import "./newTrack.css";
import ErrorNotice from "components/reusable/error/Error";
import { FaTimes } from 'react-icons/fa';

export default function NewTrack({onClick, demo, setTracks}) {
  const [trackTitle, setTrackTitle] = useState("");
  const [ error, setError ] = useState(null);
  const { userData } = useContext(UserContext);
  
  const submit = async (e) => {
    e.preventDefault();
    if (trackTitle === "") return;
    try {
      const insertTrack = { trackTitle, trackAuthor: userData.user.displayName };
      const { data: newTrack  } = await Axios.post(`/demos/new-track/${demo._id}`, insertTrack);
      
      setTracks(tracks => [...tracks, {...newTrack, player: null } ]);

      onClick();
    } catch (err) {
      setError(err.message);
    }
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
          {error && <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>}
          <button className="newTrackExitButton" onClick={onClick}><FaTimes /></button>
        </form>
      </div>
    </div>
  );
}
