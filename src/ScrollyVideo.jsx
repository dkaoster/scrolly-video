import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import ScrollyVideo from './ScrollyVideo';

const ScrollyVideoComponent = forwardRef(function ScrollyVideoComponent(
  {
    src,
    transitionSpeed,
    frameThreshold,
    cover,
    sticky,
    full,
    trackScroll,
    useWebCodecs,
    videoPercentage,
    easing,
    debug,
  },
  ref,
) {
  const containerElement = useRef(null);
  const scrollyVideoRef = useRef(null);
  const [instance, setInstance] = useState(null);

  const videoPercentageRef = useRef(videoPercentage);
  videoPercentageRef.current = videoPercentage;

  const easingRef = useRef(easing);
  easingRef.current = easing;

  // effect for destroy and recreate on props change (except video percentage)
  useEffect(() => {
    if (!containerElement.current) return;

    // if scrollyVideo already exists and any parameter is updated, destroy and recreate.
    if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) {
      scrollyVideoRef.current.destroy();
    }

    const scrollyVideo = new ScrollyVideo({
      scrollyVideoContainer: containerElement.current,
      src,
      transitionSpeed,
      frameThreshold,
      cover,
      sticky,
      full,
      trackScroll,
      useWebCodecs,
      debug,
      easing: easingRef.current,
      videoPercentage: videoPercentageRef.current,
    });

    setInstance(scrollyVideo);
    scrollyVideoRef.current = scrollyVideo;
  }, [
    src,
    transitionSpeed,
    frameThreshold,
    cover,
    sticky,
    full,
    trackScroll,
    useWebCodecs,
    debug,
  ]);

  // effect for video percentage change
  useEffect(() => {
    // If we need to update the target time percent
    if (
      scrollyVideoRef.current &&
      typeof videoPercentage === 'number' &&
      videoPercentage >= 0 &&
      videoPercentage <= 1
    ) {
      scrollyVideoRef.current.setTargetTimePercent(videoPercentage);
    }
  }, [videoPercentage]);

  // effect for unmount
  useEffect(
    () => () => {
      if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) {
        scrollyVideoRef.current.destroy();
      }
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      setVideoPercentage: scrollyVideoRef.current
        ? scrollyVideoRef.current.setTargetTimePercent.bind(instance)
        : () => {},
    }),
    [instance],
  );

  return <div ref={containerElement} data-scrolly-container />;
});

export default ScrollyVideoComponent;
