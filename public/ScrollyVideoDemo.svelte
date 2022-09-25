<script>
  const cards = [
    'This kind of scrolling video is common in visual journalism, marketing materials, or other scrollytelling applications.',
    'This library provides a way to easily create these kinds of scrolling video experiences, without fussing with special video encoding formats.',
    'Compatible with React, Angular, Svelte, Vue, and plain HTML via webcomponents.',
  ];
</script>

<div class="video-container">
  {@html '<scrolly-video src="goldengate.mp4" usewebcodecs="true" debug="true" />'}

  {#each cards as card}
    <div class="card-wrap">
      <div class="card">
        {card}
      </div>
    </div>
  {/each}
</div>

<style>
  .video-container {
    position: relative;
  }

  .card-wrap {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    z-index: 1;
    position: relative;
  }

  .card {
    background-color: white;
    padding: 18px 24px;
    color: black;
    max-width: 400px;
    border-radius: 4px;
  }
</style>
