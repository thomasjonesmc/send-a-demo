import Axios from "axios";
const { useEffect, useState } = require("react");

export const useDemo = (demoID) => {

    const [ demo, setDemo ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    
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

    useEffect(() => {
    
        Axios.get(`/demos/${demoID}`, {
            params: { id: demoID },
        })
            .then(res => {
                setDemo(res.data);
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                setDemo(null);
                setLoading(false);
                setError(err.message);
            });
            
    }, [demoID]);

    return { demo, error, loading };
}