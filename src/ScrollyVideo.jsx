import React, { useEffect, useRef, useState } from 'react';
import ScrollyVideo from './ScrollyVideo';

function ScrollyVideoComponent(props) {

  // variable to hold the DOM element
  const containerElement = useRef(null);

  // ref to hold the scrollyVideo object
  const scrollyVideoRef = useRef(null);

  // Store the props so we know when things change
  const [lastPropsString, setLastPropsString] = useState('');

  useEffect(() => {
    if (containerElement) {
      // separate out the videoPercentage prop
      const { videoPercentage, ...restProps } = props;

      if (JSON.stringify(restProps) !== lastPropsString) {
        // if scrollyvideo already exists and any parameter is updated, destroy and recreate.
        if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) scrollyVideoRef.current.destroy();
        scrollyVideoRef.current = new ScrollyVideo({ scrollyVideoContainer: containerElement.current, ...props });

        // Save the new props
        setLastPropsString(JSON.stringify(restProps));
      }

      // If we need to update the target time percent
      if (scrollyVideoRef.current && typeof videoPercentage === 'number' && videoPercentage >= 0 && videoPercentage <= 1) {
        scrollyVideoRef.current.setTargetTimePercent(videoPercentage);
      }
    }

    // Cleanup the component on unmount
    return () => {
      if (scrollyVideoRef.current && scrollyVideoRef.current.destroy) scrollyVideoRef.current.destroy();
    }
  }, [containerElement, props]);

  return (<div ref={containerElement} />);
}

export default ScrollyVideoComponent;
