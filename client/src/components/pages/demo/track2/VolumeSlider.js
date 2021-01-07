import React from "react";
import { MdVolumeDown, MdVolumeUp } from "react-icons/md";

export const VolumeSlider = (props) => (
  <div className="volumeSliderContainer">
    <MdVolumeDown tabIndex="0"/>
    <input
      className="volumeSlider"
      type="range"
      min={-20}
      max={20}
      step={1}
      value={props.value}
      onChange={props.onChange}
      {...props}
    />
    <MdVolumeUp tabIndex="0"/>
  </div>
)