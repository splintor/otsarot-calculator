import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useKeyPress } from './hooks/useKeyPress';
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
      const newScores = score
        ? scoreIndex === player.scores.length
          ? [...player.scores, score]
          : player.scores.map((v, i) => i === scoreIndex ? score : v)
        : player.scores.filter((_, i) => i !== scoreIndex)
      setNumberDialogProps(null)
      setPlayerScores(player, newScores);
    },
  });
}

function onDeletePressed(setPlayerScores: GameBoardProps['setPlayerScores'], player: Player, scoreIndex: number) {
  setPlayerScores(player, player.scores.filter((_, i) => i !== scoreIndex));
}

function getMaxTotal(players: Player[]): number | undefined {
  const maxTotal = players.reduce((result, { total }) => Math.max(result, total), -Infinity);
  const allMax = players.every(({ total }) => total === maxTotal);
  return allMax ? undefined : maxTotal;
}

export const GameBoard = ({ players, setPlayerScores: setPlayerScore }: GameBoardProps) => {
  const [numberDialogProps, setNumberDialogProps] = useState<NumberDialogProps | null>(null);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>();
  const [activeScoreIndex, setActiveScoreIndex] = useState<number>();
  const [enterIsMeantToNumberDialog, setEnterIsMeantToNumberDialog] = useState(false);
  const enterPressed = useKeyPress('Enter');
  const spacePressed = useKeyPress(' ');
  const deletePressed = useKeyPress('Delete');
  const downPressed = useKeyPress('ArrowDown');
  const upPressed = useKeyPress('ArrowUp');
  const leftPressed = useKeyPress('ArrowLeft');
  const rightPressed = useKeyPress('ArrowRight');

  useEffect(() => {
    if (activePlayerIndex !== undefined && activeScoreIndex !== undefined) {
      const activePlayer = players[activePlayerIndex];
      if (enterPressed || spacePressed) {
        if (enterIsMeantToNumberDialog) {
          if (!numberDialogProps) {
            setEnterIsMeantToNumberDialog(false);
          }
        } else {
          if (numberDialogProps) {
            setEnterIsMeantToNumberDialog(true);
          } else {
            onPlayerScoreClick(setNumberDialogProps, setPlayerScore, activePlayer, activePlayerIndex, activeScoreIndex)();
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterPressed, spacePressed, activeScoreIndex, activePlayerIndex, setPlayerScore, players, numberDialogProps])

  useEffect(() => {
    if (activePlayerIndex !== undefined && activeScoreIndex !== undefined) {
      const activePlayer = players[activePlayerIndex];
      if (deletePressed && activeScoreIndex < activePlayer.scores.length && !numberDialogProps) {
        onDeletePressed(setPlayerScore, activePlayer, activeScoreIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletePressed])

  useEffect(() => {
    if (downPressed || upPressed) {
      if (activePlayerIndex === undefined) {
        setActivePlayerIndex(0);
        setActiveScoreIndex(downPressed ? 0 : players[0].scores.length);
        return;
      }

      setActiveScoreIndex(activeScoreIndex === undefined ? 0 :
        downPressed
          ? Math.min(activeScoreIndex + 1, players[activePlayerIndex].scores.length)
          : Math.max(activeScoreIndex - 1, 0))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upPressed, downPressed]);

  useEffect(() => {
    if (leftPressed || rightPressed) {
      if (activePlayerIndex === undefined) {
        setActivePlayerIndex(leftPressed ? 0 : players.length - 1);
        setActiveScoreIndex(0);
        return;
      }

      const newPlayerIndex = leftPressed ? Math.min(activePlayerIndex + 1, players.length - 1) : Math.max(activePlayerIndex - 1, 0);
      setActivePlayerIndex(newPlayerIndex);
      setActiveScoreIndex(activeScoreIndex === undefined ? 0 : Math.min(activeScoreIndex, players[newPlayerIndex].scores.length))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leftPressed, rightPressed]);

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
                <div className={classNames('PlayerScore', 'Score', { Active: index === activePlayerIndex && scoreIndex === activeScoreIndex })}
                     onClick={onPlayerScoreClick(setNumberDialogProps, setPlayerScore, player, index, scoreIndex)}
                     key={scoreIndex}>
                  <span>{score}</span>
                </div>)
            }
            <div className={classNames('PlayerScore', 'Score', { Active: index === activePlayerIndex && player.scores.length === activeScoreIndex })}
                 onClick={onPlayerScoreClick(setNumberDialogProps, setPlayerScore, player, index, player.scores.length)}
                 key={-1}/>
          </div>)
      }
    </div>
    {numberDialogProps && <NumberDialog {...numberDialogProps}/>}
  </div>
}
