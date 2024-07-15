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
    </>
  );
};

export default PomodoroView;