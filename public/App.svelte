<script>
  import { setContext } from 'svelte';
  import Landing from './Landing.svelte';
  import ScrollyVideoDemo from './ScrollyVideoDemo.svelte';
  import Docs from './Docs.svelte';

  // eslint-disable-next-line no-undef
  const npm = fetch('https://registry.npmjs.org/scrolly-video')
    .then((res) => res.json());

  setContext('npm', npm);
</script>

<Landing />
<ScrollyVideoDemo />
<Docs />
