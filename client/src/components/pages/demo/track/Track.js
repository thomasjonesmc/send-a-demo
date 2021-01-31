import React, { useState, useMemo, useEffect } from "react";
import "./track.css";
import * as Tone from "tone";
import { VolumeSlider } from "./VolumeSlider";
import { FaTimes } from "react-icons/fa";
import Axios from "axios";
import { useParams } from "react-router-dom";
import ErrorNotice from "components/reusable/error/Error";
import MicRecorder from "mic-recorder-to-mp3";
import { Waveform } from "./Waveform";

export const Track = ({
  track,
  playingState,
  timeState:[currentTime, setCurrentTime],
  tracksState,
  demo,
  demoLength,
  lengthState: [trackLengths, setTrackLengths]
}) => {
  const { demoId } = useParams();
  const token = localStorage.getItem("auth-token");

  const [error, setError] = useState(null);
  const [hasAudio, setHasAudio] = useState(!!track.trackSignedURL);
  const [startTime, setStartTime] = useState(null);
  const [recording, setRecording] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [volume, setVolume] = useState(0);
  const [tracks, setTracks] = tracksState;
  const [playing, setPlaying] = playingState;

  const recorder = useMemo(() => new MicRecorder({ bitRate: 128 }), []);

  useEffect(() => {
    return () => {
      if (track.player) track.player.unsync();
    }
  }, [track.player])

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
          setTrackLengths(trackLengths.filter(length => length.id !== track._id));
        })
        .catch((err) => setError(err.message));
    }
  };

  const deleteAudio = async () => {
    if (window.confirm("Remove track audio?")) {
      try {
        if (track.trackSignedURL) {
          // delete from aws!!!
          const { data: changedTrack } = await Axios.delete(`/demos/${demoId}/tracks/${track._id}/audio`);
          await Axios.post("/demos/modify-track-start-time", {trackId: track._id, startTime: null});
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

        //Remove selected track from trackLengths
        setTrackLengths(trackLengths.filter(length => length.id !== track._id));
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

      await Axios.post(`/demos/add-signed-url`, { trackId: track._id, url }, { headers: { "x-auth-token": token } });
      // sending request to update track start time on upload
      await Axios.post("/demos/modify-track-start-time", {trackId: track._id, startTime: startTime});
      setTracks((tracks) =>
        tracks.map((t) => {
          if (t._id === track._id) {
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
    try {
      // Setting start time of track and
      setStartTime(currentTime);
      recorder.start();
      //Only Firefox has this property on AudioContext, so it will only be in sync for Firefox
      //This is a temporary fix, hopefully we find a way to sync on all browsers soon
      if (Tone.Transport.context._context._nativeAudioContext.outputLatency) {
        Tone.Transport.seconds = currentTime - (recorder.context.outputLatency * 2);
      }
      setRecording(true);
      setPlaying(true);     
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = async () => {
    try {
      setRecording(false);
      setPlaying(false);
      let localFile;
      let fileLocation;
      await recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
         localFile = new File(buffer, `${track._id}.mp3`, {
          type: blob.type,
          lastModified: Date.now(),
        });
        setFile(localFile);
        fileLocation = URL.createObjectURL(localFile);
      })

      setTracks(
        await Promise.all(
          tracks.map(async (t) => {
            if (t._id === track._id) {
              const player = await new Promise((resolve, reject) => {
                const p = new Tone.Player(fileLocation, () => {
                  if (p) {
                    resolve(p.sync().start(startTime).toDestination());
                  }
                  else reject(new Error(`Could not create track from file ${localFile.name}`));
                });
              });
              //Adds the duration of the recorded buffer to trackLengths.
              // When we add start time for tracks we will have to add that
              // to the player.buffer.duration to get the length
              if (trackLengths) setTrackLengths([...trackLengths, {id: track._id, length: startTime + player.buffer.duration}]);
              else setTrackLengths([{id: track._id, length: startTime + player.buffer.duration}]);
              player.volume.value = volume;
              return { ...track, player, trackStart: startTime };
            }
            return t;
          })
        )
      );

      setHasAudio(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const volumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    if (track.player) {
      if (parseInt(e.target.value) === -20) {
        setVolume(-400);
        track.player.volume.value = -400;
      } 
      else track.player.volume.value = parseInt(e.target.value);
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
            {track.player ? <Waveform
                              track={track}
                              demoLength={demoLength}
                              timeState={[currentTime, setCurrentTime]}
                              playingState={[playing, setPlaying]}
                            /> : null}
            <button onClick={deleteTrack} className="deleteTrackButton">
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="trackControls">
          {/* recorder is null if the user does not allow recording in browser. don't let user click start if its null */}
          {recorder && !hasAudio && (
            <>
              <button className="trackControlButton" onClick={startRecording} disabled={recording}>
                Start
              </button>
              <button className="trackControlButton" onClick={stopRecording} disabled={!recording}>
                Stop
              </button>
            </>
          )}

          {file && (
            <button className="trackControlButton" onClick={uploadFile} disabled={recording || uploading}>
              Upload
            </button>
          )}
          {hasAudio && !uploading && (
            <button className="trackControlButton" onClick={deleteAudio}>
              Delete Audio
            </button>
          )}

          <VolumeSlider value={volume} onChange={volumeChange} onMute={volumeMute} onMax={volumeMax} />
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
