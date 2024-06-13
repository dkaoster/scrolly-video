<script>
  import ScrollyVideo from '../src/ScrollyVideo.svelte';

  const cards = [
    'This kind of scrolling video is common in visual journalism, marketing materials, or other scrollytelling applications.',
    'This library provides a way to easily create these kinds of scrolling video experiences, without fussing with special video encoding formats.',
    'Compatible with React, Svelte, Vue, and plain HTML.',
  ];

  // Various state settings
  let url;
  let trackScroll = true;
  let videoPercentage = 0;
  let width;

  $: {
    if (width) {
      url = width > 760
        ? 'https://scrollyvideo.js.org/goldengate.mp4'
        : 'https://scrollyvideo.js.org/goldengate_mobile.mp4';
    }
  }
</script>

<svelte:window bind:innerWidth={width} />

<div class="video-container">
  {#if url}
    <ScrollyVideo src={url} {trackScroll} {videoPercentage} />
  {/if}

  {#each cards as card}
    <div class="card-wrap">
      <div class="card">
        {card}
      </div>
    </div>
  {/each}

  <div class="card-wrap">
    <div class="card options">
      <h3>Try It</h3>
      <div class="option-wrap">
        <label for="video-url">Video URL</label>
        <input id="video-url" type="text" bind:value={url}>
      </div>

      <div class="option-wrap">
        <label for="track-scroll">Track Scroll</label>
        <input id="track-scroll" type="checkbox" bind:checked={trackScroll}>
      </div>
    </div>
  </div>

  {#if !trackScroll}
    <div class="scroll-track">
      <h3>Video Position</h3>
      <div class="option-wrap">
        <label for="video-position">{Math.floor(videoPercentage * 100)}%</label>
        <input id="video-position" type="range" min="0" max="1" step="0.01" bind:value={videoPercentage}>
      </div>
    </div>
  {/if}
</div>

<style>
  .video-container {
    position: relative;
    padding-bottom: 1px;
  }

  .card-wrap {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 1;
    position: relative;
    width: 400px;
    max-width: calc(100% - 20px);
    margin: 0 auto 90vh;
  }

  .card {
    background-color: white;
    padding: 18px 24px;
    color: black;
    max-width: 400px;
    border-radius: 4px;
  }

  .card.options {
    width: 100%;
  }

  .option-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  h3 {
    font-size: 1.2em;
    font-weight: bold;
    margin: 8px 0 12px 0;
  }

  label {
    font-size: 14px;
  }

  input {
    margin-left: 12px;
    flex-grow: 2;
  }

  input[type="checkbox"] {
    flex-grow: unset;
  }

  .scroll-track {
    position: sticky;
    bottom: 20px;
    left: 20px;
    background-color: black;
    width: 240px;
    margin: 20px;
    border-radius: 4px;
    color: white;
    padding: 18px 24px;
  }
</style>
