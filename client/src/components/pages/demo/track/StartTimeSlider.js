import React, { useEffect, useRef, useState } from 'react';

export const StartTimeSlider = ({track, demoLength, setTracks}) => {

    const [ start, setStart ] = useState(0);
    const maxStart = track.player ? demoLength - track.player.buffer.duration : 0;

    const timeout = useRef(null);

    // any time the track start changes, update the start
    useEffect(() => {
        setStart(track.trackStart);
    }, [track.trackStart]);

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
            console.log("It's been 1 second since we adjusted the start time");

            // if the track has a URL we know it has been uploaded to the database before
            if (track.trackSignedURL) {
                console.log("Make an Axios request to update the track's trackStart so it persists across refresh");
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

    return <div style={{padding: "10px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        {start !== null && <>
            <input type="range" step={.001} min={0} max={maxStart} value={start} onChange={e => startChange(e.target.value)} />
            <button onClick={() => startChange(start - .001)}>Minus 0.001</button>
            <button onClick={() => startChange(start + .001)}>Plus 0.001</button>
            <div>Start {start.toFixed(3)}</div>
        </>}
    </div>
}