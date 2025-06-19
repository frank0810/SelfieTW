// import React, { useState } from 'react';
// import Timers from '../Timers/Timers';
// import './PomodoroStandard.css'; 

// const PomodoroStandard = ({ onSubmit }) => {
//   const [cicles, setCicles] = useState(0);
//   const [showTimers, setShowTimers] = useState(false);
//   const [showForm, setShowForm] = useState(true);

//   const handleCiclesChange = (e) => {
//     setCicles(parseInt(e.target.value, 10)); // Converte il valore in un numero intero
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowTimers(true); 
//     onSubmit(cicles);
//     setShowForm(false) 
//   };

//   return (
//     <div className='pomodoro-variant'>
//       <h1>Pomodoro Standard</h1>
//       <p>
//         <em>Utilizza il metodo pomodoro standard: 30 minuti di studio, seguiti da 5 minuti di pausa!</em>
//       </p>
//       {showForm && <form onSubmit={handleSubmit}>
//         <div>
//           <label>
//             Numero di cicli:
           
//           </label>
//           <input
//               type="number"
//               value={cicles}
//               onChange={handleCiclesChange}
//               min="1"
//               max="15"
//               required
//             />
//         </div>
//         <button className="pomodoro-button" type="submit">Inizia</button>
//       </form>}

//       {showTimers && <Timers cicles={cicles} studyTime={30} relaxTime={5} />} 
//     </div>
//   );
// };

// export default PomodoroStandard;


// ...existing code...
import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import './PomodoroStandard.css';

const PomodoroStandard = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // ...eventuali funzioni timer...

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '22rem' }}>
        <Card.Body>
          <Card.Title className="text-center mb-4">Pomodoro Standard</Card.Title>
          <div className="text-center mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <Form>
            <Form.Group className="mb-3" controlId="formPomodoroMinutes">
              <Form.Label>Minuti</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="60"
                value={minutes}
                onChange={e => setMinutes(Number(e.target.value))}
                style={{ width: '100px', display: 'inline-block', marginLeft: '10px' }}
              />
            </Form.Group>
            <div className="d-flex justify-content-center gap-2">
              <Button variant="success" onClick={() => setIsActive(true)} disabled={isActive}>
                Avvia
              </Button>
              <Button variant="danger" onClick={() => setIsActive(false)} disabled={!isActive}>
                Ferma
              </Button>
              <Button variant="secondary" onClick={() => { setMinutes(25); setSeconds(0); setIsActive(false); }}>
                Reset
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PomodoroStandard;