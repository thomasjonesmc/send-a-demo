import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import './audioScrubber.css';

export const AudioScrubber = ({
  demoLength,
  timeState: [currentTime, setCurrentTime],
  playingState: [playing, setPlaying],
}) => {
  const [playingOnPickup, setPlayingOnPickup] = useState(false);
  const audioTimeChange = (time) => {
    Tone.Transport.seconds = time;
    setCurrentTime(time);
  };

  useEffect(() => {
    let interval;
    if (playing && Tone.Transport.seconds <= demoLength) {
      interval = setInterval(() => {
        setCurrentTime(Tone.Transport.seconds);
      }, 1);
    }
    return () => {
      clearInterval(interval);
    };
  }, [setCurrentTime, playing, demoLength]);

  const scrubStart = () => {
    setPlayingOnPickup(playing);
    setPlaying(false);
    Tone.Transport.pause();
  };

  const scrubEnd = () => {
    setPlaying(playingOnPickup);
    if (playingOnPickup) {
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
  }

  const toMinutesAndSeconds = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    if (seconds < 10) {
      return (`${minutes}:0${parseFloat(seconds).toFixed(2)}`)  
    } else {
      return (`${minutes}:${parseFloat(seconds).toFixed(2)}`)
    }
  }

  return (
    <>
      <div className="scrubberTimeContainer">
        <p>{toMinutesAndSeconds(currentTime)}</p>
        <p>-{demoLength - currentTime > 0.001 ? toMinutesAndSeconds(demoLength - currentTime) : `0:00.00`}</p>
      </div>

      <input
        className="audioScrubber"
        style={{ marginTop: "15px" }}
        type="range"
        min={0}
        max={demoLength}
        value={currentTime}
        step={0.001}
        onTouchStart={scrubStart}
        onTouchEnd={scrubEnd}
        onMouseDown={scrubStart}
        onChange={(e) => audioTimeChange(e.target.value)}
        onMouseUp={scrubEnd}
      />
    </>
  );
};