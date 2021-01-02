import React from "react";
import "components/pages/demo/track/volumeSlider.css";
import { MdVolumeDown, MdVolumeUp } from "react-icons/md";

export default function VolumeSlider(props) {
  return (
    <div>
      <span>
        <MdVolumeDown />
      </span>
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
      <span>
        <MdVolumeUp />
      </span>
    </div>
  );
}
