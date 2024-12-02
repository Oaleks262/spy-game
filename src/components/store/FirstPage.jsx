import React from 'react';

const FirstPage = () => {
    return (
        <div className='first-page'>
              <div className='hero-1'>
                <h1>Вгадайте... <br/>Хто тут <span className='spy-text'>
                  <span className='spy-leter'>Ш</span>
                  <span className='spy-leter'>п</span>
                  <span className='spy-leter'>и</span>
                  <span className='spy-leter'>г</span>
                  <span className='spy-leter'>у</span>
                  <span className='spy-leter'>н</span>
                  </span> ?</h1>
              </div>
              <div className='hero-2'>
                <div className='hero-2-text'>
                  <p>Створіть кімнату і приєднайтеся до гри,<br/> щоб знайти шпишуна</p>
                  <div className='hero-2-buttom'>
                    <a className="hero-2-buttom-red" href='/create-room'><p>Створити</p></a>
                    <a className="hero-2-buttom-black" href='/join-room'><p>Приєднатись</p></a>
                  </div>
                </div>
                <div className='hero-2-list'>
                <ul class="animated-list">
                    <li>Познайомся</li>
                    <li>Задай питання</li>
                    <li>Виріши</li>
                    <li>Проголосуй</li>
                </ul>
                </div>
              </div>
            </div>
    );
};

export default FirstPage;
