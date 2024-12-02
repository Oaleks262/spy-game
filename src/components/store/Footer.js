import React from "react";
import '../../styles/Footer.scss';
import {ReactComponent as Facebook} from '../assets/icon/Facebook.svg'
import {ReactComponent as Instagram} from '../assets/icon/Instagram.svg'
import {ReactComponent as Telegram} from '../assets/icon/Telegram.svg'
const Footer = () => {
    return (
        <div className="footer">
            <div className="link-social">
                <a className="facebook" href="#"><Facebook className="facebook-icon"/></a>
                <a className="instagram" href="#"><Instagram className="instagram-icon"/></a>
                <a className="telegram" href="#"><Telegram className="telegram-icon"/></a>
            </div>
            <div className="line"></div>

        </div>
    );
};

export default Footer;