import React, { useState, MouseEvent } from 'react';
import classNames from 'classnames';
import { NumberDialog, NumberDialogProps } from './NumberDialog';
import { Player } from './Player';
import './GameBoard.css';

interface GameBoardProps {
  players: Player[];

  setPlayerScores(player: Player, scores: number[]): void;
}

const onPlayerScoreClick = (setNumberDialogProps: (value: NumberDialogProps | null) => void, setPlayerScores: GameBoardProps['setPlayerScores'], player: Player, playerIndex: number, scoreIndex: number) => () => {
  setNumberDialogProps({
    initialValue: player.scores[scoreIndex],
    player: player.name,
    playerIndex,
    onClose: () => setNumberDialogProps(null),
    onEnter: (score: number) => {
      const newScores = scoreIndex === player.scores.length
        ? [...player.scores, score]
        : player.scores.map((v, i) => i === scoreIndex ? score : v);
      setNumberDialogProps(null)
      setPlayerScores(player, newScores);
    },
  });
}

const onPlayerRemoveScoreClick = (setPlayerScores: GameBoardProps['setPlayerScores'], player: Player, scoreIndex: number) => (event: MouseEvent) => {
  event.stopPropagation();
  const newScores = player.scores.filter((_, i) => i !== scoreIndex);
  setPlayerScores(player, newScores);
}

function getMaxTotal(players: Player[]): number | undefined {
  const maxTotal = players.reduce((result, { total }) => Math.max(result, total), -Infinity);
  const allMax = players.every(({ total }) => total === maxTotal);
  return allMax ? undefined : maxTotal;
}

export const GameBoard = ({ players, setPlayerScores: setPlayerScore }: GameBoardProps) => {
  const [numberDialogProps, setNumberDialogProps] = useState<NumberDialogProps | null>(null);
  const maxTotal = getMaxTotal(players);

  return <div className="GameBoard">
    <div className="GameBoard-Header">
      {players.map((player, index) =>
        <div className={classNames('PlayerTitle', 'Score', { MaxPlayer: player.total === maxTotal })} key={index}>
          <div>
            <div className="PlayerName">{player.name}</div>
            <div className="PlayerTotal">
              <div>סה"כ: </div>
              <div className="Total">{player.total}</div>
              {player.isWinner && <div className="Winner"><span role="img" aria-label="Winner Icon">👑</span></div>}
            </div>
          </div>
        </div>)}
    </div>
    <div className="GameBoard-Body">
      {
        players.map((player, index) =>
          <div className={`PlayerColumn Player${index}`} key={index}>
            {
              player.scores.map((score, scoreIndex) =>
                <div className="PlayerScore Score"
                     onClick={onPlayerScoreClick(setNumberDialogProps, setPlayerScore, player, index, scoreIndex)}
                     key={scoreIndex}>
                  <span>{score}</span>
                  <div className="PlayerRemoveScoreButton"
                       onClick={onPlayerRemoveScoreClick(setPlayerScore, player, scoreIndex)}>X
                  </div>
                </div>)
            }
            <div className="PlayerNewScore Score"
                 onClick={onPlayerScoreClick(setNumberDialogProps, setPlayerScore, player, index, player.scores.length)}
                 key={-1}/>
          </div>)
      }
    </div>
    {numberDialogProps && <NumberDialog {...numberDialogProps}/>}
  </div>
}
