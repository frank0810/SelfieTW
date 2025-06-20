// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useTimeMachine } from '../../TimeMachineContext';

// const CreateEventModal = ({ show, handleClose, handleCreate, defaultStartDate }) => {
//   const { virtualTime } = useTimeMachine();
//   const [title, setTitle] = useState('');
//   const [startDate, setStartDate] = useState(new Date(defaultStartDate).toLocaleDateString('en-CA')); // formato YYYY-MM-DD
//   const [endDate, setEndDate] = useState(new Date(defaultStartDate).toLocaleDateString('en-CA'));
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [location, setLocation] = useState('');
//   const [isAllDay, setIsAllDay] = useState(false);
//   const [frequency, setFrequency] = useState('none');
//   const [repeatUntil, setRepeatUntil] = useState(''); //DA GESTIRE: ripetizione infinita

//   useEffect(() => {
//     setStartDate(new Date(defaultStartDate).toLocaleDateString('en-CA'));
//     setEndDate(new Date(defaultStartDate).toLocaleDateString('en-CA'));
//     setStartTime(virtualTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
//     setEndTime(virtualTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
// }, [defaultStartDate]);


//   const onCreate = () => {
//     handleCreate({
//       title,
//       startDate,
//       endDate,
//       startTime: isAllDay ? null : startTime,
//       endTime: isAllDay ? null : endTime,
//       location,
//       isAllDay,
//       frequency,
//       repeatUntil: frequency !== 'none' ? repeatUntil : null
//     });
//   };

//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Crea Nuovo Evento</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           <Form.Group controlId="formTitle">
//             <Form.Label>Titolo</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Inserisci il titolo"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </Form.Group>
//           <Form.Group controlId="formDate">
//             <Form.Label>Data di Inizio</Form.Label>
//             <Form.Control
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formEndDate">
//             <Form.Label>Data di Fine</Form.Label>
//             <Form.Control
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formIsAllDay">
//             <Form.Check
//               type="checkbox"
//               label="Tutto il giorno"
//               checked={isAllDay}
//               onChange={(e) => setIsAllDay(e.target.checked)}
//             />
//           </Form.Group>

//           {!isAllDay && (
//             <>
//               <Form.Group controlId="formTime">
//                 <Form.Label>Ora Inizio</Form.Label>
//                 <Form.Control
//                   type="time"
//                   value={startTime}
//                   onChange={(e) => setStartTime(e.target.value)}
//                 />
//               </Form.Group>

//               <Form.Group controlId="formEndTime">
//                 <Form.Label>Ora Fine</Form.Label>
//                 <Form.Control
//                   type="time"
//                   value={endTime}
//                   onChange={(e) => setEndTime(e.target.value)}
//                 />
//               </Form.Group>
//             </>
//           )}

//           <Form.Group controlId="formLocation">
//             <Form.Label>Luogo</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Inserisci il luogo"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//             />
//           </Form.Group>

//           <Form.Group controlId="formFrequency">
//             <Form.Label>Frequenza</Form.Label>
//             <Form.Control
//               as="select"
//               value={frequency}
//               onChange={(e) => setFrequency(e.target.value)}
//             >
//               <option value="none">Mai</option>
//               <option value="daily">Giornaliera</option>
//               <option value="weekly">Settimanale</option>
//               <option value="monthly">Mensile</option>
//               <option value="yearly">Annuale</option>
//             </Form.Control>
//           </Form.Group>

//           {frequency !== 'none' && (
//           <Form.Group controlId="formRepeatCount">
//             <Form.Label>Ripeti fino a:</Form.Label>
//             <Form.Control
//               type="date"
//               value={repeatUntil}
//               onChange={(e) => setRepeatUntil(e.target.value)}
//             />
//           </Form.Group>
//           )}

//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>Annulla</Button>
//         <Button variant="primary" onClick={onCreate}>Crea Evento</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default CreateEventModal;


import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';

const CreateEventModal = ({ show, handleClose, handleCreate, defaultDate }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!title.trim()) {
      setError('Il titolo è obbligatorio');
      return false;
    }
    if (!startDate || !endDate) {
      setError('Le date di inizio e fine sono obbligatorie');
      return false;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('La data di fine non può essere precedente alla data di inizio');
      return false;
    }
    if (!isAllDay && (!startTime || !endTime)) {
      setError('Gli orari sono obbligatori per eventi non giornalieri');
      return false;
    }
    if (!isAllDay && startDate === endDate && startTime >= endTime) {
      setError('L\'orario di fine deve essere successivo a quello di inizio');
      return false;
    }
    setError('');
    return true;
  };

  const onCreate = () => {
    if (!validateForm()) return;

    setLoading(true);
    handleCreate({
      title,
      startDate,
      endDate,
      startTime: isAllDay ? null : startTime,
      endTime: isAllDay ? null : endTime,
      isAllDay,
      location
    });
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>➕ Crea Nuovo Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        
        <Form>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Titolo *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il titolo dell'evento"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!error && !title.trim()}
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStartDate">
                <Form.Label>Data di Inizio *</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  isInvalid={!!error && !startDate}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEndDate">
                <Form.Label>Data di Fine *</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  isInvalid={!!error && !endDate}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formIsAllDay">
            <Form.Switch
              label="🕐 Tutto il giorno"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
          </Form.Group>

          {!isAllDay && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formStartTime">
                  <Form.Label>Ora Inizio *</Form.Label>
                  <Form.Control
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    isInvalid={!!error && !startTime}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEndTime">
                  <Form.Label>Ora Fine *</Form.Label>
                  <Form.Control
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    isInvalid={!!error && !endTime}
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          <Form.Group className="mb-4" controlId="formLocation">
            <Form.Label>📍 Luogo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il luogo dell'evento (opzionale)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button 
              variant="primary" 
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" className="me-2" /> : '💾 '}
              Crea Evento
            </Button>
            
            <Button 
              variant="outline-secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              ❌ Annulla
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEventModal;