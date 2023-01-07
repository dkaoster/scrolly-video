import React, { useEffect, useRef, useState } from 'react';
import ScrollyVideo from './ScrollyVideo';

function ScrollyVideoComponent(props) {
  const containerElement = useRef(null);
  const [scrollyVideo, setScrollyVideo] = useState(null);

  useEffect(() => {
    if (scrollyVideo) scrollyVideo.destroy();
    setScrollyVideo(new ScrollyVideo({ scrollyVideoContainer: containerElement.current, ...props }));
  }, [containerElement, props]);

  return (<div ref={containerElement} />);
}

export default ScrollyVideoComponent;
