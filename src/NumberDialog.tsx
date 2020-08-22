import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './NumberDialog.css';
import { useKeyPress } from './hooks/useKeyPress';

export interface NumberDialogProps {
  player: string;
  playerIndex: number;
  initialValue?: number;
  onEnter: (score: number) => void;
  onClose: () => void;
}

export const NumberDialog = ({ player, playerIndex, initialValue, onEnter, onClose }: NumberDialogProps) => {
  const [value, setValue] = useState(initialValue + '');
  const escapePressed = useKeyPress('Escape');
  const enterPressed = useKeyPress('Enter');

  const score = Number(value);
  const submit = () => {
    if (score || initialValue) {
      onEnter(score);
    }
  }

  useEffect(() => {
    if (escapePressed) {
      onClose();
    }
  }, [escapePressed, onClose]);

  useEffect(() => {
    if (enterPressed && (score || initialValue)) {
      onEnter(score);
    }
  }, [enterPressed, onEnter, score, initialValue])

  return <>
    <div className="NumberDialogBackdrop" onClick={onClose}/>
    <div className="NumberDialogModal" onClick={evt => evt.stopPropagation()}>
      <div className="NumberDialogContent">
        <label htmlFor="NumberDialogValue">
          {initialValue ? 'עדכון ניקוד' : 'ניקוד חדש'} ל<span className={`PlayerName Player${playerIndex}`}>{player}</span>:
          <input type="number"
                 id="NumberDialogValue"
                 value={value}
                 autoFocus
                 onFocus={event => event.target.select()}
                 onChange={evt => setValue(evt.target.value)}/>
        </label>
      </div>

      <div className="NumberDialogFooter">
        <button onClick={onClose}>ביטול</button>
        <button onClick={submit}
                disabled={!initialValue && !score}
                className={classNames({ UpdatedScore: initialValue, NewScore: !initialValue, EmptyScore: !score })}>
          {initialValue ? score ? 'עדכן' : 'מחק' : 'הוסף'}
        </button>
      </div>
    </div>
  </>
}
