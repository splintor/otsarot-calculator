import React, { useState, MouseEvent, MouseEventHandler, useEffect } from 'react';
import './App.css';
import GithubCorner from 'react-github-corner';
import { SetupScreen } from './SetupScreen';
import { Player } from './Player';
import { GameBoard } from './GameBoard';

type GameSteps = 'setup' | 'play';
const repoUrl = 'https://github.com/splintor/otsarot-calculator';

function App() {
  const [gameStep, setGameStep] = useState<GameSteps>('setup')
  const [appMenuVisible, setAppMenuVisible] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    document.title = gameStep === 'setup' ? 'מחשבון אוצרות או צרות - הגדות משחק' : 'מחשבון אוצרות או צרות';
  }, [gameStep]);

  useEffect(() => {
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, []);

  const onPopState = (event: PopStateEvent) => setGameStep(event.state?.setup ? 'play' : 'setup');

  const setPlayerScores = (player: Player, scores: Player['scores']) => {
    const newPlayers = players.map((p) => p === player ? new Player(player.name, scores) : p);
    setPlayers(newPlayers);
  }

  const menuHandler = (fn: () => void): MouseEventHandler => (event: MouseEvent) => {
    event.preventDefault();
    fn();
  }

  const moveToSetup = () => {
    window.history.back();
  };

  const moveToGame = (players: Player[]) => {
    setGameStep('play');
    setPlayers(players);
    window.history.pushState({ setup: true }, '');
  }

  const startNewGame = () => {
    setPlayers([]);
    moveToSetup();
  }

  const clearScores = () => {
    setPlayers(players.map(p => new Player(p.name, [])));
  }

  const toggleMenu = (evt: MouseEvent) => {
    setAppMenuVisible(!appMenuVisible);
    evt.stopPropagation();
  }

  return (
    <div className="App" onClick={() => setAppMenuVisible(false)}>
      <div className={`AppMenuButton ${appMenuVisible ? 'pressed' : ''}`} onClick={toggleMenu}><span role="img" aria-label="App Menu">☰</span></div>
      <h2>
        <GithubCorner href={repoUrl} size={60}/>
        מחשבון אוצרות או צרות
      </h2>
      <div className="GameBody">
        {
          gameStep === 'setup' &&
          <SetupScreen players={players} setPlayers={setPlayers} onStart={moveToGame}/>
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
            <a href="/" onClick={menuHandler(moveToSetup)}>הגדרות משחק</a>
          </li>
          }
          {(players.length > 1 || gameStep === 'play') &&
          <li key="new-game">
            <a href="/" onClick={menuHandler(startNewGame)}>משחק חדש</a>
          </li>
          }
          {(players.some(p => p.scores.length > 0) && gameStep === 'play') &&
          <li key="clear-scores">
            <a href="/" onClick={menuHandler(clearScores)}>איפוס נקודות</a>
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
            <a href={repoUrl}
               rel="noopener noreferrer"
               target="_blank">GitHub</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
