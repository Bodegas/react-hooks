// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import React, {useEffect} from "react";
import {useLocalStorageState} from "../utils";

function Board({
  squares,
  setSquares,
  currentStep,
  setCurrentStep,
  setHistory,
  history,
  winner,
  nextValue,
}) {
  function handleClickSquare(squareIndex) {
    if (winner || squares[squareIndex]) {
      return;
    }
    const newSquares = [...squares];
    newSquares[squareIndex] = nextValue;
    setSquares(newSquares);
    setCurrentStep(currentStep => currentStep + 1);
    setHistory(history => [...history.slice(0, currentStep + 1), newSquares]);
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => handleClickSquare(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Moves({history, currentStep, setCurrentStep}) {
  return (
    <ol>
      {history.map((step, index) => (
        <li key={index}>
          {currentStep === index ? (
            <button disabled onClick={() => setCurrentStep(index)}>{`Go to ${
              index === 0 ? "game start (current)" : `move # ${index} (current)`
            }`}</button>
          ) : (
            <button onClick={() => setCurrentStep(index)}>{`Go to ${
              index === 0 ? "game start" : `move # ${index}`
            }`}</button>
          )}
        </li>
      ))}
    </ol>
  );
}

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    "squares",
    Array(9).fill(null),
  );
  const [history, setHistory] = useLocalStorageState("history", [
    Array(9).fill(null),
  ]);
  const [currentStep, setCurrentStep] = useLocalStorageState("currentStep", 0);

  const nextValue = calculateNextValue(squares);
  const winner = calculateWinner(squares);
  const status = calculateStatus(winner, squares, nextValue);

  useEffect(() => {
    setSquares(history[currentStep]);
  }, [currentStep]);

  function restart() {
    setSquares(Array(9).fill(null));
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={squares}
          currentStep={currentStep}
          setSquares={setSquares}
          nextValue={nextValue}
          winner={winner}
          history={history}
          setHistory={setHistory}
          setCurrentStep={setCurrentStep}
        />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <Moves
          history={history}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === "X").length;
  const oSquaresCount = squares.filter(r => r === "O").length;
  return oSquaresCount === xSquaresCount ? "X" : "O";
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
