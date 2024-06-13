import UAParser from 'ua-parser-js';
import videoDecoder from './videoDecoder';
import { debounce, isScrollPositionAtTarget } from './utils';

/**
 *   ____                 _ _     __     ___     _
 *  / ___|  ___ _ __ ___ | | |_   \ \   / (_) __| | ___  ___
 *  \___ \ / __| '__/ _ \| | | | | \ \ / /| |/ _` |/ _ \/ _ \
 *   ___) | (__| | | (_) | | | |_| |\ V / | | (_| |  __/ (_) |
 *  |____/ \___|_|  \___/|_|_|\__, | \_/  |_|\__,_|\___|\___/
 *                            |___/
 *
 * Responsive scrollable videos without obscure video encoding requirements.
 * Compatible with React, Svelte, Vue, and plain HTML.
 */
class ScrollyVideo {
  constructor({
    src, // The src of the video, required
    scrollyVideoContainer, // The dom element or id that this object will be created in, required
    cover = true, // Whether the video should "cover" inside the container
    sticky = true, // Whether the video should "stick" to the top of the container
    full = true, // Whether the container should expand to 100vh and 100vw
    trackScroll = true, // Whether this object should automatically respond to scroll
    lockScroll = true, // Whether it ignores human scroll while it runs `setVideoPercentage` with enabled `trackScroll`
    transitionSpeed = 8, // How fast the video transitions between points
    frameThreshold = 0.1, // When to stop the video animation, in seconds
    useWebCodecs = true, // Whether to try using the webcodecs approach
    onReady = () => {}, // A callback that invokes on video decode
    onChange = () => {}, // A callback that invokes on video percentage change
    debug = false, // Whether to print debug stats to the console
  }) {
    // Make sure that we have a DOM
    if (typeof document !== 'object') {
      console.error('ScrollyVideo must be initiated in a DOM context');
      return;
    }

    // Make sure the basic arguments are set for scrollyvideo
    if (!scrollyVideoContainer) {
      console.error('scrollyVideoContainer must be a valid DOM object');
      return;
    }
    if (!src) {
      console.error('Must provide valid video src to ScrollyVideo');
      return;
    }

    // Save the container. If the container is a string we get the element
    // eslint-disable-next-line no-undef
    if (scrollyVideoContainer instanceof Element)
      this.container = scrollyVideoContainer;
    // otherwise it should better be an element
    else if (typeof scrollyVideoContainer === 'string') {
      // eslint-disable-next-line no-undef
      this.container = document.getElementById(scrollyVideoContainer);
      if (!this.container)
        throw new Error('scrollyVideoContainer must be a valid DOM object');
    } else {
      throw new Error('scrollyVideoContainer must be a valid DOM object');
    }

    // Save the constructor options
    this.src = src;
    this.transitionSpeed = transitionSpeed;
    this.frameThreshold = frameThreshold;
    this.useWebCodecs = useWebCodecs;
    this.cover = cover;
    this.sticky = sticky;
    this.trackScroll = trackScroll;
    this.onReady = onReady;
    this.onChange = onChange;
    this.debug = debug;

    // Create the initial video object. Even if we are going to use webcodecs,
    // we start with a paused video object
    // eslint-disable-next-line no-undef
    this.video = document.createElement('video');
    this.video.src = src;
    this.video.preload = 'auto';
    this.video.tabIndex = 0;
    this.video.autobuffer = true;
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.pause();
    this.video.load();

    // Start the video percentage at 0
    this.videoPercentage = 0;

    // Adds the video to the container
    this.container.appendChild(this.video);

    // Setting CSS properties for sticky
    if (sticky) {
      this.container.style.display = 'block';
      this.container.style.position = 'sticky';
      this.container.style.top = '0';
    }

    // Setting CSS properties for full
    if (full) {
      this.container.style.width = '100%';
      this.container.style.height = '100vh';
      this.container.style.overflow = 'hidden';
    }

    // Setting CSS properties for cover
    if (cover) this.setCoverStyle(this.video);

    // Detect webkit (safari), because webkit requires special attention
    const browserEngine = new UAParser().getEngine();
    // eslint-disable-next-line no-undef
    this.isSafari = browserEngine.name === 'WebKit';
    if (debug && this.isSafari) console.info('Safari browser detected');

    // Initialize state variables
    this.currentTime = 0; // Saves the currentTime of the video, synced with this.video.currentTime
    this.targetTime = 0; // The target time before a transition happens
    this.canvas = null; // The canvas for drawing the frames decoded by webCodecs
    this.context = null; // The canvas context
    this.frames = []; // The frames decoded by webCodecs
    this.frameRate = 0; // Calculation of frameRate so we know which frame to paint

    const debouncedScroll = debounce(() => {
      // eslint-disable-next-line no-undef
      window.requestAnimationFrame(() => {
        this.setScrollPercent(this.videoPercentage);
      });
    }, 100);

    // Add scroll listener for responding to scroll position
    this.updateScrollPercentage = (jump) => {
      // Used for internally setting the scroll percentage based on built-in listeners
      const containerBoundingClientRect =
        this.container.parentNode.getBoundingClientRect();

      // Calculate the current scroll percent of the video
      const scrollPercent =
        -containerBoundingClientRect.top /
        // eslint-disable-next-line no-undef
        (containerBoundingClientRect.height - window.innerHeight);

      if (this.debug) {
        console.info('ScrollyVideo scrolled to', scrollPercent);
      }

      if (this.targetScrollPosition == null) {
        this.setTargetTimePercent(scrollPercent, { jump });
        this.onChange(scrollPercent);
      } else if (isScrollPositionAtTarget(this.targetScrollPosition)) {
        this.targetScrollPosition = null;
      } else if (lockScroll && this.targetScrollPosition != null) {
        debouncedScroll();
      }
    };

    // Add our event listeners for handling changes to the window or scroll
    if (this.trackScroll) {
      // eslint-disable-next-line no-undef
      window.addEventListener('scroll', this.updateScrollPercentage);

      // Set the initial scroll percentage
      this.video.addEventListener(
        'loadedmetadata',
        () => this.updateScrollPercentage(true),
        { once: true },
      );
    } else {
      this.video.addEventListener(
        'loadedmetadata',
        () => this.setTargetTimePercent(0, { jump: true }),
        { once: true },
      );
    }

    // Add resize function
    this.resize = () => {
      if (this.debug) console.info('ScrollyVideo resizing...');
      // On resize, we need to reset the cover style
      if (this.cover) this.setCoverStyle(this.canvas || this.video);
      // Then repaint the canvas, if we are in useWebcodecs
      this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
    };

    // eslint-disable-next-line no-undef
    window.addEventListener('resize', this.resize);
    this.video.addEventListener('progress', this.resize);

    // Calls decode video to attempt webcodecs method
    this.decodeVideo();
  }

