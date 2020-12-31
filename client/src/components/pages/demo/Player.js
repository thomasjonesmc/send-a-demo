import React, { useEffect, useState, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";
import * as Tone from "tone";

export default function Player(props) {
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [allArePlaying, setAllArePlaying] = useState(props.isPlaying);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const player = useRef(null);

  useEffect(() => {
    if (props.track.trackSignedURL) {
      player.current = new Tone.Player(
        props.track.trackSignedURL
      ).toDestination();
      player.current.sync().start(0);
    } else if (props.localTrack) {
      new Tone.Buffer(props.localTrack, (buffer) => {
        player.current = new Tone.Player(buffer).toDestination();
        player.current.sync().start(0);
      });
    }
    return () => {
      player.current.stop();
    };
  }, [props.track, props.localTrack]);

  useEffect(() => {
    if (player.current && player.current.isPlaying) player.current.stop();
  }, []);

  // useEffect(() => {
  //   setAllArePlaying(props.isPlaying);
  //   if (player.current) {
  //     allArePlaying ? Tone.Transport.start() : Tone.Transport.pause();
  //     // ? Tone.Transport.start() && setIsPlaying(true)
  //     // : Tone.Transport.pause() && setIsPlaying(false);
  //   }
  // }, [props.isPlaying, allArePlaying]);

  useEffect(() => {
    if (player.current) {
      isMuted
        ? (player.current.volume.value = -100)
        : (player.current.volume.value = props.volume);
    }
  }, [props.volume, isMuted]);

  // let handleClick = () => {
  //   setIsPlaying(!isPlaying);
  //   !isPlaying ? player.current.start() : player.current.stop();
  // };

  return (
    <>
      <button
        className="blackBtn"
        onClick={() => {
          setIsMuted(!isMuted);
        }}
      >
        {!isMuted ? "Mute" : "Unmute"}
      </button>
      {/* {props.track.trackSignedURL || props.localTrack ? (
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
      )} */}
    </>
  );
}
