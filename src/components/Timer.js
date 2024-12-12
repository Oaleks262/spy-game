import React, { useState, useEffect } from 'react';
import '../styles/Timer.scss'

const Timer = ({ seconds, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onEnd]);

  return <p>Час: {timeLeft} секунд</p>;
};

export default Timer;
