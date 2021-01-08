import { Button, RedButton } from 'components/reusable/button/Button';
import React, { useEffect, useState } from 'react';
import './track.css';
import * as Tone from 'tone';
import { VolumeSlider } from './VolumeSlider';
import { FaEllipsisH, FaTimes } from 'react-icons/fa';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorNotice from 'components/reusable/error/Error';
import { encodeMp3 } from 'utils/recorderUtils';

export const Track = ({track, playing, recorder, tracksState}) => {

    const { demoId } = useParams();
    const token = localStorage.getItem("auth-token");

    const [ showOptions, setShowOptions ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ hasAudio, setHasAudio ] = useState(!!track.trackSignedURL);
    const [ recording, setRecording ] = useState(false);
    const [ volume, setVolume ] = useState(0);
    const [ tracks, setTracks ] = tracksState;


    console.log(track._id);

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

    const startStopClick = async () => {

        if (recorder.recording) {
            recorder.stop();
            setRecording(false);

            // recorder utils exportWav
            const wavBlob = await new Promise((resolve, reject) => {
                recorder.exportWAV((blob) => {
                  if (blob) {
                    resolve(blob);
                  } else {
                    reject("Rejected");
                  }
                });
            });

            // imported from recorder utils, ideally move this closer to the component
            const mp3Blob = await encodeMp3(wavBlob);

            const file = new File(mp3Blob, `${track._id}.mp3`, {
                type: mp3Blob.type,
                lastModified: Date.now()
            });

            const fileLocation = URL.createObjectURL(file);
        
            new Tone.Buffer(fileLocation, (buffer) => {
                setTracks(tracks.map(t => {
                    if (t._id === track._id) {

                        const player = new Tone.Player(buffer).toDestination();

                        return {
                            ...track,
                            player,
                        }
                    } else {
                        return t
                    }
                }))
            });
            

        } else {
            recorder.record();
            setRecording(true);
        }

        console.log(recorder);
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
                    {hasAudio && <RedButton onClick={deleteAudio} style={controlButtonStyle}>Delete Audio</RedButton>}
                    {!hasAudio && <RedButton onClick={startStopClick} style={controlButtonStyle}>{recording ? `Stop` : `Start`}</RedButton>}
                </>}
                {!showOptions && <VolumeSlider onChange={e => setVolume(parseInt(e.target.value))}/>}
            </div>

        </div>

        {error && <div style={{padding: "0px 15px"}}>
            <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>
        </div>}
    </>
}