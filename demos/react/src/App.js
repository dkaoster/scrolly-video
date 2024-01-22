import { useState } from 'react';
import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.cjs.jsx';

function App() {
  const [videoPercentage, setVideoPercentage] = useState(0);
  const [trackScroll, setTrackScroll] = useState(true);

  return (
    <div className='scrolly-container' style={{ height: '300vh' }}>
      <ScrollyVideo
        src='https://scrollyvideo.js.org/goldengate.mp4'
        trackScroll={trackScroll}
        videoPercentage={videoPercentage}
      />

      <div className='scroll-track'>
        <h3>Scroll</h3>
        <div className='option-wrap'>
          <label className='label' htmlFor='track-scroll'>
            Track
          </label>
          <input
            className='input'
            id='track-scroll'
            type='checkbox'
            checked={trackScroll}
            onChange={(e) => setTrackScroll(e.target.checked)}
          />
        </div>
        <div className='option-wrap'>
          <label htmlFor='video-position'>
            {Math.floor(videoPercentage * 100)}%
          </label>
          <input
            id='video-position'
            type='range'
            min='0'
            max='1'
            step='0.01'
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
