import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './components/MainScreen';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Developers from './components/Developers';
import Support from './components/Support';
import Game from './components/Game';
import Homepage from './components/store/HomePage';
import ErrorPage from './components/ErrorPage';
import './styles/main.scss';

const App = () => {
  return (
 <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<MainScreen />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="/support" element={<Support />} />
        <Route path="/game/:roomCode" element={<Game />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
};

export default App;
