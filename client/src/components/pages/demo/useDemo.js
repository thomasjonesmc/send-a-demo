import Axios from "axios";
import { useEffect, useState } from "react";
import * as Tone from "tone";

export const useDemo = (demoId) => {

    const [ demo, setDemo ] = useState(null);
    const [ tracks, setTracks ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    
    // on first time page load we ask the user for microphone permissions
    useEffect(() => {
        let stream = null;

        navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((audioStream) => stream = audioStream)
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
                const { data: demo } = await Axios.get(`/demos/${demoId}`);
                setDemo(demo);

                console.log(demo.tracks);

                setTracks(demo.tracks.map(track => {
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
            
    }, [demoId]);

    return { demo, tracks, error, loading };
}