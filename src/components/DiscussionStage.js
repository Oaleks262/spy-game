import React from 'react';
import Timer from './Timer';
import '../styles/DiscussionStage.scss'

const DiscussionStage = ({ ws }) => (
  <div>
    <h3>Етап обговорення</h3>
    <Timer seconds={120} onEnd={() => ws.send(JSON.stringify({ type: 'end-discussion' }))} />
  </div>
);

export default DiscussionStage;
