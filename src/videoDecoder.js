/* eslint-disable no-undef */
import MP4Box from 'mp4box';

/**
 * Taken from https://github.com/w3c/webcodecs/blob/main/samples/mp4-decode/mp4_demuxer.js
 */
class Writer {
  constructor(size) {
    this.data = new Uint8Array(size);
    this.idx = 0;
    this.size = size;
  }

  getData() {
    if (this.idx !== this.size) throw new Error('Mismatch between size reserved and sized used');
    return this.data.slice(0, this.idx);
  }

  writeUint8(value) {
    this.data.set([value], this.idx);
    this.idx += 1;
  }

  writeUint16(value) {
    const arr = new Uint16Array(1);
    arr[0] = value;
    const buffer = new Uint8Array(arr.buffer);
    this.data.set([buffer[1], buffer[0]], this.idx);
    this.idx += 2;
  }

  writeUint8Array(value) {
    this.data.set(value, this.idx);
    this.idx += value.length;
  }
}

/**
 * Taken from https://github.com/w3c/webcodecs/blob/main/samples/mp4-decode/mp4_demuxer.js
 *
 * @param avccBox
 * @returns {*}
 */
const getExtradata = (avccBox) => {
  let i;
  let size = 7;
  for (i = 0; i < avccBox.SPS.length; i += 1) {
    // nalu length is encoded as a uint16.
    size += 2 + avccBox.SPS[i].length;
  }
  for (i = 0; i < avccBox.PPS.length; i += 1) {
    // nalu length is encoded as a uint16.
    size += 2 + avccBox.PPS[i].length;
  }

  const writer = new Writer(size);

  writer.writeUint8(avccBox.configurationVersion);
  writer.writeUint8(avccBox.AVCProfileIndication);
  writer.writeUint8(avccBox.profile_compatibility);
  writer.writeUint8(avccBox.AVCLevelIndication);
  // eslint-disable-next-line no-bitwise
  writer.writeUint8(avccBox.lengthSizeMinusOne + (63 << 2));

  // eslint-disable-next-line no-bitwise
  writer.writeUint8(avccBox.nb_SPS_nalus + (7 << 5));
  for (i = 0; i < avccBox.SPS.length; i += 1) {
    writer.writeUint16(avccBox.SPS[i].length);
    writer.writeUint8Array(avccBox.SPS[i].nalu);
  }

  writer.writeUint8(avccBox.nb_PPS_nalus);
  for (i = 0; i < avccBox.PPS.length; i += 1) {
    writer.writeUint16(avccBox.PPS[i].length);
    writer.writeUint8Array(avccBox.PPS[i].nalu);
  }

  return writer.getData();
};

/**
 * decodeVideo takes an url to a mp4 file and converts it into frames.
 *
 * The steps for this are:
 *  1. Determine the codec for this video file and demux it into chunks.
 *  2. Read the chunks with VideoDecoder as fast as possible.
 *  3. Return an array of frames that we can efficiently draw to a canvas.
 *
 * @param src
 * @param VideoDecoder
 * @param EncodedVideoChunk
 * @param emitFrame
 * @param debug
 * @returns {Promise<unknown>}
 */
const decodeVideo = (src, emitFrame, { VideoDecoder, EncodedVideoChunk, debug }) => new Promise(
  (resolve, reject) => {
    if (debug) console.info('Decoding video from', src);

    try {
      // Uses mp4box for demuxing
      const mp4boxfile = MP4Box.createFile();

      // Holds the codec value
      let codec;

      // Whether we are currently decoding
      let decodingFinished;

      // Creates a VideoDecoder instance
      const decoder = new VideoDecoder({
        output: (frame) => {
          createImageBitmap(frame).then((bitmap) => {
            emitFrame(bitmap);
            frame.close();
          });

          // If we don't get a new frame for 1s, resolve.
          clearTimeout(decodingFinished);
          decodingFinished = setTimeout(() => {
            decoder.close();
            resolve();
          }, 1000);
        },
        error: (e) => {
          console.error(e);
          reject(e);
        },
      });

      mp4boxfile.onReady = (info) => {
        if (info && info.videoTracks && info.videoTracks[0]) {
        // eslint-disable-next-line prefer-destructuring
          codec = info.videoTracks[0].codec;
          if (debug) console.info('Found video with codec:', codec);

          // Gets the avccbox used for reading extradata
          const avccBox = mp4boxfile.moov.traks[0].mdia.minf.stbl.stsd.entries[0].avcC;
          const extradata = getExtradata(avccBox);

          // configure decoder
          decoder.configure({ codec, description: extradata });

          // Setup mp4box file for breaking it into chunks
          mp4boxfile.setExtractionOptions(info.videoTracks[0].id);
          mp4boxfile.start();
        } else reject(new Error('URL provided is not a valid mp4 video file.'));
      };

      mp4boxfile.onSamples = (track_id, ref, samples) => {
        for (let i = 0; i < samples.length; i += 1) {
          const sample = samples[i];
          const type = sample.is_sync ? 'key' : 'delta';

          const chunk = new EncodedVideoChunk({
            type,
            timestamp: sample.cts,
            duration: sample.duration,
            data: sample.data,
          });

          decoder.decode(chunk);
        }
      };

      // Fetches the file into arraybuffers
      fetch(src)
        .then((res) => {
          const reader = res.body.getReader();
          let offset = 0;

          function appendBuffers({ done, value }) {
            if (done) {
              mp4boxfile.flush();
              return null;
            }

            const buf = value.buffer;
            buf.fileStart = offset;
            offset += buf.byteLength;
            mp4boxfile.appendBuffer(buf);

            return reader.read().then(appendBuffers);
          }

          return reader.read().then(appendBuffers);
        });
    } catch (e) {
      reject(e);
    }
  },
);

/**
 * The main function for decoding video. Deals with the polyfill cases first,
 * then calls our decodeVideo.
 *
 * @param src
 * @param emitFrame
 * @param debug
 * @returns {Promise<never>|Promise<void>|*}
 */
export default (src, emitFrame, debug) => {
  // If our browser supports WebCodecs natively
  if (typeof VideoDecoder === 'function' && typeof EncodedVideoChunk === 'function') {
    if (debug) console.info('WebCodecs is natively supported, using native version...');
    return decodeVideo(src, emitFrame, { VideoDecoder, EncodedVideoChunk, debug });
  }

  // If our browser doesn't support WebCodecs, but we have a polyfill available
  if (typeof LibAVWebCodecs === 'object' && typeof LibAVWebCodecs.load === 'function') {
    if (debug) {
      console.info(
        'WebCodecs is not natively supported, but LibAVWebCodecs polyfill detected. Using polyfill...',
      );
    }
    return ((typeof LibAV === 'object') ? LibAV.LibAV() : Promise.resolve())
      .then(LibAVWebCodecs.load)
      .then(() => decodeVideo(src, emitFrame, { ...LibAVWebCodecs, debug }));
  }

  // Otherwise, we do a promise reject
  return Promise.reject(new Error(
    'WebCodecs is not available, please try a different browser or supply the LibAVWebCodecs polyfill.',
  ));
};
