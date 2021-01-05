import lamejs from "lamejs";
import Recorder from "recorderjs";

let rec;
let input;

let audioContext;
let sampleRate;

audioContext = new AudioContext();

export const startRecording = () => {
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    console.log("getUserMedia success, stream created");

    input = audioContext.createMediaStreamSource(stream);
    sampleRate = audioContext.sampleRate;
    rec = new Recorder(input, { numChannels: 1 });

    rec.record();

    console.log("Recording...");
  });
};

export const stopRecording = () => {
  let promise = new Promise((resolve, reject) => {
    rec.stop();
    if (!rec.recording) {
      resolve("finished recording");
    } else {
      reject("error on stopping recording");
    }
  });

  return promise;
};

export const exportWav = () => {
  let promise = new Promise((resolve, reject) => {
    rec.exportWAV((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject("Rejected");
      }
    });
  });
  return promise;
};

export const encodeMp3 = async (wavBlob) => {
  let samples, sampleBlockSize, sampleChunk, mp3buf;
  let mp3Data = [];
  let wavBuffer = await wavBlob.arrayBuffer();

  samples = new Int16Array(wavBuffer);
  sampleBlockSize = 1152;
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

  //mp3encoder takes in # of channels, sample rate (defined above), and kbps

  let mp3Blob = new Blob(mp3Data, { type: "audio/mp3" });

  return [mp3Blob];
};
