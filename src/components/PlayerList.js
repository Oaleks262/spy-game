import React from 'react';
import '../styles/PlayerList.scss'

const PlayerList = ({ players, currentPlayer, microphoneActive }) => (
  <div>
    <h2>Гравці в кімнаті:</h2>
    <ul>
      {players.map((player, index) => (
        <li key={index} style={{ color: currentPlayer === player ? 'red' : 'white' }}>
          {player} {currentPlayer === player && microphoneActive && <span>🎤</span>}
        </li>
      ))}
    </ul>
  </div>
);

export default PlayerList;
