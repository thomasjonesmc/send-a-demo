import React, { useEffect, useState, useRef } from "react";
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
    allArePlaying
      ? player.current.start() && setIsPlaying(true)
      : player.current.stop() && setIsPlaying(false);
  }, [props.isPlaying, allArePlaying]);

  console.log(player);
  let handleClick = () => {
    setIsPlaying(!isPlaying);
    !isPlaying ? player.current.start() : player.current.stop();
  };
  return (
    <div className="pageTitle">
      <button
        disabled={!isLoaded}
        className="btnComp"
        onClick={() => handleClick()}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}
