import { Button } from "components/reusable/button/Button";
import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

export default function Player({
  track,
  localTrack,
  volume,
  trackBeingRecorded,
  ...props
}) {
  const [isMuted, setIsMuted] = useState(false);
  const player = useRef(null);

  useEffect(() => {
    if (track.trackSignedURL) {
      player.current = new Tone.Player(track.trackSignedURL, () => {
        player.current.sync().start(0).toDestination();
      });
    } else if (localTrack) {
      new Tone.Buffer(localTrack, (buffer) => {
        player.current = new Tone.Player(buffer).toDestination();
        player.current.sync().start(0);
      });
    }
    return () => {
      player.current.disconnect();
      player.current = null;
    };
  }, [track, localTrack]);

  // useEffect(() => {
  //   if (player.current && player.current.isPlaying) player.current.stop();
  // }, []);

  useEffect(() => {
    if (player.current) {
      isMuted
        ? (player.current.volume.value = -400)
        : (player.current.volume.value = volume);
    }
  }, [volume, isMuted]);

  return (
    <>
      <Button onClick={() => setIsMuted(!isMuted)}>
        {!isMuted ? "Mute" : "Unmute"}
      </Button>
    </>
  );
}
