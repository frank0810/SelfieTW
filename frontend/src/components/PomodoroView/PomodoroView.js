import React, { useState } from 'react';
import PomodoroStandard from '../PomodoroStandard/PomodoroStandard';
import PomodoroCustom from '../PomodoroCustom/PomodoroCustom';
import PomodoroCustom2 from '../PomodoroCustom/PomodoroCustom2';
import pomodoroLogo from '../../imgs/pomodoro_logo.png';
import './PomodoroView.css';
import NavigationBar from '../Navbar';

const PomodoroView = () => {
  const [showCustom, setShowCustom] = useState(true);
  const [showCustom2, setShowCustom2] = useState(true);
  const [showStandard, setShowStandard] = useState(true);

  const handleFormSubmit = (cicles) => { //prende il numero di cili da PomodoroStandard
    setShowCustom(false);
    setShowCustom2(false);
  };

  const testupdate = async () => {
    const token = localStorage.getItem('token'); // Assicurati di aver memorizzato il token con questa chiave

    if (!token) {
      alert('Token not found. Please log in first.');
      return;
    }

    // Dati da inviare nella richiesta PUT
    const data = {
      cicles: 5,       // esempio di dato
      relaxTime: 10,   // esempio di dato
      studyTime: 25    // esempio di dato
    };

    try {
      const response = await fetch('http://localhost:3000/user/updateLastPomodoro', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      alert('Last Pomodoro updated successfully!');
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      alert('Failed to update Last Pomodoro');
    }
  };


  return (
    <>
    <NavigationBar isAuthenticated={true} />
    <div className="pomodoro-view">
      <div className="title">
        <img src={pomodoroLogo} alt="Pomodoro" id="logo" />
        <h1 id="pomodoro-title">Metodo Pomodoro!</h1>
      </div>
      {showStandard && <PomodoroStandard onSubmit={handleFormSubmit} />}
      {showCustom && <PomodoroCustom setShowStandard={setShowStandard} setShowCustom2={setShowCustom2} />}
      {showCustom2 && <PomodoroCustom2 setShowStandard={setShowStandard} setShowCustom={setShowCustom} />}
    </div>
    <button onClick={testupdate}>Update Last Pomodoro</button>
    </>
  );
};

export default PomodoroView;