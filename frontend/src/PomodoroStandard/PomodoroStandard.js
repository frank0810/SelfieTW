import React, { useState } from 'react';
import Timers from '../Timers/Timers';

const PomodoroStandard = ({ onSubmit }) => {
  const [cicles, setCicles] = useState(0);
  const [showTimers, setShowTimers] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleCiclesChange = (e) => {
    setCicles(parseInt(e.target.value, 10)); // Converte il valore in un numero intero
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowTimers(true); // Imposta showTimers a true prima di chiamare onSubmit
    onSubmit(cicles);
    setShowForm(false) // Passa il numero di cicli aggiornato al genitore
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
            <input
              type="number"
              value={cicles}
              onChange={handleCiclesChange}
              min="1"
              max="15"
              required
            />
          </label>
        </div>
        <button type="submit">Invia</button>
      </form>}

      {showTimers && <Timers cicles={cicles} />} {/* Passa direttamente cicles come prop a Timers */}
    </div>
  );
};

export default PomodoroStandard;