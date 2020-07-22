import React, { useState } from 'react';
import './App.css';
import { SetupScreen } from './SetupScreen';
import { Player } from './Player';
import { GameBoard } from './GameBoard';

function App() {
  const [gameStep, setGameStep] = useState('setup')
  const [players, setPlayers] = useState<Player[]>([])

  const setPlayerScores = (player: Player, scores: Player['scores']) => {
    const newPlayers = players.map((p) => p === player ? new Player(player.name, scores) : p);
    setPlayers(newPlayers);
  }

  return (
    <div className="App">
      <div className="AppMenu">☰</div>
      <h2>אוצרות או צרות</h2>
      <div className="GameBody">
        {
          gameStep === 'setup' &&
          <SetupScreen onStart={(players: Player[]) => {
            setGameStep('play');
            setPlayers(players);
          }}/>
        }
        {
          gameStep === 'play' &&
          <GameBoard players={players} setPlayerScores={setPlayerScores}/>
        }
      </div>
    </div>
  );
}

export default App;
