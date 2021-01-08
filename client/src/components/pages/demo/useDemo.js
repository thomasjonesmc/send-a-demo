import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Tone from "tone";
import Recorder from "recorderjs";

// location state will contain the demo *if* the user clicked on the demo from the `/my-demos` page
// otherwise location state will be undefined, if it is undefined we will need to fetch the demo
export const useDemo = (locationState) => {

    const [ demo, setDemo ] = useState(null);
    const [ tracks, setTracks ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ recorder, setRecorder ] = useState(null);
    const { demoId } = useParams();

    // on first time page load we ask the user for microphone permissions
    useEffect(() => {
        let stream = null;

        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then((audioStream) => {
                stream = audioStream;
                const audioContext = new AudioContext();
                const input = audioContext.createMediaStreamSource(stream);
                setRecorder(new Recorder(input, { numChannels: 1, mimeType: 'audio/mp3' }));

            })
            .catch(err => {
                if (err.name === "NotAllowedError") {
                    setError("Change Microphone Permissions to Record"); 
                }
            });
        
        return () => {
          if (stream) stream.getAudioTracks()[0].stop();
        };
        
    }, []);

    // any time the demoID changes, we fetch the demo with the changed ID
    useEffect(() => {
    
        (async () => {

            try {
                let currentDemo = null;

                // if the locationState did not get passed in, we need to fetch the demo
                if (locationState === undefined) {
                    const res = await Axios.get(`/demos/${demoId}`);
                    currentDemo = res.data;
                } else {
                    currentDemo = locationState.demo;
                }

                setDemo(currentDemo);

                setTracks(currentDemo.tracks.map(track => {
                    return {
                        player: track.trackSignedURL ? new Tone.Player(track.trackSignedURL).toDestination() : null,
                        ...track
                    }
                }));
                setLoading(false);
                setError(null);

            } catch (err) {
                setDemo(null);
                setTracks([]);
                setLoading(false);
                setError(err.message);
            }
        })();
            
    }, [locationState, demoId]);

    return { demo, tracks, error, loading, recorder, setTracks };
}