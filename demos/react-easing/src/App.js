import * as d3 from 'd3-ease';
import { useState } from 'react';
import ScrollyVideo from './ScrollyVideo';

function App() {
  const [videoPercentage, setVideoPercentage] = useState(0);
  const [trackScroll, setTrackScroll] = useState(true);

  return (
    <div className="scrolly-container" style={{ height: '300vh' }}>
      <ScrollyVideo
        src="https://scrollyvideo.js.org/goldengate.mp4"
        trackScroll={trackScroll}
        videoPercentage={videoPercentage}
        easing={(progress) => {
          return d3.easeBounce(progress);
          // {progress: 0.00848958669503906, step: 0.06666666666666667}

          // return d3.easeLinear(progress);
          // {progress: 0.886415172129458, step: 0.06666666666666667}
        }}
        transitionSpeed={1}
        // frameThreshold={0.1}
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
          <label htmlFor="video-position">
            {Math.floor(videoPercentage * 100)}%
          </label>
          <input
            id="video-position"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={videoPercentage}
            onChange={(e) => {
              setVideoPercentage(parseFloat(e.target.value));
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
