import { useState } from 'react';

export default function useVisualMode (initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (next) => {
    setMode(next);
    setHistory([...history, next]);
  }
  const back = () => {
    if (history.length === 1) {
      return;
    }
    history.splice(history.length - 1);
    setMode(history[history.length - 1]);
  }
  return { mode, transition, back};
}