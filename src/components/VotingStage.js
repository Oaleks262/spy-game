import React from 'react';
import '../styles/VotingStage.scss'

const VotingStage = ({ ws, playerName }) => {
  const vote = (suspect) => {
    ws.send(JSON.stringify({ type: 'vote', suspect, playerName }));
  };

  return (
    <div>
      <h3>Голосування</h3>
      <button onClick={() => vote("обраний_підозрюваний")}>Проголосувати</button>
    </div>
  );
};

export default VotingStage;
