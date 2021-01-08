import { Button, RedButton } from 'components/reusable/button/Button';
import React, { useEffect, useState } from 'react';
import './track.css';
import * as Tone from 'tone';
import { VolumeSlider } from './VolumeSlider';
import { FaEllipsisH, FaTimes } from 'react-icons/fa';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorNotice from 'components/reusable/error/Error';

export const Track = ({track, playing}) => {

    const [ showOptions, setShowOptions ] = useState(false);
    const [ error, setError ] = useState(null);
    const { demoId } = useParams();
    const token = localStorage.getItem("auth-token");

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

    const deleteTrack = async () => {
        if (window.confirm("Remove this track?")) {
            Axios.delete(`/demos/${demoId}/tracks/${track._id}`, {
                headers: { "x-auth-token": token },
            })
            .then(res => {
                if (res.data.error) { throw new Error(res.data.error); }
            })
            .catch(err => setError(err.message));
        }
    }

    const deleteAudio = () => {
        if (window.confirm("Remove track audio?")) {
            console.log("Track Audio Removed");
        }
    }

    return <>
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

        {error && <div style={{padding: "0px 15px"}}>
            <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>
        </div>}
    </>
}