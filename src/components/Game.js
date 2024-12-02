import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Game.scss';

const Game = () => {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isStartButtonVisible, setIsStartButtonVisible] = useState(false);
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
  const [timer, setTimer] = useState(120);
  const [intervalId, setIntervalId] = useState(null);
  const [isDiscussion, setIsDiscussion] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [discussionTimer, setDiscussionTimer] = useState(120);
  const ws = useRef(null);
  const peerConnections = useRef({});
  const localStream = useRef(null);
  const remoteAudio = useRef(new Audio());
  const playerName = location.state?.playerName || 'Без імені';

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000');
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
      console.log('Отримано повідомлення:', data);
      switch (data.type) {
        case 'role':
          setRole(data.role);
          setTopic(data.topic);
          if (data.role === 'civilian') {
            setLocationState(data.location);
          }
          break;
        case 'show-start-button':
          setIsStartButtonVisible(true); // Відображаємо кнопку
          break;
        case 'game-started':
          setGameState('Гра розпочалась!');
          setGameStarted(true);
          break;
        case 'start-introduction':
          setGameState('Раунд 1: Знайомство');
          setIntroducing(true);
          setCurrentPlayer(data.players[0]);
          setNextPlayer(data.players[1]);
          setMicrophoneActive(true);
          startTimer();
          break;
        case 'next-introducer':
          setCurrentPlayer(data.currentPlayer);
          setNextPlayer(data.nextPlayer);
          setMicrophoneActive(data.currentPlayer === playerName);
          resetTimer();
          break;
        case 'introduction-ended':
          setGameState('Знайомство завершене');
          setIntroducing(false);
          setMicrophoneActive(false);
          clearTimer();
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
        // Розпочинається етап обговорення
        case 'start-discussion':
          setGameState('Етап обговорення');
          setIsDiscussion(true);
          startDiscussionTimer();
          break;
  
        // Завершення голосування
        case 'voting-ended':
          setGameState(`Голосування завершене! Гравець ${data.suspect} отримав найбільше голосів`);
          setIsVoting(false);
          break;
        case 'offer':
          handleOffer(data);
          break;
        case 'answer':
          handleAnswer(data);
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

// Запуск таймера обговорення
const startDiscussionTimer = () => {
  setDiscussionTimer(120);
  const discussionIntervalId = setInterval(() => {
    setDiscussionTimer((prev) => {
      if (prev <= 1) {
        clearInterval(discussionIntervalId);
        endDiscussion();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};

// Завершення обговорення і запуск голосування
const endDiscussion = () => {
  setIsDiscussion(false);
  setIsVoting(true);
  setGameState("Голосування почалося!");
  ws.current.send(JSON.stringify({ type: 'start-voting', roomCode }));
};

  const startTimer = () => {
    setTimer(120);
    const newIntervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(newIntervalId);
          finishIntroduction();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const resetTimer = () => {
    setTimer(120);
  };

  const clearTimer = () => {
    setTimer(0);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const createPeerConnection = (playerId) => {
    console.log(`Створюємо PeerConnection для гравця з id: ${playerId}`);  // Додаємо логування
  
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
  
    peerConnections.current[playerId] = peerConnection;
  
    if (peerConnection.getSenders().length === 0) {
      localStream.current.getTracks().forEach((track) => {
        console.log(`Додаємо трек ${track.kind} до WebRTC для гравця ${playerId}`);
        peerConnection.addTrack(track, localStream.current);
      });
    }
  
    peerConnection.ontrack = (event) => {
      console.log("Новий віддалений трек отримано:", event.streams[0]);
      remoteAudio.current.srcObject = event.streams[0];
      remoteAudio.current.play().catch((error) => {
        console.log('Помилка з відтворенням віддаленого звуку:', error);
      });
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
      console.log("Мікрофон успішно підключено:", stream);
      localStream.current = stream;
  
      // Перевіряємо, чи гравець має id перед створенням з'єднання
      players.forEach((player) => {
        if (player.id) {  // Додаємо перевірку на наявність player.id
          const peerConnection = createPeerConnection(player.id);
          if (peerConnection.getSenders().length === 0) {
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
          }
        } else {
          console.warn("player.id is undefined for a player:", player);
        }
      });
  
      remoteAudio.current.srcObject = stream;
      remoteAudio.current.autoplay = true;
      remoteAudio.current.play();
    } catch (error) {
      console.error('Помилка доступу до мікрофону:', error);
    }
  };
  
  

  const handleOffer = (data) => {
    const offerPeerConnection = createPeerConnection(data.playerId);
    offerPeerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    offerPeerConnection.createAnswer().then((answer) => {
      offerPeerConnection.setLocalDescription(answer);
      ws.current.send(JSON.stringify({ type: 'answer', answer, roomCode, playerId: data.playerId }));
    });
  };

  const handleAnswer = (data) => {
    const answerPeerConnection = peerConnections.current[data.playerId];
    answerPeerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  };

  const finishIntroduction = () => {
    ws.current.send(JSON.stringify({ type: 'finish-introduction', roomCode,
      playerName,  }));
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
            style={{ color: currentPlayer === player ? 'red' : 'white' }}>
            {player} {currentPlayer === player && microphoneActive && <span>🎤</span>}
          </li>
        ))}
      </ul>
      {isDiscussion && (
      <div>
        <p>Етап обговорення триває</p>
        <p>До кінця обговорення: {discussionTimer} секунд</p>
      </div>
    )}

    {isVoting && (
      <div>
        <p>Голосування триває...</p>
        <button onClick={() => ws.current.send(JSON.stringify({ type: 'vote', roomCode, playerName, suspect: "обраний_підозрюваний" }))}>
          Проголосувати
        </button>
      </div>
    )}
      {/* {playerCount >= 3 && !gameStarted && (
        <button onClick={handleStartGame}>Почати гру</button>
      )} */}

      {gameStarted ? (
        <div>
          <p>Гравець {currentPlayer} представляється.</p>
          <p>До кінця виступу: {timer} секунд</p>
          {introducing && microphoneActive && (
            <button onClick={finishIntroduction}>Завершити виступ</button>
          )}
        </div>
      ) : (
        <div>
       {playerCount >= 3 && !gameStarted && (
        <button onClick={handleStartGame}>Почати гру</button>
      )}
      </div>
      )}
    </div>
  );
};

export default Game;
