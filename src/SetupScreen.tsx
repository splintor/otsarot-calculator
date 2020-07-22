import React, { useEffect } from 'react';
import { useKeyPress } from './hooks/useKeyPress';
import { Player } from './Player';
import './SetupScreen.css';

interface SetupScreenProps {
  players: Player[];

  setPlayers(players: Player[]): void;

  onStart(players: Player[]): void;
}

const MaxPlayers = 6;

function getLastNotEmptyPlayer(players: Player[]): number {
  let lastNotEmptyPlayer = players.length - 1;
  while (players[lastNotEmptyPlayer] && !players[lastNotEmptyPlayer].name && players[lastNotEmptyPlayer].scores.length === 0) {
    --lastNotEmptyPlayer;
  }
  return lastNotEmptyPlayer;
}

function getValidPlayers(players: Player[]): Player[] | null {
  const validPlayers = players.slice(0, getLastNotEmptyPlayer(players) + 1);
  return validPlayers.length < 2 || validPlayers.some(p => !p.name) ? null : validPlayers;
}

export const SetupScreen = ({ players, setPlayers, onStart }: SetupScreenProps) => {
  const enterPressed = useKeyPress('Enter');

  const updatePlayer = (player: Player, name: string) => {
    let newPlayers = players.map(p => p === player ? new Player(name, p.scores) : p);
    const lastNotEmptyPlayer = getLastNotEmptyPlayer(newPlayers);

    if (lastNotEmptyPlayer < newPlayers.length - 2) {
      newPlayers = newPlayers.slice(0, lastNotEmptyPlayer + 2);
    } else if (lastNotEmptyPlayer === newPlayers.length - 1 && newPlayers.length < MaxPlayers) {
      newPlayers = [...newPlayers, new Player('')];
    }

    setPlayers(newPlayers);
  }

  useEffect(() => {
    if (players.length === 0 || (players.length < MaxPlayers && players[players.length - 1].name)) {
      setPlayers([...players, new Player()]);
    }
  }, [players, setPlayers]);

  const validPlayers = getValidPlayers(players);
  const gotoGame = () => validPlayers && onStart(validPlayers);
  const startNewGame = () => validPlayers && onStart(validPlayers.map(p => new Player(p.name)));
  const somePlayersHasScores = players.some(p => p.scores.length > 0);

  if (enterPressed) {
    gotoGame();
  }

  return (
    <div className="SetupForm">
      {
        players.map((player, index) =>
          <label htmlFor={`player${index}`} dir="rtl" key={index}>
            {`שחקנ/ית ${index + 1}:`}
            <input type="text"
                   autoFocus={index === 0}
                   onFocus={event => event.target.select()}
                   name={`player${index}`}
                   value={player.name}
                   onChange={event => updatePlayer(player, event.target.value)}/>
          </label>)
      }
      <div className="Buttons">
        <button className="StartButton" onClick={gotoGame} dir="rtl" disabled={!Boolean(validPlayers)}>
          {somePlayersHasScores ? 'חזרה למשחק' : 'להתחלת המשחק!'}
        </button>

        {somePlayersHasScores &&
        <button className="NewGameButton" onClick={startNewGame} dir="rtl" disabled={!Boolean(validPlayers)}>
          משחק חדש!
        </button>}
      </div>
    </div>
  )
}
