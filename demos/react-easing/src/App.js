import * as d3 from 'd3-ease';
import { useRef, useState } from 'react';
import ScrollyVideo from './ScrollyVideo';

function App() {
  const scrollyRef = useRef();
  const [trackScroll, setTrackScroll] = useState(true);

  return (
    <div className="scrolly-container" style={{ height: '300vh' }}>
      <ScrollyVideo
        ref={scrollyRef}
        src="https://scrollyvideo.js.org/goldengate.mp4"
        trackScroll={trackScroll}
      />

      <div className="scroll-track">
        <h3>Scroll</h3>
        <div className="option-wrap">
          <label className="label" htmlFor="track-scroll">
            Track
          </label>
          <input
            className="input"
            id="track-scroll"
            type="checkbox"
            checked={trackScroll}
            onChange={(e) => setTrackScroll(e.target.checked)}
          />
        </div>
        <div className="option-wrap">
          <input
            id="video-position"
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue={0}
            onChange={(e) => {
              scrollyRef.current.setVideoPercentage(
                parseFloat(e.target.value),
                {
                  easing: d3.easeLinear,
                },
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
