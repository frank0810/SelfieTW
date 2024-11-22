import React, { useState, useEffect } from 'react';
import NavigationBar from '../Navbar';
import HomeCard from '../HomeCard';
import pomodoroLogo from '../../imgs/pomodoro_logo.png';
import noteLogo from '../../imgs/note_logo.png';
import calendarioLogo from '../../imgs/calendario_logo.png';
import { fetchUserNotes, fetchUserEvents } from '../../utils';
import './Home.css';

const Home = () => {
  const [lastPomodoro, setLastPomodoro] = useState(null);
  const [recentNote, setRecentNote] = useState(null);
  const [todaysEvents, setTodaysEvents] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    const fetchLastPomodoro = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch('http://localhost:3000/user/getUserPomodoro', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 204) {
          setLastPomodoro(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setLastPomodoro(result.lastPomodoro);

      } catch (error) {
        console.error('Errore con il fetch dei dati su lastPomodoro:', error);
      }
    };

    const fetchRecentNote = async () => {
      try {
        const notes = await fetchUserNotes();

        if (notes.length === 0) {
          setRecentNote(null); // Se non ci sono note
          return;
        }

        const sortedNotes = notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentNote(sortedNotes[0]);
      } catch (error) {
        console.error('Errore nel recupero delle note:', error);
      }
    };

    const fetchTodaysEvents = async () => {
      try {
        const events = await fetchUserEvents();

        if (events.length === 0) {
          setTodaysEvents(null);
          return;
        }

        let te = []
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const e of events) {
          const startDate = new Date(e.startDate);
          const endDate = new Date(e.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          if (startDate <= today && today <= endDate) {
            te.push(e.title);
          }
        }

        setTodaysEvents(te);
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }

    };

    fetchLastPomodoro();
    fetchRecentNote();
    fetchTodaysEvents();
  }, []);


  return (
    <>
      <NavigationBar isAuthenticated={true} />
      <div className='container'>
        <HomeCard
          Category='Pomodoro'
          Title='Metodo Pomodoro'
          SectionLink='/pomodoro'
          ImgUrl={pomodoroLogo}
          CardDescription='Utilizza il metodo Pomodoro per suddividere il tuo tempo in cicli Studio - Relax'
          Data={lastPomodoro !== null
            ? `Ultimo pomodoro: ${lastPomodoro.cicles} cicli da ${lastPomodoro.studyTime} + ${lastPomodoro.relaxTime} minuti. (${formatDate(lastPomodoro.updatedAt)})`
            : 'Nessun dato su pomodori svolti.'}
        />
        <HomeCard
          Category='Note'
          Title='Note'
          SectionLink='/notes'
          ImgUrl={noteLogo}
          CardDescription='Crea note personalizzate per tenere traccia delle tue idee'
          Data={recentNote !== null
            ? `${recentNote.title} (creata il ${formatDate(recentNote.createdAt)})`
            : 'Non ci sono note.'}
        />
        <HomeCard
          Category='Calendario'
          Title='Calendario'
          SectionLink='/calendar'
          ImgUrl={calendarioLogo}
          CardDescription='Tiene traccia delle tue attività con il calendario personalizzato'
          Data={`Eventi di oggi: ${todaysEvents}`}
        />
      </div>
    </>
  );
};

export default Home;