import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

export const StartTimeSlider = ({track, demoLength, setTracks, startTimeState}) => {

    const [ start, setStart ] = startTimeState;
    const maxStart = track.player ? demoLength - track.player.buffer.duration : 0;

    const timeout = useRef(null);

    // clear the timeout on unmount
    useEffect(() => {
        return () => clearTimeout(timeout);
    }, []);

    const startChange = (startValue) => {

        // do nothing if the startValue is out of our acceptable range
        // might want to change this in future to allow for moving the start before or after the demo to cut off some parts
        if (startValue < 0 || startValue > demoLength) { return; }

        clearTimeout(timeout.current);

        timeout.current = setTimeout(() => {
            // if the track has a URL we know it has been uploaded to the database before
            if (track.trackSignedURL) {
                axios.post(`/demos/modify-track-start-time`, {
                    trackId: track._id,
                    startTime: startValue
                });
            }
        }, 1000);

        const newStart = parseFloat(startValue);

        setStart(newStart);

        // update the changed track
        setTracks(tracks => tracks.map(t => {
            if (t._id === track._id) {
                return { ...t, trackStart: newStart };
            }
            return t;
        }))

        // update the player's start time to the new time. If we don't unsync we get an error trying to set a new start time
        track.player.unsync().stop().sync().start(newStart);
    }

    // if the track has no startTime or the maxStart is 0 (meaning it can not be changed to anything since its stuck at 0)
    if (start === null || maxStart <= 0) return null;

    return <div className="startSliderContainer">
        <button className="startSliderButton" onClick={() => startChange(start - .001)}>
            <FaPlus />
        </button>
        <button className="startSliderButton" onClick={() => startChange(start + .001)}>
            <FaMinus />
        </button>
        <input className="startSlider" type="range" step={.001} min={0} max={maxStart} value={start} onChange={e => startChange(e.target.value)} />
        <div className="startSliderTime">{start.toFixed(3)}</div>
    </div>
}