import React, { useState, useEffect } from "react";
import * as Tone from "tone";

export default function AudioTimeline(
  playingState,
  track,
  scrubberTime,
  ...props
) {
  const [demoCurrentTime, setDemoCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(playingState);
  const [, setTime] = useState(Date.now());
  let tone = Tone.Transport;

  useEffect(() => {
    Tone.Transport.seconds = 0;
  }, []);

  useEffect(() => {
    setIsPlaying(playingState);
    let interval;
    if (isPlaying) {
      interval = setInterval(() => setTime(Date.now()), 50);
      setDemoCurrentTime(tone.seconds);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, playingState, tone.seconds]);
  return (
    <div className="audioColumn">
      <div className="waveform">
        <p>{demoCurrentTime}</p>
      </div>
    </div>
  );
}
