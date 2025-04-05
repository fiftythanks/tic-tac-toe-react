import { useState } from 'react';

function Square({ value, onSquareClick, borderWidth = '1px' }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={{ borderWidth, borderColor: 'black' }}
    >
      {value}
    </button>
  );
}

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
      return { winner: squares[a], indices: [a, b, c] };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const win = calculateWinner(squares);
  let status;
  if (win) {
    status = 'Winner: ' + win.winner;
  } else if (!squares.includes(null)) {
    status = "It's a draw";
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const sqs = [];
  for (let j = 0; j < 9; j++) {
    if (win && win.indices.includes(j)) {
      sqs.push(
        <Square
          key={j}
          value={squares[j]}
          onSquareClick={() => handleClick(j)}
          borderWidth="3px"
        />
      );
    } else {
      sqs.push(
        <Square
          key={j}
          value={squares[j]}
          onSquareClick={() => handleClick(j)}
        />
      );
    }
  }

  const board = [];
  for (let i = 0, j = 0; i < 3; i++, j += 3) {
    board.push(
      <div key={i} className="board-row">
        {sqs.slice(j, j + 3)}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState({
    squares: [Array(9).fill(null)],
    indices: [],
  });
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history.squares[currentMove];
  const [isReversed, setIsReversed] = useState(false);

  function handlePlay(nextSquares) {
    const nextHistory = {
      squares: [...history.squares.slice(0, currentMove + 1), nextSquares],
      indices: [
        ...history.indices.slice(),
        currentSquares.findIndex((el, i) => {
          if (el !== nextSquares[i]) {
            return true;
          }
          return false;
        }),
      ],
    };
    setHistory(nextHistory);
    setCurrentMove(nextHistory.squares.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.squares.map((squares, move) => {
    let description;
    if (move > 0 && move < history.squares.length - 1) {
      description = `Go to move #${move} (${
        Math.floor(history.indices[move - 1] / 3) + 1
      }, ${(history.indices[move - 1] % 3) + 1})`;
    } else if (move === history.squares.length - 1) {
      description = `You are at move #${move}`;
      if (history.indices.length === 0) {
        return <li key={move}>{description}</li>;
      }
      description += ` (${Math.floor(history.indices[move - 1] / 3) + 1}, ${
        (history.indices[move - 1] % 3) + 1
      })`;
      return <li key={move}>{description}</li>;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (isReversed) moves.reverse();

  function reverseOrder() {
    setIsReversed(!isReversed);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button type="button" onClick={reverseOrder}>
          Reverse order
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
