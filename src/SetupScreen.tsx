import React, { useState } from 'react';
import { useKeyPress } from './hooks/useKeyPress';
import { Player } from './Player';
import './SetupScreen.css';

interface SetupScreenProps {
  onStart(players: Player[]): void;
}

const MaxPlayers = 6;
const defaultPlayersArray = [new Player()];

function getLastNotEmptyPlayer(players: Player[]): number {
  let lastNotEmptyPlayer = players.length - 1;
  while (players[lastNotEmptyPlayer] && !players[lastNotEmptyPlayer].name) {
    --lastNotEmptyPlayer;
  }
  return lastNotEmptyPlayer;
}

function getValidPlayers(players: Player[]): Player[] | null {
  const validPlayers = players.slice(0, getLastNotEmptyPlayer(players) + 1);
  return validPlayers.length < 2 || validPlayers.some(p => !p.name) ? null : validPlayers;
}

export const SetupScreen = ({ onStart }: SetupScreenProps) => {
  const [players, setPlayers] = useState<Player[]>(defaultPlayersArray);
  const enterPressed = useKeyPress('Enter');

  const updatePlayer = (player: Player, name: string) => {
    let newPlayers = players.map(p => p === player ? new Player(name) : p);
    const lastNotEmptyPlayer = getLastNotEmptyPlayer(newPlayers);

    if (lastNotEmptyPlayer < newPlayers.length - 2) {
      newPlayers = newPlayers.slice(0, lastNotEmptyPlayer + 2);
    } else if (lastNotEmptyPlayer === newPlayers.length - 1 && newPlayers.length < MaxPlayers) {
      newPlayers = [...newPlayers, new Player('')];
    }

    setPlayers(newPlayers);
  }
  const validPlayers = getValidPlayers(players);
  const gotoGame = () => validPlayers && onStart(validPlayers);

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
      <button className="StartButton" onClick={gotoGame} dir="rtl" disabled={!Boolean(validPlayers)}>
        להתחלת המשחק!
      </button>
    </div>
  )
}
