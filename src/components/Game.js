import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Game.scss';

const Game = () => {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('Очікуємо гравців...');
  const [role, setRole] = useState('');
  const [locationState, setLocationState] = useState('');
  const [topic, setTopic] = useState('');
  const [players, setPlayers] = useState([]);
  const [playerCount, setPlayerCount] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [introducing, setIntroducing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [nextPlayer, setNextPlayer] = useState('');
  const [microphoneActive, setMicrophoneActive] = useState(false);
  const [timer, setTimer] = useState(120); // Таймер на 2 хвилини
  const [intervalId, setIntervalId] = useState(null); // Додаємо для зберігання інтервалу
  const ws = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const remoteAudio = useRef(new Audio());
  const playerName = location.state?.playerName || 'Без імені';

  useEffect(() => {
    ws.current = new WebSocket('ws://spy-server.onrender.com');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      ws.current.send(
        JSON.stringify({
          type: 'join-room',
          roomCode,
          playerName,
        })
      );
    };

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log('Отримано повідомлення:', data);  // Лог для перевірки отриманих даних
      switch (data.type) {
        case 'role':
          setRole(data.role);
          setTopic(data.topic);
          if (data.role === 'civilian') {
            setLocationState(data.location);
          }
          break;
        case 'game-started':
          setGameState('Гра розпочалась!');
          setGameStarted(true);
          break;
        case 'next-round':
          setGameState(`Раунд ${data.round}`);
          break;
        case 'start-introduction':
          setGameState('Раунд 1: Знайомство');
          setIntroducing(true);
          setCurrentPlayer(data.players[0]);
          setNextPlayer(data.players[1]);
          setMicrophoneActive(true);
          startTimer(); // Запуск таймера при початку знайомства
          break;
        case 'next-introducer':
          setCurrentPlayer(data.currentPlayer);
          setNextPlayer(data.nextPlayer);
          setMicrophoneActive(true);
          resetTimer(); // Скинути таймер при переході до наступного гравця
          break;
        case 'introduction-ended':
          setGameState('Знайомство завершене');
          setIntroducing(false);
          setMicrophoneActive(false);
          clearTimer(); // Очистити таймер після закінчення знайомства
          break;
        case 'vote-result':
          setGameState(`Гравець ${data.suspect} отримав найбільше голосів`);
          break;
        case 'civilians-won':
          setGameState('Мирні перемогли!');
          break;
        case 'spy-won':
          setGameState(`Шпигун ${data.spyName} переміг!`);
          break;
        case 'game-ended':
          setGameState('Гра завершена');
          navigate('/');
          break;
        case 'error':
          setGameState(`Помилка: ${data.message}`);
          break;
        case 'players-updated':
          setPlayers(data.players);
          setPlayerCount(data.players.length);
          break;

        // Додано обробку для WebRTC
        case 'offer':
          handleOffer(data);  // Викликаємо функцію обробки пропозиції
          break;
        case 'answer':
          handleAnswer(data);  // Викликаємо функцію обробки відповіді
          break;
        case 'ice-candidate':
          const peerConnection = peerConnections.current[data.playerId];
          if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
          break;

        default:
          console.log('Невідомий тип повідомлення:', data.type);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket закрито');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [roomCode, playerName, navigate]);

  const startTimer = () => {
    setTimer(120); // Скидання таймера на 2 хвилини
    const newIntervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(newIntervalId);
          finishIntroduction();
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Зменшення на 1 сек за 1000 мс
    setIntervalId(newIntervalId); // Зберігаємо інтервал
  };

  const resetTimer = () => {
    setTimer(120);
  };

  const clearTimer = () => {
    setTimer(0);
    if (intervalId) {
      clearInterval(intervalId); // Зупиняємо інтервал, якщо він існує
      setIntervalId(null); // Очищаємо значення
    }
  };

  const createPeerConnection = (playerId) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    peerConnections.current[playerId] = peerConnection;

    localStream.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.current);
    });

    peerConnection.ontrack = (event) => {
      remoteAudio.current.srcObject = event.streams[0];
      remoteAudio.current.autoplay = true;
      remoteAudio.current.play();
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        ws.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          playerId,
          roomCode,
        }));
      }
    };

    return peerConnection;
  };

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStream.current = stream;

      players.forEach((player) => {
        createPeerConnection(player.id);
      });
    } catch (error) {
      console.error('Помилка доступу до мікрофону:', error);
    }
  };

  const handleOffer = (data) => {
    console.log('Обробляємо пропозицію:', data);  // Лог для перевірки
    const offerPeerConnection = createPeerConnection(data.playerId);
    offerPeerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    offerPeerConnection.createAnswer().then((answer) => {
      offerPeerConnection.setLocalDescription(answer);
      ws.current.send(JSON.stringify({ type: 'answer', answer, roomCode, playerId: data.playerId }));
    });
  };

  const handleAnswer = (data) => {
    console.log('Обробляємо відповідь:', data);  // Лог для перевірки
    const answerPeerConnection = peerConnections.current[data.playerId];
    answerPeerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const finishIntroduction = () => {
    ws.current.send(JSON.stringify({ type: 'finish-introduction', roomCode }));
    setMicrophoneActive(false);
    clearTimer();
  };

  useEffect(() => {
    if (gameStarted) {
      startLocalStream();
    }
  }, [gameStarted]);

  const handleStartGame = () => {
    ws.current.send(JSON.stringify({ type: 'start-game', roomCode }));
  };

  return (
    <div>
      <h1>Гра: {roomCode}</h1>
      <p>Статус гри: {gameState}</p>
      {role && <p>Ваша роль: {role === 'spy' ? 'Шпигун' : 'Мирний житель'}</p>}
      {locationState && <p>Локація: {locationState}</p>}
      {topic && <p>Тема: {topic}</p>}

      <h2>Гравці в кімнаті:</h2>
      <ul>
        {players.map((player, index) => (
          <li 
            key={index} 
            style={{ color: currentPlayer === player ? 'red' : 'black' }}
          >
            {player}
            {currentPlayer === player && <span>🔊</span>} {/* Динамік */}
          </li>
        ))}
      </ul>

      {playerCount >= 3 && !gameStarted && (
        <button onClick={handleStartGame}>Почати гру</button>
      )}

      {introducing && (
        <div>
          <p>Гравець {currentPlayer} представляється.</p>
          <p>Залишилось часу: {timer} секунд</p>
          {/* Додаємо перевірку на те, чи є ви поточним гравцем */}
          {microphoneActive && currentPlayer === playerName && ( // Кнопка для завершення виступу
            <button onClick={finishIntroduction}>Завершити виступ</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Game;
