import React, { useState, useEffect } from 'react';
import './Timers.css'; 
import studioImg from '../../imgs/study_time.png'; 
import relaxImg from '../../imgs/relax_time.webp'; 

const Timers = ({ cicles, studyTime, relaxTime }) => {
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timerIndex, setTimerIndex] = useState(0); // 0 è studio, 1 è relax
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState('studio'); // comincio sempre con la fase di studio
  const [showModal, setShowModal] = useState(false);

  const phases = [
    { type: 'studio', duration: studyTime*60 },
    { type: 'relax', duration: relaxTime*60 }
  ];

  useEffect(() => {
    startTimer('studio');
  }, []); // appena montato parte con il timer dello studio

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setShowModal(true);
      notificationSound();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = (type) => {
    const phase = phases.find(phase => phase.type === type);
    setTimeLeft(phase.duration);
    setTimerType(type);
    setIsRunning(true);
  };

  const handleNextTimer = () => {
    setShowModal(false);
    if (timerIndex === 0) {
      setTimerIndex(1);
      startTimer('relax');
    } else {
      setTimerIndex(0);
      setCurrentCycle(prevCycle => prevCycle + 1);
      if (currentCycle + 1 === cicles) {
        // Mostra il pop-up di completamento dei cicli
        setShowModal(true);
        notificationSound();
      } else {
        startTimer('studio');
      }
    }
  };

  const reloadPage = () => { 
    window.location.reload(); 
  };

  const formatTime = (seconds) => {//GPT
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const notificationSound = () => {
    const audio = new Audio(require('../../sounds/notification_sound.wav'));
    audio.play();
  };
  
  return (
    <div id="timer-div">
      <p className='remaining-cicles'>Ciclo {currentCycle + 1} di {cicles}</p>
      <h2 className='time-to'>{timerType === 'studio' ? 'E\' il momento di studiare!' : 'Goditi un po\' di riposo!'}</h2>
      <img src={timerType === 'studio' ? studioImg : relaxImg} className="timer-image" alt="study/relax time"/>
      <p id="time-left">{formatTime(timeLeft)}</p>
      {currentCycle + 1 !== cicles ? (
      <button onClick={handleNextTimer}>Passa alla prossima fase</button>
      ):(<p></p>)}
      <button onClick={reloadPage}>Termina Ciclo</button>

      {showModal && (
        <div className="popup">
          <div className="popup-content">
            {currentCycle + 1 === cicles && timerIndex === 1 ? (
              <h2>Tutti i cicli completati!</h2>
            ) : (
              <h2>Tempo scaduto!</h2>
            )}
            {currentCycle + 1 !== cicles || timerIndex === 0 ? (
              <button onClick={handleNextTimer}>Avvia il prossimo timer</button>
            ) : (
              <button onClick={reloadPage}>Chiudi</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timers;