  /**
   * Sets the currentTime of the video as a specified percentage of its total duration.
   *
   * @param percentage - The percentage of the video duration to set as the current time.
   * @param options - Configuration options for adjusting the video playback.
   *    - jump: boolean - If true, the video currentTime will jump directly to the specified percentage. If false, the change will be animated over time.
   *    - transitionSpeed: number - Defines the speed of the transition when `jump` is false. Represents the duration of the transition in milliseconds. Default is 8.
   *    - easing: (progress: number) => number - A function that defines the easing curve for the transition. It takes the progress ratio (a number between 0 and 1) as an argument and returns the eased value, affecting the playback speed during the transition.
   */
  setVideoPercentage(percentage, options = {}) {
    // Early termination if the video percentage is already at the percentage that is intended.
    if (this.videoPercentage === percentage) return;

    if (this.transitioningRaf) {
      // eslint-disable-next-line no-undef
      window.cancelAnimationFrame(this.transitioningRaf);
    }

    this.videoPercentage = percentage;

    this.onChange(percentage);

    if (this.trackScroll) {
      this.setScrollPercent(percentage);
    }

    this.setTargetTimePercent(percentage, options);
  }

  /**
   * Sets the style of the video or canvas to "cover" it's container
   *
   * @param el
   */
  setCoverStyle(el) {
    if (this.cover) {
      /* eslint-disable no-param-reassign */
      el.style.position = 'absolute';
      el.style.top = '50%';
      el.style.left = '50%';
      el.style.transform = 'translate(-50%, -50%)';
      el.style.minWidth = '101%';
      el.style.minHeight = '101%';

      // Gets the width and height of the container
      const { width: containerWidth, height: containerHeight } =
        this.container.getBoundingClientRect();

      // Gets the width and height of the video frames
      const width = el.videoWidth || el.width;
      const height = el.videoHeight || el.height;

      if (this.debug)
        console.info('Container dimensions:', [
          containerWidth,
          containerHeight,
        ]);
      if (this.debug) console.info('Element dimensions:', [width, height]);

      // Determines which axis needs to be 100% and which needs to be scaled
      if (containerWidth / containerHeight > width / height) {
        el.style.width = '100%';
        el.style.height = 'auto';
      } else {
        el.style.height = '100%';
        el.style.width = 'auto';
      }
      /* eslint-enable no-param-reassign */
    }
  }

