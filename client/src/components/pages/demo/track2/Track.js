import React, { useEffect, useState } from 'react';
import './track.css';
import * as Tone from 'tone';
import { VolumeSlider } from './VolumeSlider';
import { FaTimes } from 'react-icons/fa';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import ErrorNotice from 'components/reusable/error/Error';
import { encodeMp3 } from 'utils/recorderUtils';

export const Track = ({track, recorder, playingState, tracksState, demo}) => {

    const { demoId } = useParams();
    const token = localStorage.getItem("auth-token");

    // const [ showOptions, setShowOptions ] = useState(false);
    const [ error, setError ] = useState(null);
    const [ hasAudio, setHasAudio ] = useState(!!track.trackSignedURL);
    const [ recording, setRecording ] = useState(false);
    const [ file, setFile ] = useState(null);    
    const [ uploading, setUploading ] = useState(false);
    const [ volume, setVolume ] = useState(0);
    const [ tracks, setTracks ] = tracksState;
    const [ playing, setPlaying ] = playingState;

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

    const deleteAudio = async () => {
        if (window.confirm("Remove track audio?")) {
            if (track.trackSignedURL) {
                // delete from aws!!!
                const { data: changedTrack} = await Axios.delete(`/demos/${demoId}/tracks/${track._id}/audio`)

                console.log('CHANGED TRACK', changedTrack);

                setTracks(tracks.map(t => {
                    if (t._id === track._id) {
                        return { ...changedTrack, player: null }
                    } 
                    return t;
                }));

            } else {
                setTracks(tracks.map(t => {
                    if (t._id === track._id) {
                        return { ...track, player: null }
                    } 
                    return t;
                }));
            }

            setHasAudio(false);
            setFile(null);
        }
    }

    const uploadFile = async () => {
        setUploading(true);

    
        const s3SignedFile = await Axios.post(`/s3/signed-url`, {
            fileName: `${demoId}/${track._id}`,
            fileType: file.type
        });

        const { signedUrl, url } = s3SignedFile.data;
        
        console.log("SIGNED FILE", s3SignedFile);
        console.log("FILE", file);
        console.log("SIGNED URL", signedUrl);
        console.log("URL", url);

        await Axios.put(signedUrl, file, { headers : { "Content-Type": file.type } } );

        await Axios.post(`/demos/add-signed-url`, 
            { _id: track._id, URL: url },
            { headers: { "x-auth-token": token } }
        );

        setTracks(tracks => tracks.map(t => {
            if (t._id === track._id) {
                console.log({ ...track, trackSignedURL: signedUrl });
                return { ...track, trackSignedURL: signedUrl }
            } 
            return t;
        }))

        setFile(null);
        setUploading(false);
    }

    const startRecording = () => {
        recorder.record();
        setRecording(true);
        setPlaying(true);
    }

    const stopRecording = async () => {
        setRecording(false);
        setPlaying(false);

        recorder.stop();

        // get the blob from exportWAV
        const blob = await new Promise((resolve, reject) => {
            recorder.exportWAV((blob, err) => blob ? resolve(blob) : reject(err));
        });

        const localFile = new File([blob], `${track._id}.wav`, {
            type: blob.type,
            lastModified: Date.now()
        });

        setFile(localFile);
        
        const fileLocation = URL.createObjectURL(localFile);
        
        setTracks(tracks.map(t => {
            if (t._id === track._id) {
                const player = new Tone.Player(fileLocation).toDestination();
                return { ...track, player }
            } 
            return t;
        }));

        recorder.clear();
        setHasAudio(true);
    }

    const volumeChange = (e) => {
        if (track.player) {
            setVolume(parseInt(e.target.value));
            track.player.volume.value = parseInt(e.target.value);
        }
    }

    const volumeMute = () => {
        if (track.player) {
            setVolume(-20);
            track.player.volume.value = -20;
        }
    }

    const volumeMax = () => {
        if (track.player) {
            setVolume(20);
            track.player.volume.value = 20;
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
               
               {/* recorder is null if the user does not allow recording in browser. don't let user click start if its null */}
               {recorder && !hasAudio && <>
                   <button onClick={startRecording} disabled={recording}>Start</button>
                    <button onClick={stopRecording} disabled={!recording}>Stop</button>
               </>}
                
                {file && <button onClick={uploadFile} disabled={recording || uploading}>Upload</button>}
                {hasAudio && <button onClick={deleteAudio}>Delete Audio</button>}
                
                <VolumeSlider value={volume} onChange={volumeChange} onMute={volumeMute} onMax={volumeMax} />
            </div>

        </div>

        {error && <div style={{padding: "0px 15px"}}>
            <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>
        </div>}
    </>
}