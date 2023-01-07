<script>
import ScrollyVideo from './ScrollyVideo';

export default {
  data() {
    return {
      scrollyVideo: null,
    };
  },
  methods: {
    refreshScrollyVideo() {
      if (this.scrollyVideo) this.scrollyVideo.destroy();
      this.scrollyVideo = new ScrollyVideo({
        scrollyVideoContainer: this.$refs.containerElement,
        ...this.$attrs
      });
    }
  },
  watch: {
    '$attrs': {
      handler: function() {
        this.refreshScrollyVideo();
      },
      deep: true
    }
  },
  mounted() {
    this.refreshScrollyVideo();
  },
  unmounted() {
    if (this.scrollyVideo) this.scrollyVideo.destroy();
  }
}
</script>

<template>
  <div ref="containerElement" />
</template>
