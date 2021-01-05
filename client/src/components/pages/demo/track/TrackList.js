import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import "components/pages/demo/track/tracklist.css";
import PlayAllButton from "components/pages/demo/track/PlayAllButton";
import Dropdown from "components/reusable/dropdown/Dropdown";
import AudioTimeline from "components/pages/demo/track/AudioTimeline";
import Controls from "components/pages/demo/track/Controls";
import { Button, RedButton } from "components/reusable/button/Button";
import fetchTracks from "utils/fetchTracks";
import * as Tone from "tone";

export default function TrackList({ tracks, demoid, ...props }) {
  //Tone.start() enables audio to be played on mobile browsers

  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIsRecording, setTrackIsRecording] = useState({
    recording: false,
    track: null,
  });
  const recording = trackIsRecording.recording;
  const [loading, setLoading] = useState(true);
  const tracksAndPlayers = useRef(null);
  const demoLength = useRef(0);

  useEffect(() => {
    try {
      if (recording) setIsPlaying(true);
      if (!recording) {
        setTrackIsRecording({ recording: false, track: null });
      }
    } catch (e) {
      console.log(e);
    }
  }, [recording, isPlaying]);

  useEffect(() => {
    let mapTracksAndPlayers = async () => {
      const fetchedResults = await fetchTracks(tracks);
      tracksAndPlayers.current = fetchedResults;
    };

    let getDemoLength = async () => {
      if (tracksAndPlayers.current !== null) {
        let hasPlayer = tracksAndPlayers.current.filter((data) => data[1]);
        let players = hasPlayer.map((data) => data[1]);
        players.forEach((player) => {
          if (player.buffer.duration > demoLength.current) {
            demoLength.current = player.buffer.duration;
          }
        });
        setLoading(false);
        Tone.start();
      }
    };

    mapTracksAndPlayers().then(getDemoLength());
  }, [tracks]);

  if (loading) {
    return "Loading";
  } else {
    return (
      <div>
        <PlayAllButton
          playingState={[isPlaying, setIsPlaying]}
          demoLength={demoLength.current}
        />
        {tracksAndPlayers.current.map((track) => (
          <Track
            key={track[0]._id}
            player={track[1]}
            track={track[0]}
            demoid={demoid}
            playingState={[isPlaying, setIsPlaying]}
            recordingState={[trackIsRecording, setTrackIsRecording]}
            {...props}
          />
        ))}
      </div>
    );
  }
}

const Track = ({
  track,
  playingState,
  recordingState,
  player,
  demoid,
  ...props
}) => {
  return (
    <div className="centerInDiv">
      <div key={track._id} className="trackContainer">
        <InfoColumn
          track={track}
          demoid={demoid}
          playingState={playingState}
          {...props}
        />
        <AudioTimeline playingState={playingState.isPlaying} track={track} />
        <div className="break"></div>
        <div className="infoSmall">&nbsp;</div>

        <Controls
          track={track}
          recordingState={recordingState}
          playingState={playingState}
          player={player}
          demoid={demoid}
          {...props}
        />
      </div>
    </div>
  );
};

const InfoColumn = ({ track, playingState: [isPlaying], demoid, ...props }) => {
  const [showMenu, setShowMenu] = useState();
  const token = localStorage.getItem("auth-token");

  let confirmPopup = (track) => {
    if (
      window.confirm(
        `Are you sure you want to delete your track ${track.trackTitle}?`
      )
    ) {
      deleteTrack(track);
    }
  };

  const deleteTrack = async (track) => {
    try {
      console.log(`Deleting ${track.trackTitle}...`);
      await Axios.delete(`/demos/delete-track/`, {
        headers: {
          "x-auth-token": token,
        },
        data: {
          _id: track._id,
        },
      });
      await deleteFromS3();
      console.log(`${track.trackTitle} removed!`);
      props.refreshDemo();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteFromS3 = async () => {
    try {
      await Axios.post(`/delete-track-s3`, {
        key: `${demoid}/${track._id}`,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="infoColumn">
      <h4>{track.trackTitle}</h4>
      <p>{track.trackAuthor}</p>
      <div>
        <Button onClick={() => setShowMenu(!showMenu)} className="smallBtn">
          ...
        </Button>

        <div className="dropdownParent">
          {showMenu ? (
            <Dropdown>
              <RedButton onClick={(e) => confirmPopup(track)}>
                Delete Track
              </RedButton>
            </Dropdown>
          ) : null}
        </div>
      </div>
    </div>
  );
};
