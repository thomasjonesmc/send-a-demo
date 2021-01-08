import { RedButton } from 'components/reusable/button/Button';
import React, { useEffect, useState } from 'react';
import './track.css';
import * as Tone from 'tone';
import { VolumeSlider } from './VolumeSlider';
import { FaTimes } from 'react-icons/fa';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorNotice from 'components/reusable/error/Error';

export const Track = ({track, playing, recorder, tracksState}) => {

    const { demoId } = useParams();
    const token = localStorage.getItem("auth-token");

    // const [ showOptions, setShowOptions ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ hasAudio, setHasAudio ] = useState(!!track.trackSignedURL);
    const [ recording, setRecording ] = useState(false);
    const [ volume, setVolume ] = useState(0);
    const [ file, setFile ] = useState(null);    
    const [ tracks, setTracks ] = tracksState;


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

    const startRecording = () => {
        recorder.record();
        setRecording(true);
    }

    const stopRecording = async () => {
        setRecording(false);
        recorder.stop();

        // get the blob from exportWAV
        const blob = await new Promise((resolve, reject) => {
            recorder.exportWAV((blob, err) => blob ? resolve(blob) : reject(err));
        });

        const file = new File([blob], `${track._id}.mp3`, {
            type: blob.type,
            lastModified: Date.now()
        });

        setFile(file);

        const fileLocation = URL.createObjectURL(file);
    
        new Tone.Buffer(fileLocation, (buffer) => {
            setTracks(tracks.map(t => {
                if (t._id === track._id) {
                    const player = new Tone.Player(buffer).toDestination();
                    return { ...track, player }
                } else {
                    return t
                }
            }))
        });
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
               
                {hasAudio && <RedButton onClick={deleteAudio} style={controlButtonStyle}>Delete Audio</RedButton>}
                <button onClick={startRecording} disabled={recording}>Start</button>
                <button onClick={stopRecording} disabled={!recording}>Stop</button>
                
                {file && <button onClick={() => 0} disabled={recording}>Upload</button>}
                
                <VolumeSlider onChange={e => setVolume(parseInt(e.target.value))}/>
            </div>

        </div>

        {error && <div style={{padding: "0px 15px"}}>
            <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>
        </div>}
    </>
}