import React, {useState} from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace=false) {
    setMode(newMode);

    const tempHistory = [...history];
    if (replace) tempHistory[tempHistory.length-1] = newMode;
    else tempHistory.push(newMode); // 1: shouldn't use push
    // tempHistory[tempHistory.length] = newMode

    setHistory(tempHistory);
  }

  function back() {
    const tempHistory = [...history];
    
    if (tempHistory.length > 1) {
      tempHistory.pop(); // 2: shouldn't use pop
      // delete?? tempHistory[tempHistory.length - 1]
      // The tempHistory.length -1 part seems so error prone! Moreso than the push was.
      setHistory(tempHistory);
      setMode(tempHistory[tempHistory.length-1]);
    }
    
  };

  return {mode, transition, back};
}