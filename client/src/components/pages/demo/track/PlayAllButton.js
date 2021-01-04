import React, { useEffect } from "react";
import { Button } from "components/reusable/button/Button";
import { FaPlay, FaPause } from "react-icons/fa";
import * as Tone from "tone";

export const PlayAllButton = ({
  playingState: [isPlaying, setIsPlaying],
  demoLength,
}) => {
  useEffect(() => {
    isPlaying ? Tone.Transport.start() : Tone.Transport.pause();
  }, [isPlaying]);

  return (
    <div className="centerInDiv">
      <Button onClick={() => setIsPlaying(!isPlaying)} className="bigBtn">
        {isPlaying ? <FaPause /> : <FaPlay />}
      </Button>
    </div>
  );
};

export default PlayAllButton;
