import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/MainScreen.scss';
import logo from './assets/logo/Logo.png';

const MainScreen = () => {
  return (
    <div className="main-screen page"> {/* Додаємо клас "page" */}
      <div className="logo">
        <h1>Spy Game</h1>
        <img className="logo-icon" src={logo} alt='logo' />
      </div>

      <div className="buttons">
        <Link to="/create-room">
          <button>Створити кімнату</button>
        </Link>
        <Link to="/join-room">
          <button>Увійти в кімнату</button>
        </Link>
        <Link to="/developers">
          <button>Розробники</button>
        </Link>
        <Link to="/support">
          <button>Підтримати проект</button>
        </Link>
      </div>
        <p>Version:1.0.0</p>
    </div>
  );
};

export default MainScreen;
