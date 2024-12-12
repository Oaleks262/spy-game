import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Game.scss';
import PlayerList from './PlayerList';
import IntroductionStage from './IntroductionStage';
import DiscussionStage from './DiscussionStage';
import VotingStage from './VotingStage';
import RoomSettings from './RoomSettings';

const Game = () => {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState('Очікуємо гравців...');
  const [gameStarted, setGameStarted] = useState(false);
  const [introducing, setIntroducing] = useState(false);
  const [isDiscussion, setIsDiscussion] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState('');
  const [locationState, setLocationState] = useState('');
  const [topic, setTopic] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [microphoneActive, setMicrophoneActive] = useState(false);

  const ws = useRef(null);
  const playerName = location.state?.playerName || 'Без імені';

  const handleServerMessage = useCallback((data) => {
    switch (data.type) {
      case 'role':
        setRole(data.role);
        setTopic(data.topic);
        if (data.role === 'civilian') setLocationState(data.location);
        break;
      case 'game-started':
        setGameState('Гра розпочалась!');
        setGameStarted(true);
        break;
      case 'start-introduction':
        setIntroducing(true);
        setCurrentPlayer(data.players[0]);
        setMicrophoneActive(data.players[0] === playerName);
        break;
      case 'next-introducer':
        setCurrentPlayer(data.currentPlayer);
        setMicrophoneActive(data.currentPlayer === playerName);
        break;
      case 'introduction-ended':
        setIntroducing(false);
        break;
      case 'start-discussion':
        setIsDiscussion(true);
        break;
      case 'update-players':
        setPlayers(data.players);
        break;        
      case 'voting-ended':
        setIsVoting(false);
        break;
      default:
        console.log('Невідомий тип повідомлення:', data.type);
    }
  }, [playerName]);
  useEffect(() => {
    if (!roomCode || !playerName) {
      navigate('/error'); // Перенаправлення на сторінку з повідомленням про помилку
    }
  }, [roomCode, playerName, navigate]);
  
  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3000');
    ws.current.onopen = () => {
      ws.current.send(JSON.stringify({ type: 'join-room', roomCode, playerName }));
    };

    ws.current.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleServerMessage(data);
    };

    ws.current.onclose = () => console.log('WebSocket закрито');
    return () => ws.current && ws.current.close();
  }, [roomCode, playerName, handleServerMessage]);

  return (
    <div>
      <h1>Гра: {roomCode}</h1>
      <p>Статус гри: {gameState}</p>
      <RoomSettings role={role} locationState={locationState} topic={topic} />

      <PlayerList players={players} currentPlayer={currentPlayer} microphoneActive={microphoneActive} />

      {gameStarted && introducing && (
        <IntroductionStage
          currentPlayer={currentPlayer}
          playerName={playerName}
          microphoneActive={microphoneActive}
          ws={ws.current}
        />
      )}

      {isDiscussion && <DiscussionStage ws={ws.current} />}

      {isVoting && <VotingStage ws={ws.current} playerName={playerName} />}
    </div>
  );
};

export default Game;
