import Axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as Tone from "tone";

// location state will contain the demo *if* the user clicked on the demo from the `/my-demos` page
// otherwise location state will be undefined, if it is undefined we will need to fetch the demo
export const useDemo = (locationState) => {
  const [demo, setDemo] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState(null);
  const [trackLengths, setTrackLengths] = useState(null);
  const [demoLoading, setDemoLoading] = useState(true);
  const [tracksLoading, setTracksLoading] = useState(true);
  const [demoLength, setDemoLength] = useState(null);
  const { demoId } = useParams();


  // on first time page load we ask the user for microphone permissions
  useEffect(() => {
    let stream = null;

    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(() => {
        console.log("Access to microphone granted.")
      })
      .catch((err) => {
        if (err.name === "NotAllowedError") {
          setError("Change Microphone Permissions to Record");
        }
      });

    return () => {
      if (stream) stream.getAudioTracks()[0].stop();
      Tone.Transport.stop();
    };
  }, []);

  // any time the demoID changes, we fetch the demo with the changed ID
  useEffect(() => {
    (async () => {
      try {
        setDemoLoading(true);
        setTracksLoading(true);

        let currentDemo = null;

        // if the locationState did not get passed in, we need to fetch the demo
        if (locationState === undefined) {
          const res = await Axios.get(`/demos/${demoId}`);
          currentDemo = res.data;
        } else {
          currentDemo = locationState.demo;
        }

        setDemo(currentDemo);
        setDemoLoading(false);
        let initTrackLengths = [];
        const currentTracks = await Promise.all(
          currentDemo.tracks.map(async (track) => {
            let player = null;
            if (track.trackSignedURL) {
              player = await new Promise((resolve, reject) => {
                const p = new Tone.Player(track.trackSignedURL, () => {
                  if (p) {
                    if (!track.trackStart) track.trackStart = 0;
                    initTrackLengths.push({id: track._id, length: p.buffer.duration + track.trackStart});
                    resolve(p.sync().start(0).toDestination());
                  } else reject(new Error(`Could not create track from track signed url ${track.trackSignedURL}`));
                });
              });
            }
            setTrackLengths([...initTrackLengths]);
            return { ...track, player };
          })
        );

        setTracks(currentTracks);
        setTracksLoading(false);
        setError(null);
      } catch (err) {
        setDemo(null);
        setTracks([]);
        setError(err.message);
        setDemoLoading(false);
        setTracksLoading(false);
      }
    })();
  }, [locationState, demoId]);

  //sets demo length when trackLengths is modified
  useEffect(() => {
    let longestTrack = {id: null, length: 0};
    if (trackLengths) {
      setDemoLength(() => {
        trackLengths.forEach(t => {
          if (t.length > longestTrack.length) {
            longestTrack = {id: t.id, length: t.length}
          }
        })
        return longestTrack.length;
      });
      //Stopping the Transport after setting demoLength, the demo would not play if I didn't do this
      Tone.Transport.stop();
    }
  }, [trackLengths, setDemoLength])

  return {
    demo,
    tracks,
    error,
    demoLoading,
    tracksLoading,
    setTracks,
    lengthState: [trackLengths, setTrackLengths],
    demoLength
  };
};
