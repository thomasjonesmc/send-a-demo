import React, { useMemo, useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import Axios from "axios";
import { RedButton, GreenButton } from "components/reusable/button/Button";

export default function Recorder({
  track,
  demoId,
  localTrackState: [localTrack, setLocalTrack],
  setLocalBuffer,
  refreshDemo,
  trackIsRecording,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState(null);
  let token = localStorage.getItem("auth-token");

  const recorder = useMemo(
    () =>
      new MicRecorder({
        bitRate: 128,
        encodeAfterRecordCheck: true,
      }),
    []
  );

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
        setFile(file);
        setLocalBuffer(file);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  let handleAudioFile = async (audio) => {
    let file = audio;
    let fileName = `${demoId}/${audio.name}`;
    let fileType = audio.type;
    let url;

    await Axios.post("/sign-file", {
      fileName: fileName,
      fileType: fileType,
    })
      .then(async (res) => {
        const returnData = res.data.data.returnData;
        const signedRequest = returnData.signedRequest;
        url = returnData.url;
        const options = {
          headers: {
            "Content-Type": fileType,
          },
        };
        console.log(`Uploading file...`);
        await Axios.put(signedRequest, file, options)
          .then((result) => {}, console.log("File uploaded"))
          .catch((e) => {
            alert("Error: " + JSON.stringify(e));
          });
      })
      .then(() => {
        console.log(url);
        Axios.post(
          "/demos/add-signed-URL",
          {
            _id: track._id,
            URL: url,
          },
          { headers: { "x-auth-token": token } }
        );
        console.log("Signed URL added to Track");
        refreshDemo();
      })
      .catch((e) => {
        alert("Unexpected error: " + JSON.stringify(e));
      });
  };

  if (!track.trackSignedURL && !localTrack) {
    return (
      <RedButton
        className="redBtn"
        onClick={() => {
          trackIsRecording();
          setIsRecording(!isRecording);
          if (!isRecording) {
            start();
          } else {
            stop(track._id);
            setIsRecording(false);
            trackIsRecording();
          }
        }}
      >
        {!isRecording ? "Start " : "Stop "}
        <FontAwesomeIcon icon={faMicrophone} size="lg" color="red" />
      </RedButton>
    );
  } else if (localTrack) {
    return (
      <>
        <GreenButton onClick={() => handleAudioFile(file)}>Upload</GreenButton>
        <RedButton onClick={() => setLocalTrack(null)}>Delete Audio</RedButton>
      </>
    );
  } else {
    return (
      <DeleteAudioFromS3
        track={track}
        path={`${demoId}/${track._id}`}
        refreshDemo={refreshDemo}
      />
    );
  }
}

const DeleteAudioFromS3 = ({ track, path, refreshDemo }) => {
  let token = localStorage.getItem("auth-token");
  const deleteFromS3 = async () => {
    try {
      console.log(`Deleting ${path}...`);
      await Axios.post(`/delete-track-s3`, {
        key: path,
      }).then(async () => {
        console.log(`${path} deleted from AWS`);
        console.log(`Removing URL information from track...`);
        await Axios.post(
          "/demos/remove-s3-url",
          {
            _id: track._id,
          },
          { headers: { "x-auth-token": token } }
        );
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <RedButton
      onClick={async () => {
        await deleteFromS3(track._id).then(refreshDemo);
      }}
    >
      Delete Audio
    </RedButton>
  );
};
