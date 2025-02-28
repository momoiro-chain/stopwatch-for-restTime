import React, { useState, useEffect, useRef } from 'react';

const StopWatch = ({ id, title = 'ストップウォッチ', onTitleChange }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const titleInputRef = useRef(null);
  const intervalRef = useRef(null);

  // タイマーの開始/停止
  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
    } else {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
    setIsRunning(!isRunning);
  };

  // リセット
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  // ラップタイム記録
  const recordLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  // タイトル編集の開始
  const startEditing = () => {
    setIsEditing(true);
    // 次のレンダリング後にinputにフォーカスを当てる
    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, 0);
  };

  // タイトル編集の終了と保存
  const finishEditing = () => {
    setIsEditing(false);
    if (onTitleChange) {
      onTitleChange(id, currentTitle);
    }
  };

  // Enterキーが押されたら編集終了
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    }
  };

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);
  
  // タイトルが変更されたらコンポーネントの状態を更新
  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  // 時間のフォーマット (mm:ss:ms)
  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="stopwatch">
      <div className="title-container">
        {isEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            onBlur={finishEditing}
            onKeyDown={handleKeyDown}
            className="title-input"
          />
        ) : (
          <h3 onClick={startEditing} className="editable-title">
            {currentTitle} #{id}
            <span className="edit-icon" title="タイトルを編集">✎</span>
          </h3>
        )}
      </div>
      <div className="time-display">
        {formatTime(time)}
      </div>
      <div className="controls">
        <button onClick={toggleTimer}>
          {isRunning ? '停止' : '開始'}
        </button>
        <button onClick={resetTimer}>
          リセット
        </button>
        <button onClick={recordLap} disabled={!isRunning}>
          ラップ
        </button>
      </div>
      {laps.length > 0 && (
        <div className="laps">
          <h4>ラップタイム</h4>
          <ul>
            {laps.map((lapTime, index) => (
              <li key={index}>
                ラップ {index + 1}: {formatTime(lapTime)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StopWatch;