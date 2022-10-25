import React, { useState, useEffect } from 'react';
import Square from './Square';

type Scores = {
  [key: string] : number
}

const INITIAL_GAME_STATE = ["", "", "", "", "", "", "", "", ""];
const INITIAL_SCORES: Scores = {X: 0, O: 0}
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App() {
  const [gameState, setGameState] = useState(INITIAL_GAME_STATE);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [scores, setScores ] = useState(INITIAL_SCORES);

  useEffect(() => {
    const storedScores = localStorage.getItem("scores")
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, [])
  

  /*change player everytime gameState changes */
  useEffect(() => {
    if (gameState === INITIAL_GAME_STATE) {
      return;
    }
    checkForWinner();
  }, [gameState]);

  const resetBoard = () => setGameState(INITIAL_GAME_STATE)

  const handleWin = () => {
    window.alert(`Congrats player ${currentPlayer}! You are the winner!`);

    const newPlayerScore = scores[currentPlayer] + 1
    const newScores = {...scores}
    newScores[currentPlayer] = newPlayerScore
    setScores(newScores)
    localStorage.setItem("scores", JSON.stringify(newScores));

    resetBoard();
  }

  const handleDraw = () => {
    window.alert("The game ended in a draw");
    resetBoard();
  }
  
  const resetScores = () => {
    localStorage.removeItem("scores");
    window.location.reload();
  }

  const checkForWinner = () => {
    let roundWon = false;

    /*loop over the WINNNING_COMBOS */
    for (let i = 0; i < WINNING_COMBOS.length; i++) {
      const winCombo = WINNING_COMBOS[i];

      let a = gameState[winCombo[0]]
      let b = gameState[winCombo[1]]
      let c = gameState[winCombo[2]]

      /*continue operator restart the loop onto the next index. loop continues if any of it are emptry string until winning combo condition is met */
      if ([a,b,c].includes("")) {
        continue;
      }

      /*if three are equal, exit the lopp by breaking */
      if (a === b && b === c ) {
        roundWon = true;
        break;
      }
    }

      if (roundWon) {
        setTimeout(() => handleWin(), 500);
        return;
      }
      /*if all are filled an no Winning COmbo met, then it's draw */
      if (!gameState.includes("")) {
        setTimeout(() => handleDraw(), 500);
        return
      }
      /*change player every after the game */
      changePlayer();
    }

  /**change player for every click, set currentPLayer first as X */
  const changePlayer = () => {
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleCellClick = (event: any) => {
    /*create cellIndex and assign the target value as Number */
    const cellIndex = Number(event.target.getAttribute("data-cell-index"));

    const currentValue = gameState[cellIndex];
    /*if there's a currnet value already, do an early return so it won't override */
    if (currentValue) {
      return;
    }
    /*spread the game state into and array and call it newValues */
    const newValues = [...gameState];
    /*apply the current pplayer to the index that was clicked */
    newValues[cellIndex] = currentPlayer;
    /*then reset the newValues in the gameState */
    setGameState(newValues);

  };
  return (
    <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-cyan-500 to-blue-500">
            <h1 className="text-center text-5xl mb-4 font-display text-white">Tic Tac Toe</h1>
            <div>
                <div className="grid grid-cols-3 gap-3 mx-auto w-96">
                    {gameState.map((player, index) => (
                    <Square key={index} onClick={handleCellClick} {...{index, player}}/>
                    ))}
                </div>
                <div className="mx-auto w-96 text-xl text-serif">
                  <p className="text-white mt-1">Next Player: <span>{currentPlayer}</span></p>
                  <p className="text-white mt-1">Player X Wins: <span>{scores["X"]}</span></p>
                  <p className="text-white mt-1">Player O Wins: <span>{scores["O"]}</span></p>
                  <button className="text-white bg-black" onClick={() => resetScores()}>Reset Scores</button>
                </div>
            </div>
        </div>
  );
}

export default App;
