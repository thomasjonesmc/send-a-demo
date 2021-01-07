import { Button, RedButton } from 'components/reusable/button/Button';
import React, { useEffect, useState } from 'react';
import './track.css';
import * as Tone from 'tone';
import { VolumeSlider } from './VolumeSlider';
import { FaEllipsisH, FaTimes } from 'react-icons/fa';

export const Track = ({track, playing}) => {

    const [ showOptions, setShowOptions ] = useState(false);

    const controlButtonStyle = {
        marginLeft: "10px"
    }

    useEffect(() => {

        if (track.player) {
            Tone.loaded().then(() => {
                playing ? track.player.start() : track.player.stop();
            });
        }
    }, [playing, track.player]);

    const deleteTrack = () => {
        if (window.confirm("Remove this track?")) {
            console.log("Track Removed");
        }
    }

    const deleteAudio = () => {
        if (window.confirm("Remove track audio?")) {
            console.log("Track Audio Removed");
        }
    }

    return (
        <div className="trackContainer">

            <div className="trackTop">
                <div className="trackInfo">
                    <h3>{track.trackTitle}</h3>
                    <div>{track.trackAuthor}</div>
                </div>

                <div className="trackWave">
                    <button onClick={deleteTrack} className="deleteTrackButton">
                        <FaTimes />
                    </button>
                    {playing ? "Playing" : "Paused"}
                </div>
            </div>

            <div className="trackControls">
                <Button onClick={() => setShowOptions(s => !s)}>
                    {showOptions ? <FaTimes/> : <FaEllipsisH/>}
                </Button>
                {showOptions && <>
                    <RedButton onClick={deleteAudio} style={controlButtonStyle}>Delete Audio</RedButton>
                </>}
                {!showOptions && <VolumeSlider />}
            </div>
        </div>
    )
}