import React, { useState, useEffect } from 'react';

const Gengame = () => {
    const [board, setBoard] = useState(Array(6).fill().map( () => Array(5).fill('')));
// The function creates and arroy of 6 rows files them with the undefined data type then in thos 6 rows, another aray is made into 5 rows and fills them with and empty string.

    const [currentRow, setCurrentRow] = useState(0);
// The fucntion uses UseState to locate the row the user is on and updated it based on the row the user is on. Default state is 0 which is the first row.

    const [currentTile, setCurrentTile] = useState(0);
// The fucntion uses UseState to locate the tile the user is on and updated it based on the tile the user is on. Default state is 0 which is the first tile.


    useEffect ( () => {
        const handleKeyDown = (event) => {
            const key = event.key.toUpperCase();    
// Simply using using effect to record the event of a key pressed/or rather letter entered and convert it to upped case 


            if (currentRow < 6) {
                if (/[A-Z]/.test(key) && currentTile < 5 ) {
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
                  setCurrentRow(currentRow + 1);
                  setCurrentRow(0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown',handleKeyDown);

    }, [board, currentRow, currentTile] );

  return (
    <div className="flex flex-col items-center">
    
    {board.map((row, rowIndex) => (
      <div 
        key={rowIndex} 
        className="flex justify-center gap-x-2 font-bold text-[40px] mt-2"
      >
        {row.map((letter, letterIndex) => (
          <div
            key={`${rowIndex}-${letterIndex}`}
            className={`
              border w-[62px] h-[62px] grid items-center
              ${currentRow === rowIndex && currentTile === letterIndex ? 'border-2 border-blue-500' : ''}
              ${letter ? 'border-gray-400' : 'border-gray-200'}
            `}
          >
            {letter}
          </div>
        ))}
      </div>
    ))}

    <div className="mt-4 text-sm text-gray-500">
      {currentRow < 6 ? 'Type letters to play' : 'Game Over'}
    </div>
  </div>
  )
}

export default Gengame