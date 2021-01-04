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
  const results = await Promise.all(promises);

  let playersAndTracks = results;

  return playersAndTracks.map((result) => {
    return {
      ...result,
    };
  });
};

export default fetchTracks;
