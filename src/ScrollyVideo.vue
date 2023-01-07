<script>
import ScrollyVideo from './ScrollyVideo';

export default {
  props: [
    'src', 'transitionSpeed', 'frameThreshold', 'cover',
    'sticky', 'full', 'useWebCodecs', 'debug'
  ],
  data() {
    return {
      scrollyVideo: null,
    };
  },
  mounted() {
    if (this.scrollyVideo) this.scrollyVideo.destroy();
    this.scrollyVideo = new ScrollyVideo({
      scrollyVideoContainer: this.$refs.containerElement,
      src: this.src,
      transitionSpeed: this.transitionSpeed,
      frameThreshold: this.frameThreshold,
      cover: this.cover,
      sticky: this.sticky,
      full: this.full,
      useWebCodecs: this.useWebCodecs,
      debug: this.debug
    });
  },
  unmounted() {
    if (this.scrollyVideo) this.scrollyVideo.destroy();
  }
}
</script>

<template>
  <div ref="containerElement" />
</template>
