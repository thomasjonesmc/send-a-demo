import React, { useMemo, useState, useEffect } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";

export default function Recorder(props) {
  const [isRecording, setIsRecording] = useState(false);
  let token = localStorage.getItem("auth-token");

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  let start = () => {
    recorder
      .start()
      .then(() => {
        console.log("recording");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  let stop = (trackId) => {
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const file = new File(buffer, `${trackId}.mp3`, {
          type: blob.type,
          lastModified: Date.now(),
        });
        console.log(file);
        handleAudioFile(file);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  let handleAudioFile = (audio) => {
    let file = audio;
    let fileName = `${props.demoId}/${audio.name}`;
    let fileType = audio.type;
    let url;

    Axios.post("/sign-file", {
      fileName: fileName,
      fileType: fileType,
    })
      .then((res) => {
        const returnData = res.data.data.returnData;
        const signedRequest = returnData.signedRequest;
        url = returnData.url;
        const options = {
          headers: {
            "Content-Type": fileType,
          },
        };
        Axios.put(signedRequest, file, options)
          .then((result) => {}, console.log("file uploaded"))
          .catch((e) => {
            alert("Error: " + JSON.stringify(e));
          });
      })
      .then(() => {
        console.log(url);
        Axios.post(
          "/demos/add-signed-URL",
          {
            _id: props.track._id,
            URL: url,
          },
          { headers: { "x-auth-token": token } }
        );
        console.log("Signed URL added to Track");
        props.onUpload();
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
  };

  return (
    <div>
      <button
        className="recBtn"
        onClick={() => {
          props.trackIsRecording();
          setIsRecording(!isRecording);
          if (!isRecording) {
            start();
          } else {
            stop(props.track._id);
          }
        }}
      >
        {!isRecording ? "Start " : "Stop "}
        <FontAwesomeIcon icon={faMicrophone} size="lg" color="red" />
      </button>
    </div>
  );
}
