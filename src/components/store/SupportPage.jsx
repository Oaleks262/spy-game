import React from 'react';

const SupportPage = () => {
    return (
        <div className="support-project">
            <h2 className="support-project__title">Підтримати проєкт</h2>
            <p className="support-project__description">
                Ваша підтримка допоможе нам покращити гру, забезпечити стабільність серверів та покрити витрати на розвиток.
            </p>
            <a 
                href="https://send.monobank.ua/jar/7oiMbH81ef" 
                className="support-project__link"
                target="_blank"
                rel="noopener noreferrer"
            >
                Підтримати проєкт
            </a>
            <p className="support-project__description">
                Також ми допомагаємо Збройним Силам України у виготовленні дронів. Кожен внесок — це внесок у нашу перемогу.
            </p>
            <a 
                href="https://send.monobank.ua/jar/2f4ndGwSWh" 
                className="support-project__link"
                target="_blank"
                rel="noopener noreferrer"
            >
                Підтримати ЗСУ
            </a>
        </div>
    );
};

export default SupportPage;
