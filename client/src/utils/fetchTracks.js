import * as Tone from "tone";

export const fetchTracks = async (tracks) => {
  const promises = await tracks.map((track) => {
    if (track.trackSignedURL) {
      const player = new Tone.Player(track.trackSignedURL);
      return [track, player];
    } else {
      return [track];
    }
  });

  const playersAndTracks = await Promise.all(promises);

  return playersAndTracks.map((result) => result);
};

export default fetchTracks;
