import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateRoom.scss';

const CreateRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [ws, setWs] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [wsReady, setWsReady] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const createWebSocketConnection = () => {
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('Підключено до сервера WebSocket');
      setWsReady(true);
      setIsJoining(false); // Скидаємо стан

      // Після того, як WebSocket з'єднання відкрито, надсилаємо запит на створення кімнати
      socket.send(JSON.stringify({ type: 'create-room' }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'room-created') {
        setRoomCode(message.roomCode); // Зберігаємо згенерований код кімнати
      } else if (message.type === 'error') {
        alert(message.message);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket-з\'єднання закрито');
      setWsReady(false);
    };

    setWs(socket);
  };

  const generateRoomCode = () => {
    if (!ws) {
      createWebSocketConnection(); // Створюємо WebSocket з'єднання, якщо воно ще не створене
    } else if (wsReady) {
      ws.send(JSON.stringify({ type: 'create-room' })); // Якщо WebSocket вже готовий, відправляємо запит
    } else {
      console.log('WebSocket ще не готовий, чекаємо...');
    }
  };

  const startGame = () => {
    if (roomCode && playerName) {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        createWebSocketConnection();
      }
  
      if (wsReady && !isJoining) { 
        setIsJoining(true); 
        navigate(`/game/${roomCode}`, { state: { playerName } });
      } else {
        console.log('WebSocket ще не готовий для старту гри або вже в процесі приєднання');
      }
    } else {
      alert('Будь ласка, введіть своє ім\'я та згенеруйте код кімнати!');
    }
  };

  return (
    <div className="create-room">
      <h1>Створити кімнату</h1>

      <input
        type="text"
        placeholder="Ваше ім'я"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        required
      />

      {roomCode ? (
        <div className="room-details">
          <p>Ваш код кімнати: <strong>{roomCode}</strong></p>
          <button onClick={() => navigator.clipboard.writeText(roomCode)}>
            Скопіювати код
          </button>

          <button className="start-game-button" onClick={startGame}>
            Почати гру
          </button>
        </div>
      ) : (
        <button onClick={generateRoomCode}>Згенерувати код кімнати</button>
      )}
    </div>
  );
};

export default CreateRoom;
