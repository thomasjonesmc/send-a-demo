import Axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorNotice from "components/reusable/ErrorNotice";
import NewTrack from "components/pages/demo/track/NewTrack";
import TrackList from "components/pages/demo/track/TrackList";

export default function DemoHub() {
  const [appState, setAppState] = useState({
    loading: true,
    demo: null,
  });

  const [errorMsg, setErrorMsg] = useState();
  const [showNewTrack, setShowNewTrack] = useState(false);

  const params = new URLSearchParams(document.location.search.substring(1));
  const demoID = params.get("demo");

  useEffect(() => {
    try {
      const getDemo = async () => {
        await Axios.get("/demos/get-demo-by-id", {
          params: { id: demoID },
        }).then((res) => {
          setAppState({
            loading: false,
            demo: res.data,
          });
        });
      };
      getDemo();
    } catch (err) {
      err.response.data.msg && setErrorMsg(err.response.data.msg);
    }
  }, [setAppState, demoID, showNewTrack, appState.loading]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  }, []);

  if (appState.loading) {
    return (
      <div id="container">
        <h1 className="pageTitle">🎹 🎤 🎵 </h1>
        {errorMsg && (
          <ErrorNotice
            message={errorMsg}
            clearError={() => setErrorMsg(undefined)}
          />
        )}
      </div>
    );
  }
  if (appState.demo !== null) {
    return (
      <div id="container">
        <h1 className="pageTitle">{appState.demo.demoTitle}</h1>
        <hr></hr>

        <div className="pageTitle">
          <button
            className="btnComp"
            type="button"
            value="New Track +"
            onClick={() => setShowNewTrack(!showNewTrack)}
          >
            {showNewTrack ? "Close" : "New Track +"}
          </button>
        </div>
        <div>
          {showNewTrack ? (
            <NewTrack
              demo={appState.demo}
              onClick={(e) => setShowNewTrack(false)}
            />
          ) : (
            ""
          )}
        </div>

        <div id="demoContainer">
          <TrackList
            tracks={appState.demo.tracks}
            demo={demoID}
            onDelete={() => setAppState({ loading: true })}
          />
        </div>
      </div>
    );
  }
}
