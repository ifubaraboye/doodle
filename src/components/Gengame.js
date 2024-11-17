import React, { useState, useEffect } from 'react';

const Gengame = () => {
    const [board, setBoard] = useState(Array(6).fill().map( () => Array(5).fill('')));
    const [currentRow, setCurrentRow] = useState(0);
    const [currentTile, setCurrentTile] = useState(0);



    useEffect ( () => {
        const handleKeyDown = (event) => {
            const key = event.key.toUpperCase();    

            if (currentRow < 6) {
                if (/[A-Z]/.test(key) && currentTile < 5 ) {
                    const newBoard = [...board];
                    newBoard[currentRow][currentTile] = key;
                    setBoard(newBoard);
                    setCurrentTile(currentTile + 1);
                } 
            }

        }
    } )

  return (
    <div>
        <div className='flex justify-center gap-x-2 font-bold text-[40px]'>
        <div className='border w-[62px] h-[62px] grid items-center'>A</div>
        <div className='border w-[62px] h-[62px] grid items-center'>B</div>
        <div className='border w-[62px] h-[62px] grid items-center'>C</div>
        <div className='border w-[62px] h-[62px] grid items-center'>D</div>
        <div className='border w-[62px] h-[62px] grid items-center'>E</div>
      </div>
    </div>
  )
}

export default Gengame