import { useEffect, useRef, useState } from "react"
import * as Tone from "tone";

const createPlayer = async (audioFile) => {
    return new Promise((res, rej) => {
        const player = new Tone.Player(audioFile, () => {
            if (player) res(player.toDestination());
            else rej(new Error('Error Creating Tone Player'));
        });
    });
}

export const useTrack = (setTracks, track) => {

    const rec = useRef(null);
    const buf = useRef([]);
    const [ file, setFile ] = useState(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {

            rec.current = new MediaRecorder(stream);

            rec.current.onstop = () => {        
                const blob = new Blob(buf.current, { type: 'audio/mp3' });
        
                buf.current = [];
        
                const localFile = new File([blob], `${track._id}.mp3`, {
                    type: blob.type,
                    lastModified: Date.now(),
                });

                setFile(localFile);

                const url = URL.createObjectURL(localFile);

                createPlayer(url)
                .then(player => {
                    player.sync().start(0);

                    setTracks(tracks => tracks.map(t => {
                        if (t._id === track._id) {
                            return { ...t, player };
                        }
                        return t;
                    }));
                });
            }
        
            rec.current.ondataavailable = e => {
                buf.current.push(e.data);
            }
        });
    }, [setTracks, track._id]);

    useEffect(() => {
        return () => { 
          if (track.player) track.player.unsync(); 
        }
      }, [track.player]);

    return { file, setFile, rec };
}