<script>
import ScrollyVideo from './ScrollyVideo.js';

export default {
  data() {
    return {
      // variable to hold the scrollyVideo object
      scrollyVideo: null,

      // Store the props so we know when things change
      lastPropsString: '',
    };
  },
  methods: {
    refreshScrollyVideo(props) {
      // if scrollyvideo already exists and any parameter is updated, destroy and recreate.
      if (this.scrollyVideo) this.scrollyVideo.destroy();
      this.scrollyVideo = new ScrollyVideo({
        scrollyVideoContainer: this.$refs.containerElement,
        ...props
      });
    }
  },
  watch: {
    '$attrs': {
      handler: function() {
        // separate out the videoPercentage prop
        const { videoPercentage, ...restProps } = this.$attrs;

        if (JSON.stringify(restProps) !== this.lastPropsString) {
          this.refreshScrollyVideo(restProps);

          // Save the new props
          this.lastPropsString = JSON.stringify(restProps);
        }

        // If we need to update the target time percent
        if (this.scrollyVideo && typeof videoPercentage === 'number' && videoPercentage >= 0 && videoPercentage <= 1) {
          this.scrollyVideo.setTargetTimePercent(videoPercentage);
        }
      },
      deep: true
    }
  },
  mounted() {
    this.refreshScrollyVideo(this.$attrs);
  },
  unmounted() {
    if (this.scrollyVideo) this.scrollyVideo.destroy();
  }
}
</script>

<template>
  <div ref="containerElement" />
</template>
