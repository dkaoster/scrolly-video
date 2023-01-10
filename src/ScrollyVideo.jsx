import React, { useEffect, useRef, useState } from 'react';
import ScrollyVideo from './ScrollyVideo';

function ScrollyVideoComponent(props) {

  // variable to hold the DOM element
  const containerElement = useRef(null);

  // variable to hold the scrollyVideo object
  const [scrollyVideo, setScrollyVideo] = useState(null);

  // Store the props so we know when things change
  const [lastPropsString, setLastPropsString] = useState('');

  useEffect(() => {
    if (containerElement) {
      // separate out the videoPercentage prop
      const { videoPercentage, ...restProps } = props;

      if (JSON.stringify(restProps) !== lastPropsString) {
        // if scrollyvideo already exists and any parameter is updated, destroy and recreate.
        if (scrollyVideo && scrollyVideo.destroy) scrollyVideo.destroy();
        setScrollyVideo(new ScrollyVideo({ scrollyVideoContainer: containerElement.current, ...props }));

        // Save the new props
        setLastPropsString(JSON.stringify(restProps));
      }

      // If we need to update the target time percent
      if (scrollyVideo && typeof videoPercentage === 'number' && videoPercentage >= 0 && videoPercentage <= 1) {
        scrollyVideo.setTargetTimePercent(videoPercentage);
      }
    }

    // Cleanup the component on unmount
    return () => {
      if (scrollyVideo && scrollyVideo.destroy) scrollyVideo.destroy();
    }
  }, [containerElement, props]);

  return (<div ref={containerElement} />);
}

export default ScrollyVideoComponent;
