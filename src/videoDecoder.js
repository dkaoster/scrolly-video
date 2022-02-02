/* eslint-disable no-undef */
import MP4Box from 'mp4box';

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
 * @param debug
 * @returns {Promise<unknown>}
 */
const decodeVideo = (src, { VideoDecoder, EncodedVideoChunk, debug }) => {
  if (debug) console.info('Decoding video from', src);

  return new Promise((resolve, reject) => {
    try {
      // Uses mp4box for demuxing
      const mp4boxfile = MP4Box.createFile();

      // Holds the codec value
      let codec;

      const decoder = new VideoDecoder({
        output: (frame) => {
          console.log(frame);
          // Close ASAP.
          frame.close();

          // TODO detect last frame and resolve the promise in here
        },
        error: (e) => {
          console.error(e)
          reject(e);

          },
      });

      mp4boxfile.onReady = (info) => {
        if (info && info.videoTracks && info.videoTracks[0]) {
        // eslint-disable-next-line prefer-destructuring
          codec = info.videoTracks[0].codec;
          if (debug) console.info('Found video with codec:', codec);

          decoder.configure({
            codec,
            //codedWidth: 1920,
            //codedHeight: 1080,
          });

          // Setup mp4box file for breaking it into chunks
          mp4boxfile.setExtractionOptions(info.videoTracks[0].id);
          mp4boxfile.start();
        } else reject(new Error('URL provided is not a valid mp4 video file.'));
      };

      mp4boxfile.onSamples = (track_id, ref, samples) => {
        console.log('samples');

        for (let i = 0; i < samples.length; i += 1) {
          const sample = samples[i];
          const type = sample.is_sync ? 'key' : 'delta';
          // console.log(sample, type);

          const chunk = new EncodedVideoChunk({
            type,
            timestamp: sample.cts,
            duration: sample.duration,
            data: sample.data,
          });
          console.log(chunk);

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
  });
};

/**
 * The main function for decoding video. Deals with the polyfill cases first,
 * then calls our decodeVideo.
 *
 * @param src
 * @param debug
 * @returns {Promise<never>|Promise<void>|*}
 */
export default (src, debug) => {
  // If our browser supports WebCodecs natively
  if (typeof VideoDecoder === 'function' && typeof EncodedVideoChunk === 'function') {
    if (debug) console.info('WebCodecs is natively supported, using native version...');
    return decodeVideo(src, { VideoDecoder, EncodedVideoChunk, debug });
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
      .then(() => decodeVideo(src, { ...LibAVWebCodecs, debug }));
  }

  // Otherwise, we do a promise reject
  return Promise.reject(new Error(
    'WebCodecs is not available, please try a different browser or supply the LibAVWebCodecs polyfill.',
  ));
};
