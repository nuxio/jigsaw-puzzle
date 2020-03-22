import React, {useEffect, useRef} from "react";
import Paper from "paper";

import "./App.css";

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    Paper.setup(canvas.current as HTMLCanvasElement);
  }, []);

  return (
    <canvas id="puzzle" ref={canvas}>
      Your browser does not support canvas.
    </canvas>
  );
};

export default App;
