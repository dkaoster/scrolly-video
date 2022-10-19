import "scrolly-video";
import './App.css';

function App() {
  return (
    <div className="App">
      <scrolly-video src="https://scrollyvideo.js.org/goldengate.mp4" sticky={false} full={false} />
    </div>
  );
}

export default App;
