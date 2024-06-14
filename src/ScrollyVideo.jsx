import React, {
  forwardRef,
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
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
    lockScroll,
    useWebCodecs,
    videoPercentage,
    debug,
    onReady,
    onChange,
  },
  ref,
) {
  const containerElement = useRef(null);
  const scrollyVideoRef = useRef(null);
  const [instance, setInstance] = useState(null);

  const videoPercentageRef = useRef(videoPercentage);
  videoPercentageRef.current = videoPercentage;

  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

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
      lockScroll,
      useWebCodecs,
      debug,
      onReady: onReadyRef.current,
      onChange: onChangeRef.current,
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
    lockScroll,
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
      scrollyVideoRef.current.setVideoPercentage(videoPercentage);
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
        ? scrollyVideoRef.current.setVideoPercentage.bind(instance)
        : () => {},
    }),
    [instance],
  );

  return <div ref={containerElement} data-scrolly-container />;
});

export default ScrollyVideoComponent;
