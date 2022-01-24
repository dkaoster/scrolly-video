<svelte:options tag="scrolly-video" />

<script>
  // transitionSpeed sets the upper limit for playbackRate.
  // Must be a number between >2 and <16.
  export let transitionSpeed = 6;

  // Stop the animation when we are within 0.1 seconds of the target.
  // Close enough for floating point shenanigans
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
      playbackRate = Math.max(Math.min((targetTime - currentTime) * 2, transitionSpeed, 16), 1);
      paused = false;
    }

    // Recursively calls ourselves until the animation is done.
    requestAnimationFrame(transitionToTargetTime);
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

<video
  tabindex="0"
  preload="auto"
  autobuffer
  playsinline
  muted
  {...$$props}
  bind:this={video}
  bind:paused
  bind:currentTime
  bind:playbackRate
/>
