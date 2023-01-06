<script>
  import { onDestroy } from 'svelte';
  import ScrollyVideo from './ScrollyVideo';

  // transitionSpeed sets the upper limit for playbackRate.
  // Must be a number between >2 and <16.
  export let transitionSpeed = 8;
  export let frameThreshold = 0.1;

  // Allows a way to specify display options, for instance adding 'cover'
  // will tell this component to "cover" in its container.
  export let cover = true;
  export let sticky = true;
  export let full = true;

  // Use the WebCodecs API for even better performance, but will only work
  // if the WebCodecs API is available, either natively in the browser or
  // via a polyfill (which is not included by default)
  export let useWebCodecs = true;

  // The src of the video
  export let src;

  // Allow a debug flag
  export let debug;

  // variable to hold the DOM element
  let scrollyVideoContainer;

  // variable to hold the scrollyVideo object
  let scrollyVideo;
  
  $: {
    if (scrollyVideoContainer) {
      // if scrollyvideo already exists and any parameter is updated, destroy and recreate.
      if (scrollyVideo && scrollyVideo.destroy) scrollyVideo.destroy();
      scrollyVideo = new ScrollyVideo({
        transitionSpeed,
        frameThreshold,
        cover,
        sticky,
        full,
        useWebCodecs,
        src,
        debug,
        scrollyVideoContainer,
      });
    }
  }

  onDestroy(() => {
    if (scrollyVideo.destroy) scrollyVideo.destroy();
  });
</script>

<div bind:this={scrollyVideoContainer} />
