import React from "react";
import "components/pages/demo/track/volumeSlider.css";

export default function VolumeSlider(props) {
  return (
    <input
      className="slider"
      type="range"
      min={-20}
      max={20}
      step={1}
      value={props.value}
      onChange={props.volume}
      {...props}
    />
  );
}
