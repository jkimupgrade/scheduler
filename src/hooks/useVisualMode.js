import { useState } from 'react';

export default function useVisualMode (initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (next, replace = false) => {
    if (replace) {
      setHistory(([_, ...prev]) => prev);
    };

    setMode(next);
    setHistory(prev => [next,...prev]);
  
  }

  const back = () => {
    if (history.length === 1) return;
    
    setHistory(([_, ...prev]) => prev);
    setMode(history[1]);
  }
  return { mode, transition, back };
}