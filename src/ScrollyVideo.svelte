<svelte:options tag="scrolly-video" />

<script>
  // transitionSpeed sets the upper limit for playbackRate.
  // Must be a number between >2 and <16.
  export let transitionSpeed = 4;

  // Allows a way to specify display options, for instance adding 'cover'
  // will tell this component to "cover" in its container.
  export let cover = true;
  export let sticky = true;
  export let full = true;

  // Stop the animation when we are within 0.1 seconds of the target.
  // Close enough for floating point video shenanigans
  const frameThreshold = 0.1;

  // variable to hold the DOM element
  let video;

  // The targetTime
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

  $: { if (video) {
    // Use JS to reach up to the shadow root host and set the styles if
    // this element is supposed to be sticky.
    const host = video.parentNode.host;
    if (host) {
      if (sticky) {
        host.style.display = 'block';
        host.style.position = 'sticky';
        host.style.top = 0;
      }

      if (full) {
        host.style.width = '100%';
        host.style.height = '100vh';
        host.style.overflow = 'hidden';
      }
    }
  }}

  // Recursively transition to the target time
  const transitionToTargetTime = () => {
    // If we are already close enough to our target, pause the video and return.
    // This is the base case of the recursive function
    if (Math.abs(currentTime - targetTime) < frameThreshold) {
      paused = true;
      transitioning = false;
      return;
    }

    // We can't use a negative playbackRate, so if the video needs to go backwards,
    // We have to use the inefficient method of modifying currentTime rapidly to
    // get an effect.
    if (targetTime - currentTime < 0) {
      paused = true;
      const transitionForward = targetTime - currentTime;
      currentTime += transitionForward / transitionSpeed;
    }

    // Otherwise, we play the video and adjust the playbackRate to get a smoother
    // animation effect.
    else {
      playbackRate = Math.max(Math.min((targetTime - currentTime) * 4, transitionSpeed, 16), 1);
      paused = false;
    }

    // Recursively calls ourselves until the animation is done.
    if (typeof requestAnimationFrame === 'function')
      requestAnimationFrame(transitionToTargetTime);
  };

  const updateScrollPercentage = () => {
    const bodyHeight = document.body.offsetHeight;
    setCurrentTimePercent(scrollY / (bodyHeight - innerHeight));
  }

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
    targetTime = Math.max(Math.min(setPercentage, 1), 0) * video.duration;
    if (transitioning) return;
    paused = false;
    transitioning = true;
    transitionToTargetTime();
  }
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
