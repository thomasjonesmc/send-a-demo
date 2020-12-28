import React, { useState } from "react";

export default function VolumeSlider(props) {
  return (
    <input
      type="range"
      value={props.value}
      onChange={props.volume}
      {...props}
    />
  );
}
