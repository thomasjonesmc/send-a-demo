import { Button } from "components/reusable/button/Button";
import React, { useEffect, useState, useRef } from "react";
import * as Tone from "tone";

export default function Player({
  track,
  localTrack,
  volume,
  trackBeingRecorded,
  player,
  ...props
}) {
  const [isMuted, setIsMuted] = useState(false);
  const tonePlayer = useRef(null);

  useEffect(() => {
    if (track.trackSignedURL) {
      tonePlayer.current = player.sync().start(0).toDestination();
    } else if (localTrack) {
      new Tone.Buffer(localTrack, (buffer) => {
        tonePlayer.current = new Tone.Player(buffer).toDestination();
        tonePlayer.current.sync().start(0);
      });
    }
    return () => {
      tonePlayer.current.disconnect();
      tonePlayer.current = null;
    };
  }, [track, localTrack, player]);

  useEffect(() => {
    if (tonePlayer.current) {
      isMuted
        ? (tonePlayer.current.volume.value = -400)
        : (tonePlayer.current.volume.value = volume);
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
