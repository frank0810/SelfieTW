import React, { useState } from 'react';
import Timers from '../Timers/Timers';
import './PomodoroCustom.css';

const PomodoroCustom2 = ({ setShowStandard, setShowCustom }) => {
    const [cicles, setCicles] = useState(0);
    const [studyTime, setStudyTime] = useState(0);
    const [relaxTime, setRelaxTime] = useState(0);
    const [showTimers, setShowTimers] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const handleCiclesChange = (e) => {
        setCicles(parseInt(e.target.value, 10)); // Converte il valore in un numero intero
    };

    const handleStudyTimeChange = (e) => {
        setStudyTime(parseInt(e.target.value, 10)); // Converte il valore in un numero intero
    };

    const handleRelaxTimeChange = (e) => {
        setRelaxTime(parseInt(e.target.value, 10)); // Converte il valore in un numero intero
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setShowTimers(true);
        //onSubmit(cicles);
        setShowForm(false)
        setShowStandard(false);
        setShowCustom(false);
    };

    return (
        <div className='pomodoro-variant'>
            <h1>Pomodoro Super Custom</h1>
            <p>
                <em>Scegli manualmente numero di cicli, tempo di studio e tempo di pausa</em>
            </p>
            {showForm && <form onSubmit={handleSubmit}>
                <div>
                    <div style={{display:'flex'}}>
                    <label style={{width:'auto'}}>
                        Numero di cicli:

                    </label >
                    <input
                        type="number"
                        value={cicles}
                        onChange={handleCiclesChange}
                        min="1"
                        max="15"
                        required
                    />
                    </div>
                    <div style={{display:'flex'}}>
                        <label style={{width:'auto'}}>
                            Minuti di studio: 

                        </label>
                        <input
                            type="number"
                            value={studyTime}
                            onChange={handleStudyTimeChange}
                            min="1"
                            max="60"
                            required
                        />
                    </div>
                    <div style={{display:'flex'}}>
                        <label style={{width:'auto'}}>
                            Minuti di relax:
                        </label>
                        <input
                            type="number"
                            value={relaxTime}
                            onChange={handleRelaxTimeChange}
                            min="1"
                            max="60"
                            required
                        />
                    </div>
                </div>
                <button className="pomodoro-button" type="submit">Inizia</button>
            </form>}

            {showTimers && <Timers cicles={cicles} studyTime={studyTime} relaxTime={relaxTime} />}
        </div>
    );
};

export default PomodoroCustom2;