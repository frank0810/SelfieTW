import React, { useState } from 'react';
import Timers from '../Timers/Timers';
import './PomodoroCustom.css';

const PomodoroCustom = ({ setShowStandard, setShowCustom2 }) => {
    const [studyTime, setStudyTime] = useState(30);
    const [relaxTime, setRelaxTime] = useState(5);
    const [cicles, setCicles] = useState(0);
    const [showTimers, setShowTimers] = useState(false);
    const [showForm, setShowForm] = useState(true);
    const [studyTime1, setStudyTime1] = useState(0);
    const [studyTime2, setStudyTime2] = useState(0);
    const [studyTime3, setStudyTime3] = useState(0);
    const [relaxTime1, setRelaxTime1] = useState(0);
    const [relaxTime2, setRelaxTime2] = useState(0);
    const [relaxTime3, setRelaxTime3] = useState(0);
    const [ciclesProposal1, setCiclesProposal1] = useState(0);
    const [ciclesProposal2, setCiclesProposal2] = useState(0);
    const [ciclesProposal3, setCiclesProposal3] = useState(0);
    const [showProposals, setShowProposals] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const handleCheckboxChange = (proposal) => {
        if (selectedProposal === proposal) {
            setSelectedProposal(null); 
        } else {
            setSelectedProposal(proposal); 
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowProposals(false)

        const form = e.target;
        const hours = parseInt(form.hours.value, 10) || 0;
        const minutes = parseInt(form.minutes.value, 10) || 0;
        const totMin = hours * 60 + minutes
        setShowProposals(true)
        switch (true) {
            case totMin < 20:
                alert("Minuti non sufficienti")
                setShowProposals(false)
                break;

            case totMin >= 20 && totMin < 80:

                setStudyTime1(18);
                setRelaxTime1(2);
                setStudyTime2(25);
                setRelaxTime2(5);
                setStudyTime3(30)
                setRelaxTime3(5)

                setCiclesProposal1(Math.round(totMin / 20) || 1);
                setCiclesProposal2(Math.round(totMin / 30) || 1);
                setCiclesProposal3(Math.round(totMin / 35) || 1);


                break;

            case totMin >= 80 && totMin <= 180:

                setStudyTime1(18);
                setRelaxTime1(2);
                setStudyTime2(30);
                setRelaxTime2(5);
                setStudyTime3(40);
                setRelaxTime3(10);

                setCiclesProposal1(Math.round(totMin / 20) || 1);
                setCiclesProposal2(Math.round(totMin / 35) || 1);
                setCiclesProposal3(Math.round(totMin / 50) || 1);

                break;

            case totMin > 180:

                setStudyTime1(30);
                setRelaxTime1(5);
                setStudyTime2(40);
                setRelaxTime2(10);
                setStudyTime3(60);
                setRelaxTime3(15);

                setCiclesProposal1(Math.round(totMin / 35) || 1);
                setCiclesProposal2(Math.round(totMin / 50) || 1);
                setCiclesProposal3(Math.round(totMin / 75) || 1);


                break;

            default:
                console.log("Valore non valido.");
        }

    };

    const handleStart = () => {
        if (selectedProposal) {
            switch (true) {
                case selectedProposal === 1:
                    setCicles(ciclesProposal1)
                    setStudyTime(studyTime1)
                    setRelaxTime(relaxTime1)
                    break;

                case selectedProposal === 2:
                    setCicles(ciclesProposal2)
                    setStudyTime(studyTime2)
                    setRelaxTime(relaxTime2)
                    break;

                case selectedProposal === 3:
                    setCicles(ciclesProposal3)
                    setStudyTime(studyTime3)
                    setRelaxTime(relaxTime3)
                    break;

                default:
                    alert("Errore")
            }
        setShowTimers(true)
        setShowForm(false)
        setShowStandard(false); 
        setShowCustom2(false); 


        } 
        else {
        alert("Seleziona una proposta")
        }
    };

return (
    <div className='pomodoro-variant'>
        <h1>Pomodoro Custom</h1>
        <p>
            <em>Scegli una proposta in base al tuo tempo disponibile!</em>
        </p>
        {showForm && (
            <form onSubmit={handleSubmit}>
                <div>
                    <p><u>Tempo disponibile:</u></p>
                    <label>
                        Ore:
                    
                    <input
                        type="number"
                        name="hours"
                        min="0"
                        max="12"
                        required
                    />
                    </label>
                    <label>
                        Minuti:
                    
                    <input
                        type="number"
                        name="minutes"
                        min="0"
                        max="55"
                        required
                        defaultValue={0}
                    />
                    </label>
                </div>
                <button className="pomodoro-button" type="submit">Calcola proposte</button>
            </form>
        )}
        {showProposals && showForm &&(
            <form onSubmit={handleStart}>
                <h2>Proposte:</h2>
                <div>
                    {ciclesProposal1 > 0 && (
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedProposal === 1}
                                onChange={() => handleCheckboxChange(1)}
                            />
                           <b> Proposta 1</b>: {ciclesProposal1} cicli da {studyTime1} minuti di studio e {relaxTime1} minuti di relax, per un totale di {ciclesProposal1 * (studyTime1 + relaxTime1)} minuti
                        </label>
                    )}
                </div>
                <div>
                    {ciclesProposal2 > 0 && (
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedProposal === 2}
                                onChange={() => handleCheckboxChange(2)}
                            />
                            <b> Proposta 2</b>: {ciclesProposal2} cicli da {studyTime2} minuti di studio e {relaxTime2} minuti di relax, per un totale di {ciclesProposal2 * (studyTime2 + relaxTime2)} minuti
                        </label>
                    )}
                </div>
                <div>
                    {ciclesProposal3 > 0 && (
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedProposal === 3}
                                onChange={() => handleCheckboxChange(3)}
                            />
                            <b> Proposta 3</b>: {ciclesProposal3} cicli da {studyTime3} minuti di studio e {relaxTime3} minuti di relax, per un totale di {ciclesProposal3 * (studyTime3 + relaxTime3)} minuti
                        </label>
                    )}
                </div>
                <button className="pomodoro-button" type= "submit" >Inizia</button>
            </form>

        )}

        {showTimers && <Timers cicles={cicles} studyTime={studyTime} relaxTime={relaxTime} />}
    </div>
);
};

export default PomodoroCustom;