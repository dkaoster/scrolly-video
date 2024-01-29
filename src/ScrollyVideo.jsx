import React, { useEffect, useRef } from 'react';
import ScrollyVideo from './ScrollyVideo';

function ScrollyVideoComponent({
  src,
  transitionSpeed,
  frameThreshold,
  cover,
  sticky,
  full,
  trackScroll,
  useWebCodecs,
  videoPercentage,
  debug,
}) {
  const containerElement = useRef(null);
  const scrollyVideoRef = useRef(null);

  const videoPercentageRef = useRef(videoPercentage);
  videoPercentageRef.current = videoPercentage;

  // effect for destroy and recreate on props change (except video percentage)
  useEffect(() => {
    if (!containerElement.current) return;

    // if scrollyVideo already exists and any parameter is updated, destroy and recreate.
    if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) {
      scrollyVideoRef.current.destroy();
    }

    scrollyVideoRef.current = new ScrollyVideo({
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
      videoPercentage: videoPercentageRef.current,
    });
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

  return <div ref={containerElement} />;
}

export default ScrollyVideoComponent;
