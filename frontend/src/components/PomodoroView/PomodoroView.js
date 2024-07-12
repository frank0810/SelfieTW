import React, { useState } from 'react';
import PomodoroStandard from '../PomodoroStandard/PomodoroStandard';
import PomodoroCustom from '../PomodoroCustom/PomodoroCustom';
import pomodoroLogo from '../../imgs/pomodoro_logo.png';
import './PomodoroView.css';
import NavigationBar from '../Navbar';

const PomodoroView = () => {
  const [showCustom, setShowCustom] = useState(true);
  const [showStandard, setShowStandard] = useState(true);

  const handleFormSubmit = (cicles) => { //prende il numero di cili da PomodoroStandard
    setShowCustom(false);
  };


  return (
    <>
    <NavigationBar isAuthenticated={true} />
    <div class="pomodoro-view">
      <div class="title">
        <img src={pomodoroLogo} alt="Pomodoro" id="logo" />
        <h1>Metodo Pomodoro!</h1>
      </div>
      {showStandard && <PomodoroStandard onSubmit={handleFormSubmit} />}
      {showCustom && <PomodoroCustom setShowStandard={setShowStandard}  />}
    </div>
    </>
  );
};

export default PomodoroView;