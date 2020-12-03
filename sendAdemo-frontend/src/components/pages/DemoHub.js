import Axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorNotice from "../misc/ErrorNotice";
import NewTrack from "../misc/NewTrack";

export default function DemoHub() {
  const [appState, setAppState] = useState({
    loading: true,
    demo: null,
  });
  const [errorMsg, setErrorMsg] = useState();
  const [showNewTrack, setShowNewTrack] = useState(false);

  const params = new URLSearchParams(document.location.search.substring(1));
  const demoID = params.get("demo");

  //after page refresh from new track, user loses auth token
  //    needs to be fixed
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
  }, [setAppState, demoID]);

  if (appState.loading) {
    return (
      <div className="container">
        <h1 className="text-3xl text-center py-5">🎹 🎤 🎵 </h1>
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
      <div className="container">
        <h1 className="text-2xl text-bold text-center py-5 underline">
          {appState.demo.demoTitle}
        </h1>
        <hr></hr>

        <div className="flex pt-5">
          <button
            className="mx-auto bg-white border-solid border-2 border-black hover:bg-gray-200 text-black  py-2 px-4 rounded"
            type="button"
            value="New Track +"
            onClick={() => setShowNewTrack(!showNewTrack)}
          >
            {showNewTrack ? "Cancel" : "New Track +"}
          </button>
        </div>
        <div>{showNewTrack ? <NewTrack demo={appState.demo} /> : ""}</div>

        <div id="demoContainer" className="flex pt-5">
          <div className="text-lg">
            {appState.demo.tracks.map((track) => {
              return <div key={track._id}>{track.trackTitle}</div>;
            })}
          </div>
        </div>
      </div>
    );
  }
}
