import React, { useCallback, useEffect } from 'react';
import { useKeyPress } from './hooks/useKeyPress';
import { Player } from './Player';
import './SetupScreen.css';

interface SetupScreenProps {
  players: Player[];

  setPlayers(players: Player[]): void;

  onStart(players: Player[]): void;
}

const MaxPlayers = 6;

function getLastNotEmptyPlayer(players: Player[], { onlyByName }: { onlyByName: boolean }): number {
  let lastNotEmptyPlayer = players.length - 1;
  while (players[lastNotEmptyPlayer] && !players[lastNotEmptyPlayer].name && (onlyByName || players[lastNotEmptyPlayer].scores.length === 0)) {
    --lastNotEmptyPlayer;
  }
  return lastNotEmptyPlayer;
}

function getValidPlayers(players: Player[]): Player[] | null {
  const validPlayers = players.slice(0, getLastNotEmptyPlayer(players, { onlyByName: true }) + 1);
  return validPlayers.length < 2 || validPlayers.some(p => !p.name) ? null : validPlayers;
}

export const SetupScreen = ({ players, setPlayers, onStart }: SetupScreenProps) => {
  const enterPressed = useKeyPress('Enter');
  const downPressed = useKeyPress('ArrowDown');
  const upPressed = useKeyPress('ArrowUp');

  const validPlayers = getValidPlayers(players);
  const gotoGame = useCallback(() => validPlayers && onStart(validPlayers), [onStart, validPlayers]);
  const startNewGame = () => validPlayers && onStart(validPlayers.map(p => new Player(p.name)));
  const somePlayersHasScores = players.some(p => p.scores.length > 0);

  const updatePlayer = (player: Player, name: string) => {
    let newPlayers = players.includes(player) ? players : [...players, player];
    newPlayers = newPlayers.map(p => p === player ? new Player(name, p.scores) : p)
    const lastNotEmptyPlayer = getLastNotEmptyPlayer(newPlayers, { onlyByName: false });

    if (lastNotEmptyPlayer < newPlayers.length - 1) {
      newPlayers = newPlayers.slice(0, lastNotEmptyPlayer + 1);
    }

    setPlayers(newPlayers);
  }

  useEffect(() => {
    if (downPressed || upPressed) {
      const active = document.querySelector('input:focus');
      if (active) {
        const allInputs = Array.from(document.querySelectorAll('input'));
        const activeIndex = allInputs.indexOf(active as any);
        if (downPressed && activeIndex < allInputs.length - 1) {
          allInputs[activeIndex + 1].focus();
        }

        if (upPressed && activeIndex > 0) {
          allInputs[activeIndex - 1].focus();
        }
      }
    }

    if (enterPressed) {
      gotoGame();
    }
  }, [downPressed, upPressed, enterPressed, gotoGame]);

  const displayedPlayers = players.length < MaxPlayers ? [...players, new Player()] : players;

  return (
    <div className="SetupForm">
      <div className="Instruction">
        האתר הזה מיועד לעזור בניהול הניקוד במשחק <a href="https://www.shafirgames.com" rel="noopener noreferrer"
                                                    target="_blank">אוצרות או צרות</a> של <a
        href="https://www.shafirgames.com/otzarot" rel="noopener noreferrer" target="_blank">משחקי שפיר</a>.
        <p/>
        כדי להתחיל להשתמש באתר, יש למלא את שמות השחקנים, וללחוץ על כפתור ההתחלה.
      </div>
      {
        displayedPlayers.map((player, index) =>
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
      <div className="Instruction">
        <p/>
        האתר לא משמש תחליף למשחק עצמו - להחלפת הקלפים, לזריקת הקוביות, ולחישוב הניקוד שמתקבל בסוף כל שלב.
        <p/>
        האתר רק עוזר לסכם ולעקוב אחרי הניקוד של כל אחד מהשחקנים במשחק.
      </div>
    </div>
  )
}
