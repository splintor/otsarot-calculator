import React, { useState, MouseEvent } from 'react';
import './App.css';
import { SetupScreen } from './SetupScreen';
import { Player } from './Player';
import { GameBoard } from './GameBoard';

function App() {
  const [gameStep, setGameStep] = useState('setup')
  const [appMenuVisible, setAppMenuVisible] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])

  const setPlayerScores = (player: Player, scores: Player['scores']) => {
    const newPlayers = players.map((p) => p === player ? new Player(player.name, scores) : p);
    setPlayers(newPlayers);
  }

  const moveToSetup = () => setGameStep('setup');

  const startNewGame = () => {
    setPlayers([]);
    moveToSetup();
  }

  const toggleMenu = (evt: MouseEvent) => {
    setAppMenuVisible(!appMenuVisible);
    evt.stopPropagation();
  }

  return (
    <div className="App" onClick={() => setAppMenuVisible(false)}>
      <div className="AppMenuButton" onClick={toggleMenu}><span role="img" aria-label="App Menu">☰</span></div>
      <h2>מחשבון אוצרות או צרות</h2>
      <div className="GameBody">
        {
          gameStep === 'setup' &&
          <SetupScreen players={players} setPlayers={setPlayers} onStart={(players: Player[]) => {
            setGameStep('play');
            setPlayers(players);
          }}/>
        }
        {
          gameStep === 'play' &&
          <GameBoard players={players} setPlayerScores={setPlayerScores}/>
        }
      </div>
      <nav className={`AppMenu ${appMenuVisible ? 'visible' : ''}`}>
        <ul>
          {gameStep === 'play' &&
          <li key="setup">
            <a href="/" onClick={moveToSetup}>הגדרות משחק</a>
          </li>
          }
          {(players.length > 1 || gameStep === 'play') &&
          <li key="new-game">
            <a href="/" onClick={startNewGame}>משחק חדש</a>
          </li>
          }
          <li key="game-guide">
            <a
              href="https://3cc8ed0a-ab93-4ddb-a7c1-d9ce02d75f95.filesusr.com/ugd/2192a6_9e8b173e857b4ed7af589965976c34a8.pdf"
              rel="noopener noreferrer"
              target="_blank">הוראות המשחק</a>
          </li>
          <li key="game-video">
            <a href="https://www.youtube.com/watch?v=rxRgGBmVUnA"
               rel="noopener noreferrer"
               target="_blank">סרטון הדרכה</a>
          </li>
          <li key="mailto">
            <a href="mailto:splintor@gmail.com?Subject=אוצרות או צרות"
               rel="noopener noreferrer"
               target="_blank">שלח משוב...</a>
          </li>
          <li key="github">
            <a href="https://github.com/splintor/otsarot-calculator"
               rel="noopener noreferrer"
               target="_blank">GitHub</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
