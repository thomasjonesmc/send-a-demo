// This waveform was made with the help of this guide:
// https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/
import React, { useEffect, useRef, useState } from 'react'
import { Scrubber } from 'components/pages/demo/Scrubber';

export const Waveform = ({
  track,
  demoLength,
  timeState: [currentTime, setCurrentTime],
  playingState: [playing, setPlaying]
}) => {
  let trackStart;
  let trackWidth;

  const [ filteredData, setFilteredData ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  //Get audio buffer from Tone Player and add all the samples to an array
  useEffect(()=> {
    const filterData = audioBuffer => {
      //Turn buffer into array of samples
      const rawData = audioBuffer.getChannelData(0);
      /*
        Here we set the samples based on the length of the demo.
        for example, if we were to set the samples to one hard value like 8
        on a demo that is 1:30 then the waveform would look very condensed and gross.

        This could probably be done in a better way.
      */
      let samples = Math.floor(track.player.buffer.duration);
      if (demoLength < 60) {
        samples = samples * 6.5;
      } else if (demoLength > 60 && demoLength <= 120 ) {
        samples = samples * 3;
      } else {
        samples = samples * 1.5;
      }
      //Taking that large array and turning it into a much smaller one by dividing by the sample rate we set above
      const blockSize = Math.floor(rawData.length / samples); 
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum = sum + Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }
      setFilteredData(filteredData);
      setLoading(false);
    }
    filterData(track.player.buffer);
  }, [track.player, demoLength])
  
  //Setting up variables for positioning the tracks.
  //if the track has a trackStart time, its starting position will be X percent through the track, else start is at beginning
  if (track.trackStart) trackStart = `${track.trackStart / demoLength * 100}%`
  else trackStart = 0;
  //trackWidth defines how wide the waveform should be
  trackWidth = `${track.player.buffer.duration / demoLength * 100}%`;


  return (
    <div>
      {/* Scrubber is absolutely positioned over the waveform */}
      <Scrubber 
        timeState={[currentTime, setCurrentTime]}
        demoLength={demoLength}
        playingState={[playing, setPlaying]}
        scrubberType={"trackScrubber"}
      />
      <div style={{left: trackStart, position: "relative"}}>  
        {!loading ? (
          <RenderedWaveform filteredData={filteredData} trackWidth={trackWidth} />
        ) : "Loading waveform data..." }
      </div>
    </div>
  )
}

const RenderedWaveform = ({filteredData, trackWidth}) => {
  const canvasRef = useRef(null);
  useEffect(() => {

    //Draw the waveform
    const draw = filteredData => {
      const canvas = canvasRef.current;
      canvas.style.width= trackWidth;
      canvas.style.height= 100;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight / 1.25;
      const ctx = canvas.getContext("2d");
      ctx.scale(1, 1);
      //Makes waveform appear in middle of canvas rather than the bottom
      ctx.translate(0, canvas.offsetHeight / 2); 
      // Draw the line segments
      const width = canvas.offsetWidth / filteredData.length;
      for (let i = 0; i < filteredData.length; i++) {
        const x = width * i;
        let height = filteredData[i] * canvas.offsetHeight;
        if (height < 0) {
            height = 0;
        } else if (height > canvas.offsetHeight / 2) {
            height = height > canvas.offsetHeight / 2;
        }
        drawLineSegment(ctx, x, height, width, (i + 1) % 2);
      }
    }
    const drawLineSegment = (ctx, x, y, width, isEven) => {
      ctx.lineWidth = 1; // how thick the line is
      ctx.strokeStyle = "#000"; // what color our line is
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, -y);
      ctx.stroke();
      ctx.lineTo(x + width, 0);
    };
    draw(filteredData);
  }, [filteredData, trackWidth])
  
  return <canvas ref={canvasRef} />
}