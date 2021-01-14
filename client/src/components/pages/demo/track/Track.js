import React, { useEffect, useState } from "react";
import "./track.css";
import * as Tone from "tone";
import { VolumeSlider } from "./VolumeSlider";
import { FaTimes } from "react-icons/fa";
import Axios from "axios";
import { useParams } from "react-router-dom";
import ErrorNotice from "components/reusable/error/Error";
// import { encodeMp3 } from 'utils/recorderUtils';

export const Track = ({ track, recorder, playingState, tracksState, demo }) => {
  const { demoId } = useParams();
  const token = localStorage.getItem("auth-token");

  const [error, setError] = useState(null);
  const [hasAudio, setHasAudio] = useState(!!track.trackSignedURL);
  const [recording, setRecording] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [volume, setVolume] = useState(0);
  const [tracks, setTracks] = tracksState;
  const [playing, setPlaying] = playingState;

  const deleteTrack = async () => {
    if (window.confirm("Remove this track?")) {
      Axios.delete(`/demos/${demoId}/tracks/${track._id}`, {
        headers: { "x-auth-token": token },
      })
        .then((res) => {
          if (res.data.error) {
            throw new Error(res.data.error);
          }
          setTracks(tracks.filter((t) => t._id !== track._id));
        })
        .catch((err) => setError(err.message));
    }
  };

  const deleteAudio = async () => {
    if (window.confirm("Remove track audio?")) {
      try {
        if (track.trackSignedURL) {
          // delete from aws!!!
          const { data: changedTrack } = await Axios.delete(
            `/demos/${demoId}/tracks/${track._id}/audio`
          );

          console.log("CHANGED TRACK", changedTrack);

          setTracks(
            tracks.map((t) => {
              if (t._id === track._id) {
                return { ...changedTrack, player: null };
              }
              return t;
            })
          );
        } else {
          setTracks(
            tracks.map((t) => {
              if (t._id === track._id) {
                return { ...track, player: null };
              }
              return t;
            })
          );
        }

        setHasAudio(false);
        setFile(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const uploadFile = async () => {
    try {
      setUploading(true);

      const s3SignedFile = await Axios.post(`/s3/signed-url`, {
        fileName: `${demoId}/${track._id}`,
        fileType: file.type,
      });

      const { signedUrl, url } = s3SignedFile.data;

      await Axios.put(signedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      await Axios.post(
        `/demos/add-signed-url`,
        { trackId: track._id, url },
        { headers: { "x-auth-token": token } }
      );

      setTracks((tracks) =>
        tracks.map((t) => {
          if (t._id === track._id) {
            console.log({ ...track, trackSignedURL: signedUrl });
            return { ...track, trackSignedURL: signedUrl };
          }
          return t;
        })
      );

      setFile(null);
      setUploading(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const startRecording = () => {
    recorder.record();
    setRecording(true);
    setPlaying(true);
  };

  const stopRecording = async () => {
    try {
      setRecording(false);
      setPlaying(false);

      recorder.stop();

      // get the blob from exportWAV
      const blob = await new Promise((resolve, reject) => {
        recorder.exportWAV((blob, err) => (blob ? resolve(blob) : reject(err)));
      });

      const localFile = new File([blob], `${track._id}.wav`, {
        type: blob.type,
        lastModified: Date.now(),
      });

      setFile(localFile);

      const fileLocation = URL.createObjectURL(localFile);

      setTracks(
        await Promise.all(
          tracks.map(async (t) => {
            if (t._id === track._id) {
              const player = await new Promise((resolve, reject) => {
                const p = new Tone.Player(fileLocation, () => {
                  if (p) resolve(p.sync().start(0).toDestination());
                  else
                    reject(
                      new Error(
                        `Could not create track from file ${localFile.name}`
                      )
                    );
                });
              });

              player.volume.value = volume;
              return { ...track, player };
            }
            return t;
          })
        )
      );

      recorder.clear();
      setHasAudio(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const volumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    if (track.player) {
      track.player.volume.value = parseInt(e.target.value);
    }
  };

  const volumeMute = () => {
    setVolume(-400);
    if (track.player) {
      track.player.volume.value = -400;
    }
  };

  const volumeMax = () => {
    setVolume(20);
    if (track.player) {
      track.player.volume.value = 20;
    }
  };

  return (
    <>
      <div className="trackContainer">
        <div className="trackTop">
          <div className="trackInfo">
            <h3 title={track.trackTitle}>{track.trackTitle}</h3>
            <div>{track.trackAuthor}</div>
          </div>

          <div className="trackWave">
            <button onClick={deleteTrack} className="deleteTrackButton">
              <FaTimes />
            </button>
            <div>{playing ? "Playing" : "Paused"}</div>
            <div>{track.player ? track.player.buffer.duration : null}</div>
          </div>
        </div>

        <div className="trackControls">
          {/* recorder is null if the user does not allow recording in browser. don't let user click start if its null */}
          {recorder && !hasAudio && (
            <>
              <button
                className="trackControlButton"
                onClick={startRecording}
                disabled={recording}
              >
                Start
              </button>
              <button
                className="trackControlButton"
                onClick={stopRecording}
                disabled={!recording}
              >
                Stop
              </button>
            </>
          )}

          {file && (
            <button
              className="trackControlButton"
              onClick={uploadFile}
              disabled={recording || uploading}
            >
              Upload
            </button>
          )}
          {hasAudio && !uploading && (
            <button className="trackControlButton" onClick={deleteAudio}>
              Delete Audio
            </button>
          )}

          <VolumeSlider
            value={volume}
            onChange={volumeChange}
            onMute={volumeMute}
            onMax={volumeMax}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: "0px 15px" }}>
          <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>
        </div>
      )}
    </>
  );
};
