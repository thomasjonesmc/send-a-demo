import React, { useEffect } from "react";
//import MicRecorder from "mic-recorder-to-mp3";

export default function Recorder() {
  // const audioRecorder = new MicRecorder({ bitRate: 128 });
  // navigator.getUserMedia({ audio: true, video: false });

  useEffect(() => {
    try {
    } catch (e) {
      console.log(e);
    }
  }, []);
  return <div></div>;
}
