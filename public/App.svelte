<div class="intro">
  <h1>ScrollyVideo</h1>
  <p>Responsive scrollable videos without obscure video encoding requirements.</p>
</div>

<div class="video-container">
  {@html '<scrolly-video src="goldengate.mp4" usewebcodecs="true" debug="true" />'}
  <div class="card-wrap">
    <div class="card">
      You've likely seen this kind of animating video before in visual journalism, marketing materials, or other websites.
    </div>
  </div>
  <div class="card-wrap">
    <div class="card">
      This library provides a way to easily create these kinds of scrolling video experiences, without fussing with special video encoding formats.
    </div>
  </div>
</div>

<div class="docs">
  <h2>ScrollyVideo Documentation</h2>
</div>

<style>
  .intro {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

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
    padding: 24px;
    color: black;
    max-width: 400px;
  }

  .docs {
    margin: 4em auto;
    width: 800px;
  }
</style>
