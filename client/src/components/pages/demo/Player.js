import { Button } from "components/reusable/button/Button";
import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

export default function Player(props) {
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
      player.current.disconnect();
      player.current = null;
    };
  }, [props.track, props.localTrack]);

  useEffect(() => {
    if (player.current && player.current.isPlaying) player.current.stop();
  }, []);

  useEffect(() => {
    if (player.current) {
      isMuted
        ? (player.current.volume.value = -400)
        : (player.current.volume.value = props.volume);
    }
  }, [props.volume, isMuted]);

  return (
    <>
      <Button onClick={() => setIsMuted(!isMuted)}>
        {!isMuted ? "Mute" : "Unmute"}
      </Button>
    </>
  );
}
