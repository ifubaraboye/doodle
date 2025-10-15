import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [targetWord, setTargetWord] = useState(null);
  const [gameStatus, setGameStatus] = useState("loading");
  const [board, setBoard] = useState(Array(6).fill(Array(5).fill("")));
  const [currentRow, setCurrentRow] = useState(0);
  const [colorBoard, setColorBoard] = useState(Array(6).fill(Array(5).fill("gray")));

  // Fetch random 5-letter word on start
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch(
          "https://random-word-api.vercel.app/api?words=1&length=5"
        );
        const words = await response.json();
        const word = words[0].toUpperCase();
        console.log("Target Word:", word);
        setTargetWord(word);
        setGameStatus("playing");
      } catch (err) {
        console.error("Error fetching word:", err);
        setGameStatus("error");
      }
    };
    fetchWord();
  }, []);

  // Focus helper
  const focusInput = (row, col) => {
    const inputs = document.querySelectorAll("input[data-cell]");
    const id = `${row}-${col}`;
    const target = Array.from(inputs).find((i) => i.dataset.cell === id);
    if (target) target.focus();
  };

  // Handle input typing
  const handleChange = (e, row, col) => {
    if (row !== currentRow || gameStatus !== "playing") return;

    const value = e.target.value.toUpperCase().slice(-1);
    const newBoard = board.map((r, i) => (i === row ? [...r] : [...r]));
    newBoard[row][col] = value;
    setBoard(newBoard);

    // Move to next input
    if (value && col < 4) focusInput(row, col + 1);
  };

  // Handle keyboard actions
  const handleKeyDown = (e, row, col) => {
    if (row !== currentRow || gameStatus !== "playing") return;

    if (e.key === "Backspace" && !e.target.value && col > 0) {
      focusInput(row, col - 1);
    }

    if (e.key === "Enter") {
      handleSubmitRow();
    }
  };

  // Check the row against the target word
  const handleSubmitRow = () => {
    const guess = board[currentRow].join("");
    if (guess.length < 5) return alert("Type a 5-letter word first!");

    const target = targetWord.split("");
    const guessArr = guess.split("");
    const newColors = Array(5).fill("gray");
    const targetCopy = [...target];

    // First pass: check greens
    guessArr.forEach((letter, i) => {
      if (letter === target[i]) {
        newColors[i] = "green";
        targetCopy[i] = null; // remove from consideration
      }
    });

    // Second pass: check yellows
    guessArr.forEach((letter, i) => {
      if (newColors[i] !== "green" && targetCopy.includes(letter)) {
        newColors[i] = "yellow";
        targetCopy[targetCopy.indexOf(letter)] = null;
      }
    });

    // Update color board
    const updatedColors = colorBoard.map((r, i) =>
      i === currentRow ? newColors : r
    );
    setColorBoard(updatedColors);

    if (guess === targetWord) {
      setGameStatus("won");
      alert("🎉 You guessed it! The word was " + targetWord);
      return;
    }

    if (currentRow === 5) {
      setGameStatus("lost");
      alert("😢 Game over! The word was " + targetWord);
      return;
    }

    setCurrentRow(currentRow + 1);
    focusInput(currentRow + 1, 0);
  };

  // Color styles
  const getColorClass = (color) => {
    switch (color) {
      case "green":
        return "bg-green-600 border-green-600 text-white";
      case "yellow":
        return "bg-yellow-500 border-yellow-500 text-white";
      case "gray":
      default:
        return "bg-zinc-900 border-zinc-800 text-white";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white px-4">
      <h1 className="text-5xl font-extrabold mb-12 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        DOODLE.
      </h1>

      {/* {gameStatus === "loading" && <p>Loading word...</p>} */}
      {gameStatus === "error" && <p>Failed to fetch word</p>}

      <div className="flex flex-col gap-2">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                data-cell={`${rowIndex}-${colIndex}`}
                type="text"
                maxLength={1}
                disabled={rowIndex !== currentRow || gameStatus !== "playing"}
                value={cell}
                onChange={(e) => handleChange(e, rowIndex, colIndex)}
                onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                className={`w-16 h-16 text-center text-2xl font-bold border-2 focus:outline-none focus:ring-2 focus:ring-white/20 uppercase transition-all duration-200 ${getColorClass(
                  colorBoard[rowIndex][colIndex]
                )}`}
              />
            ))}
          </div>
        ))}
      </div>

      {gameStatus !== "playing" && (
        <button
          className="mt-8 px-6 py-2 bg-white text-black font-bold cursor-pointer hover:bg-gray-200 transition"
          onClick={() => window.location.reload()}
        >
          Play Again
        </button>
      )}
    </div>
  );
}

export default App;
