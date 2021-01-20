import React, { useEffect } from 'react'
import WaveSurfer from 'wavesurfer.js';

export const Waveform = ({track, demoLength}) => {
  let pctFromLeft;
  let waveWidth;
  let styleTag;
  console.log(track);
  if (track.player) {


    if (track.trackStart) pctFromLeft = `${track.trackStart / demoLength * 100}%`
    else pctFromLeft = 0;
    waveWidth = `${track.player.buffer.duration / demoLength * 100}%`;
    styleTag = {left: pctFromLeft, width: waveWidth};
  }

  console.log(track.player);

  // console.log(track.player._buffer._buffer);

  // useEffect(() => {
  //   if (track.player) {
  //     setTimeout(() => {
  //       let waveform = WaveSurfer.create({
  //         barWidth: 1,
  //         height: 100,
  //         responsive: true,
  //         container: `#wave${track._id}`,
  //       });
    
  //       waveform.load(track.trackSignedURL);
  //     }, 100)
  //   }
    
  // }, [track.trackSignedURL, track._id, track.player])


  return (
    <div id={`wave${track._id}`} style={styleTag}>
      
    </div>
  )
}

// style={{ left: pctFromLeft, right: pctFromRight }}