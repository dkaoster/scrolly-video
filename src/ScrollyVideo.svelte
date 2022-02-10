<svelte:options tag="scrolly-video" />

<script>
  import videoDecoder from './videoDecoder';

  // transitionSpeed sets the upper limit for playbackRate.
  // Must be a number between >2 and <16.
  export let transitionspeed = 4;

  // Allows a way to specify display options, for instance adding 'cover'
  // will tell this component to "cover" in its container.
  export let cover = true;
  export let sticky = true;
  export let full = true;

  // Use the WebCodecs API for even better performance, but will only work
  // if the WebCodecs API is available, either natively in the browser or
  // via a polyfill (which is not included by default)
  export let usewebcodecs = false;

  // The src of the video
  export let src;

  // Allow a debug flag
  export let debug;

  // Stop the animation when we are within 0.1 seconds of the target.
  // Close enough for floating point video shenanigans
  const frameThreshold = 0.1;

  // variable to hold the DOM video element
  let video;

  // variable to hold the canvas element
  let canvas;
  $: context = canvas && canvas.getContext('2d');

  // number of videoFrames
  let numVideoFrames = 0;
  let frameRate = 0;

  // The targetTime in seconds for the video to transition to
  let targetTime = 0;

  // Video status variables
  let transitioning = false;
  let currentTime = 0;
  let paused = true;
  let playbackRate = 1;
  let muted = true;

  // Document status variables
  let innerHeight = 0;
  let scrollY = 0;

  // Webcodecs has given us frames for this video, try to go faster
  const frames = [];
  const emitFrame = (frame) => { frames.push(frame); };

  // If we want to use WebCodecs to split apart the frames.
  if (usewebcodecs) {
    videoDecoder(src, emitFrame, debug).then(() => {
      const { duration } = video;
      numVideoFrames = frames.length;
      frameRate = numVideoFrames / duration;
    });
  }

  $: {
    if (video || canvas) {
    // Use JS to reach up to the shadow root host and set the styles if
    // this element is supposed to be sticky.
      const host = (video && video.parentNode.host) || (canvas && canvas.parentNode.host);
      if (host) {
        if (sticky) {
          host.style.display = 'block';
          host.style.position = 'sticky';
          host.style.top = '0';
        }

        if (full) {
          host.style.width = '100%';
          host.style.height = '100vh';
          host.style.overflow = 'hidden';
        }
      }
    }
  }

  // Recursively transition to the target time
  const transitionToTargetTime = () => {
    // If we are already close enough to our target, pause the video and return.
    // This is the base case of the recursive function
    if (Math.abs(currentTime - targetTime) < frameThreshold) {
      paused = true;
      transitioning = false;
      return;
    }

    if (canvas) {
      const transitionForward = targetTime - currentTime;
      currentTime += transitionForward / (8 / transitionspeed);
      const currFrame = frames[Math.floor(currentTime * frameRate)];
      canvas.width = currFrame.width;
      canvas.height = currFrame.height;
      if (currFrame) context.drawImage(currFrame, 0, 0, currFrame.width, currFrame.height);
    } else if (targetTime - currentTime < 0) {
      // We can't use a negative playbackRate, so if the video needs to go backwards,
      // We have to use the inefficient method of modifying currentTime rapidly to
      // get an effect.
      paused = true;
      const transitionForward = targetTime - currentTime;
      currentTime += transitionForward / (8 / transitionspeed);
    } else {
      // Otherwise, we play the video and adjust the playbackRate to get a smoother
      // animation effect.
      playbackRate = Math.max(Math.min((targetTime - currentTime) * 4, transitionspeed, 16), 1);
      paused = false;
    }

    // Recursively calls ourselves until the animation is done.
    // eslint-disable-next-line no-undef
    if (typeof requestAnimationFrame === 'function') { requestAnimationFrame(transitionToTargetTime); }
  };

  /**
   * Sets the currentTime as a number of seconds in the video.
   *
   * @param setTime
   */
  export function setCurrentTime(setTime) {
    targetTime = Math.max(Math.min(setTime, video.duration), 0);
    if (transitioning) return;
    paused = false;
    transitioning = true;
    transitionToTargetTime();
  }

  /**
   * Sets the currentTime as a percentage of the video duration.
   *
   * @param setPercentage
   */
  export function setCurrentTimePercent(setPercentage) {
    targetTime = Math.max(Math.min(setPercentage, 1), 0)
      * (numVideoFrames / frameRate || video.duration);
    if (transitioning) return;
    paused = false;
    transitioning = true;
    transitionToTargetTime();
  }

  // Used for internally setting the scroll percentage based on built-in listeners
  // TODO make this configurable
  const updateScrollPercentage = () => {
    // eslint-disable-next-line no-undef
    const bodyHeight = document.body.offsetHeight;
    setCurrentTimePercent(scrollY / (bodyHeight - innerHeight));
  };
</script>

<style>
  video {
    display: block;
  }

  .cover {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 101%;
    min-height: 101%;
    width: auto;
    height: auto;
  }
</style>

<svelte:window on:scroll={updateScrollPercentage} bind:innerHeight bind:scrollY />

{#if usewebcodecs && numVideoFrames}
  <!--
  Will automatically switch over to a canvas if using webCodecs
  and it has finished loading
  -->
  <canvas bind:this={canvas} />
{:else}
  <video
    tabindex="0"
    preload="auto"
    autobuffer
    playsinline
    class:cover
    {...$$props}
    bind:this={video}
    bind:muted
    bind:paused
    bind:currentTime
    bind:playbackRate
  />
{/if}
