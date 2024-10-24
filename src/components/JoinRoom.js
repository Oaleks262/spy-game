import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/JoinRoom.scss'; 

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const joinRoom = () => {
    if (roomCode && playerName) {
      // Використовуємо WebSocket для підключення до серверу
      const ws = new WebSocket('wss://spy-server.onrender.com');

      ws.onopen = () => {

        navigate(`/game/${roomCode}`, { state: { playerName } });
      };

      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'error') {
          alert(data.message); // Повідомлення про помилку
        } else if (data.type === 'player-joined') {
          navigate(`/game/${roomCode}`); // Переходимо на екран гри після підключення
        }
      };
    } else {
      alert('Будь ласка, введіть код кімнати та ваше ім\'я');
    }
  };

  return (
    <div className="join-room">
      <h1>Приєднатися до кімнати</h1>
      <input
        type="text"
        placeholder="Введіть код кімнати"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
      />
      <input
        type="text"
        placeholder="Введіть ваше ім'я"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />
      <button onClick={joinRoom}>Приєднатися</button>
    </div>
  );
};

export default JoinRoom;
