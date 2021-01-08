import React from "react";
import { MdVolumeDown, MdVolumeUp, MdVolumeOff } from "react-icons/md";

export const VolumeSlider = ({onMute, onMax, ...rest}) => (
  <div className="volumeSliderContainer">
    {
      rest.value > -20 ?
        <MdVolumeDown onClick={onMute} tabIndex="0"/>
        :
        <MdVolumeOff onClick={onMute} tabIndex="0"/>
    }
    <input
      className="volumeSlider"
      type="range"
      min={-20}
      max={20}
      step={1}
      {...rest}
    />
    <MdVolumeUp onClick={onMax} tabIndex="0"/>
  </div>
)