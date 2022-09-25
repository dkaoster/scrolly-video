<script>
  import SvelteMarkdown from 'svelte-markdown';
  import Link from './markdown-renderers/Link.svelte';

  // eslint-disable-next-line no-undef
  const fetchReadme = fetch('README.md').then((res) => res.text());
  
  const renderers = { link: Link };
</script>

<div class="docs markdown-body">
  {#await fetchReadme then source}
    <SvelteMarkdown {source} {renderers} />
  {/await}
</div>

<style>
  .docs {
    padding: 0 24px;
    margin: 4em auto;
    max-width: 800px;
  }
</style>