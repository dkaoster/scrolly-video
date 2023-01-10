<script>
  import { getContext } from 'svelte';

  const latestVersion = getContext('npm')
    .then((res) => res['dist-tags'].latest);
</script>

<div class="intro">
  {#await latestVersion then version}
    <pre>version {version}</pre>
  {/await}
  <h1>ScrollyVideo.js</h1>
  <p>Responsive scrollable videos without obscure video encoding requirements. Compatible with React, Svelte, Vue, and plain HTML.</p>
  <a class="npm" target="_blank" rel="noopener noreferrer" href="https://www.npmjs.com/package/scrolly-video">npm</a>
  <a class="github" target="_blank" rel="noopener noreferrer" href="https://github.com/dkaoster/scrolly-video">github</a>
</div>

<style>
  .intro {
    margin: 20vh auto;
    max-width: 800px;
    padding: 0 24px;
  }

  pre {
    font-size: 0.8em;
  }

  h1 {
    margin: 0.2em 0 1.5em;

  }

  p {
    max-width: 600px;
    margin-bottom: 1em;
  }

  a {
    display: inline-block;
    padding: 3px 10px;
    text-decoration: none;
    border-radius: 4px;
    border: 2px solid;
  }

  a.github {
    color: black;
    border-color: black;
  }

  a.github:hover {
    color: white;
    background-color: black;
  }

  a.npm {
    color: #cb3837;
    border-color: #cb3837;
  }

  a.npm:hover {
    color: white;
    background-color: #cb3837;
  }
</style>