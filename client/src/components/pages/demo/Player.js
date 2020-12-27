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
    }
    setIsLoaded(true);
  }, [props.track]);

  useEffect(() => {
    setAllArePlaying(props.isPlaying);
    if (player.current) {
      allArePlaying
        ? player.current.start() && setIsPlaying(true)
        : player.current.stop() && setIsPlaying(false);
    }
  }, [props.isPlaying, allArePlaying]);

  console.log(player);
  let handleClick = () => {
    setIsPlaying(!isPlaying);
    !isPlaying ? player.current.start() : player.current.stop();
  };
  return (
    <div className="pageTitle">
      {props.track.trackSignedURL ? (
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
    </div>
  );
}