  /**
   * Uses webCodecs to decode the video into frames
   */
  async decodeVideo() {
    if (!this.useWebCodecs) {
      if (this.debug)
        console.warn('Cannot perform video decode: `useWebCodes` disabled');

      return;
    }

    if (!this.src) {
      if (this.debug)
        console.warn('Cannot perform video decode: no `src` found');

      return;
    }

    try {
      await videoDecoder(
        this.src,
        (frame) => {
          this.frames.push(frame);
        },
        this.debug,
      );
    } catch (error) {
      if (this.debug)
        console.error('Error encountered while decoding video', error);

      // Remove all decoded frames if a failure happens during decoding
      this.frames = [];

      // Force a video reload when videoDecoder fails
      this.video.load();
    }

    // If no frames, something went wrong
    if (this.frames.length === 0) {
      if (this.debug) console.error('No frames were received from webCodecs');

      this.onReady();
      return;
    }

    // Calculate the frameRate based on number of frames and the duration
    this.frameRate = this.frames.length / this.video.duration;
    if (this.debug) console.info('Received', this.frames.length, 'frames');

    // Remove the video and add the canvas
    // eslint-disable-next-line no-undef
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    // Hide the video and add the canvas to the container
    this.video.style.display = 'none';
    this.container.appendChild(this.canvas);
    if (this.cover) this.setCoverStyle(this.canvas);

    // Paint our first frame
    this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));

    this.onReady();
  }

  /**
   * Paints the frame of to the canvas
   *
   * @param frameNum
   */
  paintCanvasFrame(frameNum) {
    // Get the frame and paint it to the canvas
    const currFrame = this.frames[frameNum];

    if (!this.canvas || !currFrame) {
      return;
    }

    if (this.debug) {
      console.info('Painting frame', frameNum);
    }

    // Make sure the canvas is scaled properly, similar to setCoverStyle
    this.canvas.width = currFrame.width;
    this.canvas.height = currFrame.height;
    const { width, height } = this.container.getBoundingClientRect();

    if (width / height > currFrame.width / currFrame.height) {
      this.canvas.style.width = '100%';
      this.canvas.style.height = 'auto';
    } else {
      this.canvas.style.height = '100%';
      this.canvas.style.width = 'auto';
    }

    // Draw the frame to the canvas context
    this.context.drawImage(currFrame, 0, 0, currFrame.width, currFrame.height);
  }

  /**
   * Transitions the video or the canvas to the proper frame.
   *
   * @param options - Configuration options for adjusting the video playback.
   *    - jump: boolean - If true, the video currentTime will jump directly to the specified percentage. If false, the change will be animated over time.
   *    - transitionSpeed: number - Defines the speed of the transition when `jump` is false. Represents the duration of the transition in milliseconds. Default is 8.
   *    - easing: (progress: number) => number - A function that defines the easing curve for the transition. It takes the progress ratio (a number between 0 and 1) as an argument and returns the eased value, affecting the playback speed during the transition.
   */
  transitionToTargetTime({
    jump,
    transitionSpeed = this.transitionSpeed,
    easing = null,
  }) {
    if (this.debug) {
      console.info(
        'Transitioning targetTime:',
        this.targetTime,
        'currentTime:',
        this.currentTime,
      );
    }

    const diff = this.targetTime - this.currentTime;
    const distance = Math.abs(diff);
    const duration = distance * 1000;
    const isForwardTransition = diff > 0;

    const tick = ({ startCurrentTime, startTimestamp, timestamp }) => {
      const progress = (timestamp - startTimestamp) / duration;

      // if frameThreshold is too low to catch condition Math.abs(this.targetTime - this.currentTime) < this.frameThreshold
      const hasPassedThreshold = isForwardTransition
        ? this.currentTime >= this.targetTime
        : this.currentTime <= this.targetTime;

      // If we are already close enough to our target, pause the video and return.
      // This is the base case of the recursive function
      if (
        // eslint-disable-next-line no-restricted-globals
        isNaN(this.targetTime) ||
        // If the currentTime is already close enough to the targetTime
        Math.abs(this.targetTime - this.currentTime) < this.frameThreshold ||
        hasPassedThreshold
      ) {
        this.video.pause();

        if (this.transitioningRaf) {
          // eslint-disable-next-line no-undef
          cancelAnimationFrame(this.transitioningRaf);
          this.transitioningRaf = null;
        }

        return;
      }

      // Make sure we don't go out of time bounds
      if (this.targetTime > this.video.duration)
        this.targetTime = this.video.duration;
      if (this.targetTime < 0) this.targetTime = 0;

      // How far forward we need to transition
      const transitionForward = this.targetTime - this.currentTime;
      const easedProgress =
        easing && Number.isFinite(progress) ? easing(progress) : null;
      const easedCurrentTime = isForwardTransition
        ? startCurrentTime +
          easedProgress * Math.abs(distance) * transitionSpeed
        : startCurrentTime -
          easedProgress * Math.abs(distance) * transitionSpeed;

      if (this.canvas) {
        if (jump) {
          // If jump, we go directly to the frame
          this.currentTime = this.targetTime;
        } else if (easedProgress) {
          this.currentTime = easedCurrentTime;
        } else {
          this.currentTime += transitionForward / (256 / transitionSpeed);
        }

        this.paintCanvasFrame(Math.floor(this.currentTime * this.frameRate));
      } else if (jump || this.isSafari || !isForwardTransition) {
        // We can't use a negative playbackRate, so if the video needs to go backwards,
        // We have to use the inefficient method of modifying currentTime rapidly to
        // get an effect.
        this.video.pause();

        if (easedProgress) {
          this.currentTime = easedCurrentTime;
        } else {
          this.currentTime += transitionForward / (64 / transitionSpeed);
        }

        // If jump, we go directly to the frame
        if (jump) {
          this.currentTime = this.targetTime;
        }

        this.video.currentTime = this.currentTime;
      } else {
        // Otherwise, we play the video and adjust the playbackRate to get a smoother
        // animation effect.
        const playbackRate = Math.max(
          Math.min(transitionForward * 4, transitionSpeed, 16),
          1,
        );
        if (this.debug)
          console.info('ScrollyVideo playbackRate:', playbackRate);
        // eslint-disable-next-line no-restricted-globals
        if (!isNaN(playbackRate)) {
          this.video.playbackRate = playbackRate;
          this.video.play();
        }
        // Set the currentTime to the video's currentTime
        this.currentTime = this.video.currentTime;
      }

      // Recursively calls ourselves until the animation is done.
      if (typeof requestAnimationFrame === 'function') {
        // eslint-disable-next-line no-undef
        this.transitioningRaf = requestAnimationFrame((currentTimestamp) =>
          tick({
            startCurrentTime,
            startTimestamp,
            timestamp: currentTimestamp,
          }),
        );
      }
    };

    if (typeof requestAnimationFrame === 'function') {
      // eslint-disable-next-line no-undef
      this.transitioningRaf = requestAnimationFrame((startTimestamp) => {
        tick({
          startCurrentTime: this.currentTime,
          startTimestamp,
          timestamp: startTimestamp,
        });
      });
    }
  }

  /**
   * Sets the currentTime of the video as a specified percentage of its total duration.
   *
   * @param percentage - The percentage of the video duration to set as the current time.
   * @param options - Configuration options for adjusting the video playback.
   *    - jump: boolean - If true, the video currentTime will jump directly to the specified percentage. If false, the change will be animated over time.
   *    - transitionSpeed: number - Defines the speed of the transition when `jump` is false. Represents the duration of the transition in milliseconds. Default is 8.
   *    - easing: (progress: number) => number - A function that defines the easing curve for the transition. It takes the progress ratio (a number between 0 and 1) as an argument and returns the eased value, affecting the playback speed during the transition.
   */
  setTargetTimePercent(percentage, options = {}) {
    const targetDuration =
      this.frames.length && this.frameRate
        ? this.frames.length / this.frameRate
        : this.video.duration;
    // The time we want to transition to
    this.targetTime = Math.max(Math.min(percentage, 1), 0) * targetDuration;

    // If we are close enough, return early
    if (
      !options.jump &&
      Math.abs(this.currentTime - this.targetTime) < this.frameThreshold
    )
      return;

    // Play the video if we are in video mode
    if (!this.canvas && !this.video.paused) this.video.play();

    this.transitionToTargetTime(options);
  }

  /**
   * Simulate trackScroll programmatically (scrolls on page by percentage of video)
   *
   * @param percentage
   */
  setScrollPercent(percentage) {
    if (!this.trackScroll) {
      console.warn('`setScrollPercent` requires enabled `trackScroll`');
      return;
    }

    const parent = this.container.parentNode;
    const { top, height } = parent.getBoundingClientRect();

    // eslint-disable-next-line no-undef
    const startPoint = top + window.pageYOffset;
    // eslint-disable-next-line no-undef
    const containerHeightInViewport = height - window.innerHeight;
    const targetPosition = startPoint + containerHeightInViewport * percentage;

    if (isScrollPositionAtTarget(targetPosition)) {
      this.targetScrollPosition = null;
    } else {
      // eslint-disable-next-line no-undef
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      this.targetScrollPosition = targetPosition;
    }
  }

  /**
   * Call to destroy this ScrollyVideo object
   */
  destroy() {
    if (this.debug) console.info('Destroying ScrollyVideo');

    if (this.trackScroll)
      // eslint-disable-next-line no-undef
      window.removeEventListener('scroll', this.updateScrollPercentage);

    // eslint-disable-next-line no-undef
    window.removeEventListener('resize', this.resize);

    // Clear component
    if (this.container) this.container.innerHTML = '';
  }
}

export default ScrollyVideo;
