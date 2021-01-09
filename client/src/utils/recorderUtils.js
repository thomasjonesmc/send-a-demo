import lamejs from "lamejs";

export const encodeMp3 = async (wavBlob, sampleRate) => {
  let samples, sampleBlockSize, sampleChunk, mp3buf;
  let mp3Data = [];
  let wavBuffer = await wavBlob.arrayBuffer();

  samples = new Int16Array(wavBuffer);
  sampleBlockSize = 1152;

  //mp3encoder takes in # of channels, sample rate (defined above), and kbps
  let mp3encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);

  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    sampleChunk = samples.subarray(i, i + sampleBlockSize);
    mp3buf = mp3encoder.encodeBuffer(sampleChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(new Int8Array(mp3buf));
  }

  let mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });

  return [mp3Blob];
};