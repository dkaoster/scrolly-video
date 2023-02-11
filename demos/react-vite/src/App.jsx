import ScrollyVideo from 'scrolly-video/dist/ScrollyVideo.esm.jsx'

function App() {
  return (
    <div className={'scrolly-container'} style={{ height: '300vh' }}>
      <ScrollyVideo src="https://scrollyvideo.js.org/goldengate.mp4" />
    </div>
  )
}

export default App
