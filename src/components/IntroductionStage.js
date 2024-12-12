import React from 'react';
import Timer from './Timer';
import '../styles/IntroductionStage.scss'

const IntroductionStage = ({ currentPlayer, playerName, microphoneActive, ws }) => {
  const finishIntroduction = () => {
    ws.send(JSON.stringify({ type: 'finish-introduction' }));
  };

  return (
    <div>
      <h3>Раунд 1: Знайомство</h3>
      {microphoneActive && (
        <div>
          <Timer seconds={120} onEnd={finishIntroduction} />
          <button onClick={finishIntroduction}>Завершити виступ</button>
        </div>
      )}
    </div>
  );
};

export default IntroductionStage;
