import React, {useEffect, useRef, useCallback} from "react";
import Paper from "paper";

import JigsawPuzzle from "./logics/main";

import Corgi from "./assets/images/corgi.jpg";
import "./App.css";

const App: React.FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>(null);

  const initPuzzle = useCallback(() => {
    const puzzle = new JigsawPuzzle({
      image: image.current as HTMLImageElement,
      tileSize: 50
    });
    console.log(puzzle);
  }, []);

  useEffect(() => {
    Paper.setup(canvas.current as HTMLCanvasElement);
    window.addEventListener("load", initPuzzle);
    return () => {
      window.removeEventListener("load", initPuzzle);
    };
  }, [initPuzzle]);

  return (
    <>
      <canvas id="puzzle" ref={canvas}>
        Your browser does not support canvas.
      </canvas>
      <img
        ref={image}
        src={Corgi}
        style={{display: "none"}}
        alt="test"
        className="puzzle-image"
      />
    </>
  );
};

export default App;
