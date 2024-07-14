import React from 'react';
import NavigationBar from '../Navbar';
import HomeCard from '../HomeCard';
import pomodoroLogo from '../../imgs/pomodoro_logo.png';
import noteLogo from '../../imgs/note_logo.png';
import calendarioLogo from '../../imgs/calendario_logo.png';
import './Home.css'

const Home = () => {
  return (
    <>
      <NavigationBar isAuthenticated={true} />
      <div className='container'>
        <HomeCard Category='Pomodoro' Title='Metodo Pomodoro'
          SectionLink='/pomodoro' ImgUrl={pomodoroLogo} CardDescription='Utilizza il metodo Pomodoro per suddividere il tuo tempo in cicli Studio - Relax'/>
        <HomeCard Category='Note' Title='Note'
          SectionLink='/notes' ImgUrl={noteLogo} CardDescription='Crea note personalizzate per tenere traccia delle tue idee ' />
        <HomeCard Category='Calendario' Title='Calendario'
          SectionLink='/calendar' ImgUrl={calendarioLogo} CardDescription='Tiene traccia delle tue attività con il calendario personalizzato' />
        <HomeCard Category='Pomodoro' Title='Ok, title'
          SectionLink='/pomodoro' ImgUrl={pomodoroLogo} CardDescription='Utilizza il metodo Pomodoro per suddividere il tuo tempo in cicli Studio - Relax'/>

      </div>
    </>
  );
};

export default Home;