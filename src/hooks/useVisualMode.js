import React, {useState} from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace=false) {
    setMode(newMode);

    const tempHistory = [...history];
    if (replace) tempHistory[tempHistory.length-1] = newMode;
    else tempHistory.push(newMode);

    setHistory(tempHistory);
  }

  function back() {
    const tempHistory = [...history];
    
    if (tempHistory.length > 1) {
      tempHistory.pop();
      setHistory(tempHistory);
      setMode(tempHistory[tempHistory.length-1]);
    }
    
  };

  return {mode, transition, back};
}