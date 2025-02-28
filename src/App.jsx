import React, { useState } from 'react';
import StopWatch from './components/StopWatch';
import './App.css';

function App() {
  const [stopwatches, setStopwatches] = useState([
    { id: 1, title: 'ストップウォッチ' }
  ]);

  // 新しいストップウォッチを追加
  const addStopwatch = () => {
    const newId = stopwatches.length > 0 
      ? Math.max(...stopwatches.map(sw => sw.id)) + 1 
      : 1;
    
    setStopwatches([
      ...stopwatches,
      { id: newId, title: 'ストップウォッチ' }
    ]);
  };

  // ストップウォッチを削除
  const removeStopwatch = (id) => {
    setStopwatches(stopwatches.filter(sw => sw.id !== id));
  };
  
  // ストップウォッチのタイトルを変更
  const handleTitleChange = (id, newTitle) => {
    setStopwatches(stopwatches.map(sw => 
      sw.id === id ? { ...sw, title: newTitle } : sw
    ));
  };

  return (
    <div className="app">
      <h1>マルチストップウォッチ</h1>
      
      <button className="add-button" onClick={addStopwatch}>
        ストップウォッチを追加
      </button>
      
      <div className="stopwatch-container">
        {stopwatches.map(sw => (
          <div key={sw.id} className="stopwatch-wrapper">
            <StopWatch 
              id={sw.id} 
              title={sw.title} 
              onTitleChange={handleTitleChange}
            />
            {stopwatches.length > 1 && (
              <button 
                className="remove-button"
                onClick={() => removeStopwatch(sw.id)}
              >
                削除
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;