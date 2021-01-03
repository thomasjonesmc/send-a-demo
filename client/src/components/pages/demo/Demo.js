import Axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import ErrorNotice from "components/reusable/ErrorNotice";
import NewTrack from "components/pages/demo/track/NewTrack";
import TrackList from "components/pages/demo/track/TrackList";
import { Button } from "components/reusable/button/Button";
import "./demo.css";

export default function DemoHub() {
  const [appState, setAppState] = useState({
    loading: true,
    demo: null,
  });

  const [errorMsg, setErrorMsg] = useState();
  const [showNewTrack, setShowNewTrack] = useState(false);

  const params = new URLSearchParams(document.location.search.substring(1));
  const demoID = params.get("demo");

  let loadingTimeout = useRef(null);

  useEffect(() => {
    try {
      const getDemo = async () => {
        await Axios.get("/demos/get-demo-by-id", {
          params: { id: demoID },
        }).then((res) => {
          loadingTimeout.current = setTimeout(() => {
            setAppState({
              loading: false,
              demo: res.data,
            });
          }, 750);
        });
      };
      getDemo();
    } catch (err) {
      err.response.data.msg && setErrorMsg(err.response.data.msg);
    }
  }, [setAppState, demoID, appState.loading]);

  useEffect(() => {
    let stream;
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((audioStream) => {
        stream = audioStream;
      });
    return () => {
      if (stream) stream.getAudioTracks()[0].stop();
    };
  }, []);

  if (appState.loading) {
    return (
      <div id="container">
        <h1 className="centerInDiv">🎹 🎤 🎵 </h1>
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
        <h1 className="centerInDiv" id="demoTitleHeading">
          {appState.demo.demoTitle}
        </h1>
        <div className="centerInDiv">
          <Button onClick={() => setShowNewTrack(!showNewTrack)}>
            {showNewTrack ? "Close" : "New Track +"}
          </Button>
        </div>
        <div>
          {showNewTrack ? (
            <NewTrack
              demo={appState.demo}
              onClick={() => {
                setShowNewTrack(false);
                setAppState({ loading: true });
              }}
            />
          ) : null}
        </div>
        <hr></hr>

        <div id="demoContainer">
          <TrackList
            tracks={appState.demo.tracks}
            demo={demoID}
            refreshDemo={() => setAppState({ loading: true })}
          />
        </div>
      </div>
    );
  }
}
