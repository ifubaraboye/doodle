import React, { useState, useEffect } from 'react';

const Gengame = () => {
    const [board, setBoard] = useState(Array(6).fill().map(() => Array(5).fill('')));

    // UseState to create an array of 6 rows and filling them with 5 columns each with a string
    const [currentRow, setCurrentRow] = useState(0);

    // useStare to determine the current row of the user, default is 0
    const [currentTile, setCurrentTile] = useState(0);

    //// useStare to determine the current tile of the user, default is 0
    const [targetWord, setTargetWord] = useState('');
    const [gameStatus, SetGameStatus] = useState('loading');
    const [showTryAgain, setShowTryAgain] = useState(false);
    const [letterStates, setLetterStates] = useState(Array(6).fill().map(() => Array(5).fill('default')));

    useEffect(() => {
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
        fetchRandomWord();
    }, []);

    const checkWord = (guessedWord, row) => {
        const newLetterStates = [...letterStates];
        const targetLetters = targetWord.split('');
        const letterCounts = {};
        
        // Count occurrences of each letter in target word
        targetWord.split('').forEach(letter => {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        });

        // First pass: Mark correct letters (green)
        guessedWord.split('').forEach((letter, index) => {
            if (letter === targetLetters[index]) {
                newLetterStates[row][index] = 'correct';
                letterCounts[letter]--;
            }
        });
        // Need to understand this

        // Second pass: Mark present letters (yellow)
        guessedWord.split('').forEach((letter, index) => {
            if (newLetterStates[row][index] !== 'correct') {
                if (letterCounts[letter] > 0) {
                    newLetterStates[row][index] = 'present';
                    letterCounts[letter]--;
                } else {
                    newLetterStates[row][index] = 'absent';
                }
            }
        });
        // need to undersand this

        setLetterStates(newLetterStates);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (gameStatus !== 'playing') return;
            const key = event.key.toUpperCase();

            if (currentRow < 6) {
                if (/^[A-Z]$/.test(key) && currentTile < 5) {
                    const newBoard = [...board];
                    newBoard[currentRow][currentTile] = key;
                    setBoard(newBoard);
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
                    checkWord(guessedWord, currentRow);

                    if (guessedWord === targetWord) {
                        SetGameStatus('won');
                        setShowTryAgain(true);
                        alert('Congratulations! You guessed the correct word');
                    } else if (currentRow === 5) {
                        SetGameStatus('lost');
                        setShowTryAgain(true);
                        alert(`Sorry, the correct word was ${targetWord}.`);
                    }

                    setCurrentRow(prevRow => prevRow + 1);
                    setCurrentTile(0);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [board, currentRow, currentTile, targetWord, gameStatus]);

    const getLetterClassName = (rowIndex, letterIndex, letter) => {
        const baseClasses = "border w-[62px] h-[62px] grid items-center ";
        
        if (rowIndex < currentRow) {
            switch (letterStates[rowIndex][letterIndex]) {
                case 'correct':
                    return baseClasses + "bg-green-500 border-green-500 text-white";
                case 'present':
                    return baseClasses + "bg-yellow-500 border-yellow-500 text-white";
                case 'absent':
                    return baseClasses + "bg-gray-500 border-gray-500 text-white";
                default:
                    return baseClasses + "border-gray-400";
            }
        }
        
        return baseClasses + (currentRow === rowIndex && currentTile === letterIndex 
            ? 'border-2 border-grey -500' 
            : 'border-gray-400');
    };

    return (
        <div className="flex flex-col items-center">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-x-2 font-bold text-[40px] mt-2">
                    {row.map((letter, letterIndex) => (
                        <div
                            key={`${rowIndex}-${letterIndex}`}
                            className={getLetterClassName(rowIndex, letterIndex, letter)}
                        >
                            {letter}
                        </div>
                    ))}
                </div>
            ))}

            {showTryAgain && (
                <div className="mt-4">
                    <button
                        className="bg-slate-950 border hover:bg-white hover:text-black text-white font-bold py-2 px-4"
                        onClick={() => {
                            setCurrentRow(0);
                            setCurrentTile(0);
                            setBoard(Array(6).fill().map(() => Array(5).fill('')));
                            setLetterStates(Array(6).fill().map(() => Array(5).fill('default')));
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
    );
};

export default Gengame;