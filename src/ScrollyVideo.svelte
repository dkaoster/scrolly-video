<script>
  import { onDestroy } from 'svelte';
  import ScrollyVideo from './ScrollyVideo';

  // variable to hold the DOM element
  let scrollyVideoContainer;

  // variable to hold the scrollyVideo object
  let scrollyVideo;
  
  $: {
    if (scrollyVideoContainer) {
      // if scrollyvideo already exists and any parameter is updated, destroy and recreate.
      if (scrollyVideo && scrollyVideo.destroy) scrollyVideo.destroy();
      scrollyVideo = new ScrollyVideo({ ...$$props, scrollyVideoContainer });
    }
  }

  onDestroy(() => {
    if (scrollyVideo && scrollyVideo.destroy) scrollyVideo.destroy();
  });
</script>

<div bind:this={scrollyVideoContainer} />
