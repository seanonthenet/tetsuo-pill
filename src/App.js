import "./App.css";
import SceneComp from "./components/SceneComponent";

function App() {
  return (
    <div className="App" style={{ display: "flex", flexDirection: "row" }}>
      <SceneComp />
      <div id="pill" style={{ width: "80%" }}></div>
    </div>
  );
}

export default App;
