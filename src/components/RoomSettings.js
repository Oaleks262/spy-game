import React from 'react';
import '../styles/RoomSettings.scss'

const RoomSettings = ({ role, locationState, topic }) => (
  <div>
    {role && <p>Ваша роль: {role === 'spy' ? 'Шпигун' : 'Мирний житель'}</p>}
    {locationState && <p>Локація: {locationState}</p>}
    {topic && <p>Тема: {topic}</p>}
  </div>
);

export default RoomSettings;
