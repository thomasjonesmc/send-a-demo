import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import * as Tone from "tone";

export default function Player(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [allArePlaying, setAllArePlaying] = useState(props.isPlaying);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useRef(null);

  useEffect(() => {
    if (props.track.trackSignedURL) {
      player.current = new Tone.Player(
        props.track.trackSignedURL
      ).toDestination();
    } else if (props.localTrack) {
      new Tone.Buffer(props.localTrack, (buffer) => {
        player.current = new Tone.Player(buffer).toDestination();
      });
    }
    setIsLoaded(true);
    return () => {
      player.current.stop();
    };
  }, [props.track, props.localTrack]);

  useEffect(() => {
    if (player.current && player.current.isPlaying) player.current.stop();
  }, []);

  useEffect(() => {
    setAllArePlaying(props.isPlaying);
    if (player.current) {
      allArePlaying
        ? player.current.start() && setIsPlaying(true)
        : player.current.stop() && setIsPlaying(false);
    }
  }, [props.isPlaying, allArePlaying]);

  useEffect(() => {
    if (player.current) {
      player.current.volume.value = props.volume;
    }
  }, [props.volume]);
  let handleClick = () => {
    setIsPlaying(!isPlaying);
    !isPlaying ? player.current.start() : player.current.stop();
  };

  return (
    <>
      {props.track.trackSignedURL || props.localTrack ? (
        <button
          disabled={!isLoaded}
          className="btnComp"
          onClick={() => handleClick()}
        >
          {isPlaying ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )}
        </button>
      ) : (
        ""
      )}
    </>
  );
}
