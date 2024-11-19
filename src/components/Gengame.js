import React, { useState, useEffect } from 'react';

const Gengame = () => {
    const [board, setBoard] = useState(Array(6).fill().map( () => Array(5).fill('')));
// The function creates and arroy of 6 rows files them with the undefined data type then in thos 6 rows, another aray is made into 5 rows and fills them with and empty string.

    const [currentRow, setCurrentRow] = useState(0);
// The fucntion uses UseState to locate the row the user is on and updated it based on the row the user is on. Default state is 0 which is the first row.

    const [currentTile, setCurrentTile] = useState(0);
// The fucntion uses UseState to locate the tile the user is on and updated it based on the tile the user is on. Default state is 0 which is the first tile.

    const [targetWord, setTargetWord] = useState('')

    const [gameStatus, SetGameStatus] = useState('loading')

    const [showTryAgain, setShowTryAgain] = useState(false)

    useEffect ( () => {
      const fetchRandomWord = async () => {
        try {
          const response = await fetch('https://random-word-api.vercel.app/api?words=1&length=5');
          const words = await response.json();
          const word = words[0].toUpperCase();
          console.log('Fetched word:', word);
          setTargetWord(word);
          SetGameStatus('playing');
        } catch (error) {
          console.error('Failed to fetch word', error);
          SetGameStatus('error');
        }
      };
      fetchRandomWord()
    }, []);




    useEffect ( () => {
        const handleKeyDown = (event) => {
          if (gameStatus !== 'playing') return;
            const key = event.key.toUpperCase();    
// Simply using using effect to record the event of a key pressed/or rather letter entered and convert it to upped case 


            if (currentRow < 6) {
                if (/^[A-Z]$/.test(key) && currentTile < 5 ) {
//Basically firstly checks is the current row, if less than 6 => Provided that any letter typed is a capital lettter and check the current tile 
                    const newBoard = [...board];
                    newBoard[currentRow][currentTile] = key;
                    setBoard(newBoard);
//SetBoard is re-rendering the updated board(newBoard)
                    setCurrentTile(currentTile + 1);
                } 

                if (key === 'BACKSPACE' && currentTile > 0) {
                  const newBoard = [...board];
                  newBoard[currentRow][currentTile - 1] = '';
                  setBoard(newBoard);
                  setCurrentTile(currentTile - 1);
                }

                if (key === 'ENTER' && currentTile === 5) {
                  const guessedWord = board[currentRow].join('');

                  if (guessedWord === targetWord) {
                    const newBoard = [...board];
                    newBoard[currentRow] = targetWord.split('')
                    setBoard(newBoard)
                    SetGameStatus('won');
                    setShowTryAgain(true);
                    alert('Congratulations! You guessed the correct word')
                  }else if (currentRow === 5) {
                    SetGameStatus('lost');
                    setShowTryAgain(true)
                    alert(`Sorry, the correct word was ${targetWord}.` )
                  }

                  setCurrentRow(prevRow => prevRow+ 1);
                  setCurrentTile(0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown',handleKeyDown);

    }, [board, currentRow, currentTile, targetWord, gameStatus] );

  return (
    <div className="flex flex-col items-center">
    
    {board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-x-2 font-bold text-[40px] mt-2">
        {row.map((letter, letterIndex) => (
          <div
            key={`${rowIndex}-${letterIndex}`}
            className={`
              border w-[62px] h-[62px] grid items-center
              ${currentRow === rowIndex && currentTile === letterIndex ? 'border-2 border-blue-500' : ''}
              ${letter === targetWord[letterIndex] ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'}
            `}
          >
            {letter}
          </div>
        ))}
      </div>
    ))}

{showTryAgain && (
      <div className="mt-4">
        <button
          className="bg-slate-950 border hover:bg-white hover:text-black text-white font-bold py-2 px-4 "
          onClick={() => {
            setCurrentRow(0);
            setCurrentTile(0);
            setBoard(Array(6).fill().map(() => Array(5).fill('')));
            SetGameStatus('loading');
            setShowTryAgain(false);
          }}
        >
          Try Again
        </button>
      </div>
    )}

    <div className="mt-4 text-sm text-gray-500">
      {currentRow < 6 ? 'Type letters to play' : 'Game Over'}
    </div>
  </div>
  )
}

export default Gengame