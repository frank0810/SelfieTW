import React, { useState } from 'react';
import Timers from '../Timers/Timers';
import './PomodoroStandard.css'; 

const PomodoroStandard = ({ onSubmit }) => {
  const [cicles, setCicles] = useState(0);
  const [showTimers, setShowTimers] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleCiclesChange = (e) => {
    setCicles(parseInt(e.target.value, 10)); // Converte il valore in un numero intero
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTimers(true); 
    onSubmit(cicles);
    setShowForm(false) 
  };

  return (
    <div className='pomodoro-variant'>
      <h1>Pomodoro Standard</h1>
      <p>
        <em>Utilizza il metodo pomodoro standard: 30 minuti di studio, seguiti da 5 minuti di pausa!</em>
      </p>
      {showForm && <form onSubmit={handleSubmit}>
        <div>
          <label>
            Numero di cicli:
           
          </label>
          <input
              type="number"
              value={cicles}
              onChange={handleCiclesChange}
              min="1"
              max="15"
              required
            />
        </div>
        <button type="submit">Inizia</button>
      </form>}

      {showTimers && <Timers cicles={cicles} studyTime={30} relaxTime={5} />} 
    </div>
  );
};

export default PomodoroStandard;