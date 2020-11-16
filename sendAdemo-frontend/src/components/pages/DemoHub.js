import Axios from "axios";
import React, { useEffect, useState } from "react";
import ErrorNotice from "../misc/ErrorNotice";

export default function DemoHub() {
  const [appState, setAppState] = useState({
    loading: true,
    demo: null,
  });
  const [errorMsg, setErrorMsg] = useState();

  const params = new URLSearchParams(document.location.search.substring(1));
  const demoID = params.get("demo");

  useEffect(() => {
    const getDemo = async () => {
      await Axios.get("/demos/get-demo-by-id", {
        params: { id: demoID },
      })
        .then((res) => {
          setAppState({
            loading: false,
            demo: res.data,
          });
        })
        .catch((err) => {
          err.response.data.msg && setErrorMsg(err.response.data.msg);
        });
    };
    getDemo();
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
        <div id="demoContainer" className="flex pt-5">
          <div className="text-lg">
            {appState.demo.tracks.map((track) => {
              return (
                <div key={track._id}>
                  <p>{track.trackTitle}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
