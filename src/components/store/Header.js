import React from "react";
import '../../styles/Header.scss';
import logopage from '../assets/logo/Logo.png';

const Header = ({ setPage }) => {
    return (
        <div className='header'>
            <a className="div-logo" href="/" onClick={() => setPage('FirstPage')}>
                <img className='logopage' src={logopage} alt="logo" />
                <p>SPY</p>
            </a>
            <ul className="navbar">
                <li><a onClick={() => setPage('RulesPage')}>Правила гри</a></li>
                <li><a onClick={() => setPage('AboutUsPage')}>Про нас</a></li>
                <li><a onClick={() => setPage('SupportPage')}>Підтримати проект</a></li>
                <li className="redbuttom"><a href="/game">До гри</a></li>
            </ul>
        </div>
    );
};

export default Header;
