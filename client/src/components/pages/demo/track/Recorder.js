import React, { useState } from "react";

import Axios from "axios";
import { RedButton, GreenButton } from "components/reusable/button/Button";
import { BiMicrophone } from "react-icons/bi";
import {
  encodeMp3,
  exportWav,
  startRecording,
  stopRecording,
} from "utils/recorderUtils";

export default function Recorder({
  track,
  demoid,
  localTrackState: [localTrack, setLocalTrack],
  setLocalBuffer,
  refreshDemo,
  trackIsRecording,
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  let token = localStorage.getItem("auth-token");

  let start = () => {
    startRecording();
  };

  let stop = async (trackId) => {
    console.log(stopRecording());
    let wavBlob = await exportWav();
    let mp3Blob = await encodeMp3(wavBlob);

    const file = new File(mp3Blob, `${trackId}.mp3`, {
      type: mp3Blob.type,
      lastModified: Date.now(),
    });
    setFile(file);
    setLocalBuffer(file);
  };

  let handleAudioFile = async (audio) => {
    let file = audio;
    let fileName = `${demoid}/${audio.name}`;
    let fileType = audio.type;
    let url;
    setUploading(true);

    console.log("Signing file...");
    const signFile = await Axios.post("/sign-file", {
      fileName: fileName,
      fileType: fileType,
    });
    const returnData = signFile.data.data.returnData;
    const signedRequest = returnData.signedRequest;
    url = returnData.url;
    const options = {
      headers: {
        "Content-Type": fileType,
      },
    };

    console.log("Uploading file...");
    await Axios.put(signedRequest, file, options);

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
        <BiMicrophone />
      </RedButton>
    );
  } else if (localTrack) {
    return (
      <>
        <GreenButton onClick={() => handleAudioFile(file)}>
          {uploading ? "Uploading..." : "Upload"}
        </GreenButton>
        <RedButton onClick={() => setLocalTrack(null)}>Delete Audio</RedButton>
      </>
    );
  } else {
    return (
      <DeleteAudioFromS3
        track={track}
        path={`${demoid}/${track._id}`}
        refreshDemo={refreshDemo}
      />
    );
  }
}

const DeleteAudioFromS3 = ({ track, path, refreshDemo }) => {
  let token = localStorage.getItem("auth-token");
  const [deleteingAudio, setDeleteingAudio] = useState(false);
  let confirmPopup = async (trackId) => {
    if (
      window.confirm(
        `Are you sure you want to delete the audio from your track ${track.trackTitle}?`
      )
    ) {
      setDeleteingAudio(true);
      await deleteFromS3(trackId);
      refreshDemo();
    }
  };
  const deleteFromS3 = async () => {
    try {
      console.log(`Deleting ${path}...`);
      await Axios.post(`/delete-track-s3`, {
        key: path,
      });
      console.log(`${path} deleted from AWS`);
      console.log(`Removing URL information from track...`);
      await Axios.post(
        "/demos/remove-s3-url",
        {
          _id: track._id,
        },
        { headers: { "x-auth-token": token } }
      );
      console.log("Done.");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <RedButton
      onClick={async () => {
        await confirmPopup(track._id);
      }}
    >
      {deleteingAudio ? "Deleting..." : "Delete Audio"}
    </RedButton>
  );
};
