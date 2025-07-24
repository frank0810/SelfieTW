// import React, { useEffect } from 'react';
// import { ListGroup, Row, Col } from 'react-bootstrap';
// import { useTimeMachine } from '../../TimeMachineContext';

// const EventListPreview = ({ events }) => {
//   const { virtualTime } = useTimeMachine();

//   const getTodaysEvents = (events, currentDate) => {
//     const today = currentDate.toISOString().slice(0, 10);
//     return events.filter(event => {
//       const eventStart = new Date(event.startDate).toISOString().slice(0, 10);
//       const eventEnd = new Date(event.endDate).toISOString().slice(0, 10);
//       return today >= eventStart && today <= eventEnd;
//     });
//   };

//   const getWeeklyEvents = (events, currentDate) => {
//     const startOfWeek = new Date(currentDate);
//     startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunedì
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Domenica
//     endOfWeek.setHours(23, 59, 59, 999);

//     return events.filter(event => {
//       const eventStart = new Date(event.startDate);
//       const eventEnd = new Date(event.endDate);
//       return (
//         (eventStart >= startOfWeek && eventStart <= endOfWeek) ||
//         (eventEnd >= startOfWeek && eventEnd <= endOfWeek) ||
//         (eventStart <= startOfWeek && eventEnd >= endOfWeek)
//       );
//     });
//   };

//   useEffect(() => {}, [virtualTime]);

//   const currentDate = new Date(virtualTime || new Date());
//   const todaysEvents = getTodaysEvents(events, currentDate);
//   const weeklyEvents = getWeeklyEvents(events, currentDate);

//   return (
//     <div className="text-center">
//       <h2 className="mb-4">Eventi di Oggi</h2>
//       <ListGroup className="w-75 mx-auto">
//         <ListGroup.Item className="text-center bg-primary text-white">
//           <Row>
//             <Col>Titolo</Col>
//             <Col>Luogo</Col>
//             <Col>Durata</Col>
//           </Row>
//         </ListGroup.Item>
//         {todaysEvents.length > 0 ? (
//           todaysEvents.map(event => (
//             <ListGroup.Item key={event._id}>
//               <Row>
//                 <Col><strong>{event.title}</strong></Col>
//                 <Col>{event.location || 'Nessuna posizione'}</Col>
//                 <Col>
//                   {event.startTime
//                     ? `${event.startTime} - ${event.endTime || ''}`
//                     : 'Tutto il giorno'}
//                 </Col>
//               </Row>
//             </ListGroup.Item>
//           ))
//         ) : (
//           <ListGroup.Item>Nessun evento per oggi</ListGroup.Item>
//         )}
//       </ListGroup>

//       <h2 className="mt-4 mb-4">Eventi della Settimana</h2>
//       <ListGroup className="w-75 mx-auto">
//         <ListGroup.Item className="text-center bg-primary text-white">
//           <Row>
//             <Col>Titolo</Col>
//             <Col>Luogo</Col>
//             <Col>Giorno</Col>
//             <Col>Durata</Col>
//           </Row>
//         </ListGroup.Item>
//         {weeklyEvents.length > 0 ? (
//           weeklyEvents.map(event => {
//             const eventDay = new Date(event.startDate).toLocaleDateString('it-IT', {
//               weekday: 'long', // mi dice il giorno della settimana
//             });
//             return (
//               <ListGroup.Item key={event._id}>
//                 <Row>
//                   <Col><strong>{event.title}</strong></Col>
//                   <Col>{event.location || 'Nessuna posizione'}</Col>
//                   <Col>{eventDay}</Col>
//                   <Col>
//                     {event.startTime
//                       ? `${event.startTime} - ${event.endTime || ''}`
//                       : 'Tutto il giorno'}
//                   </Col>
//                 </Row>
//               </ListGroup.Item>
//             );
//           })
//         ) : (
//           <ListGroup.Item>Nessun evento per questa settimana</ListGroup.Item>
//         )}
//       </ListGroup>
//     </div>
//   );
// };

// export default EventListPreview;

import React, { useEffect, useState } from 'react';
import { ListGroup, Row, Col, Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useTimeMachine } from '../../TimeMachineContext';
import { API_BASE_URL } from '../../config/api.js';

const EventListPreview = ({ events, onEventUpdate }) => {
  const { virtualTime } = useTimeMachine();
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editedEvent, setEditedEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Funzione per abbreviare il titolo
  const abbreviateTitle = (title, maxLength = 15) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Funzione per aggiornare automaticamente l'orario di fine
  const handleStartTimeChange = (newStartTime) => {
    setEditedEvent(prev => {
      const updated = { ...prev, startTime: newStartTime };
      
      if (newStartTime) {
        const [hours, minutes] = newStartTime.split(':');
        const startDateTime = new Date();
        startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(endDateTime.getHours() + 1);
        
        const newEndTime = endDateTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
        updated.endTime = newEndTime;
      }
      
      return updated;
    });
  };

  const getTodaysEvents = (events, currentDate) => {
    const today = currentDate.toISOString().slice(0, 10);
    return events.filter(event => {
      const eventStart = new Date(event.startDate).toISOString().slice(0, 10);
      const eventEnd = new Date(event.endDate).toISOString().slice(0, 10);
      return today >= eventStart && today <= eventEnd;
    });
  };

  const getWeeklyEvents = (events, currentDate) => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Lunedì
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domenica
    endOfWeek.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (
        (eventStart >= startOfWeek && eventStart <= endOfWeek) ||
        (eventEnd >= startOfWeek && eventEnd <= endOfWeek) ||
        (eventStart <= startOfWeek && eventEnd >= endOfWeek)
      );
    });
  };

  // Funzione per aprire il modale di modifica
  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setEditedEvent({ ...event });
    setShowModal(true);
    setError('');
  };

  // Funzione per chiudere il modale
  const handleModalClose = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setEditedEvent({});
    setError('');
  };

  // Validazione del form
  const validateEvent = () => {
    if (!editedEvent.title?.trim()) {
      setError('Il titolo è obbligatorio');
      return false;
    }
    if (!editedEvent.startDate) {
      setError('La data di inizio è obbligatoria');
      return false;
    }
    if (!editedEvent.endDate) {
      setError('La data di fine è obbligatoria');
      return false;
    }
    
    const startDate = new Date(editedEvent.startDate);
    const endDate = new Date(editedEvent.endDate);
    
    if (endDate < startDate) {
      setError('La data di fine non può essere precedente alla data di inizio');
      return false;
    }

    if (!editedEvent.isAllDay) {
      if (!editedEvent.startTime || !editedEvent.endTime) {
        setError('Gli orari di inizio e fine sono obbligatori');
        return false;
      }
      
      if (startDate.toDateString() === endDate.toDateString()) {
        const startDateTime = new Date(`${editedEvent.startDate}T${editedEvent.startTime}`);
        const endDateTime = new Date(`${editedEvent.endDate}T${editedEvent.endTime}`);
        
        if (endDateTime <= startDateTime) {
          setError('L\'orario di fine deve essere successivo a quello di inizio');
          return false;
        }
      }
    }
    
    setError('');
    return true;
  };

  // Salva le modifiche
  const handleSaveEvent = async () => {
    if (!validateEvent()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/events/update/${selectedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editedEvent),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        handleModalClose();
        if (onEventUpdate) {
          onEventUpdate(updatedEvent);
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Errore del server');
      }
    } catch (error) {
      console.error('Errore nella modifica dell\'evento:', error);
      setError('Errore nella modifica dell\'evento. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, [virtualTime]);

  const currentDate = new Date(virtualTime || new Date());
  const todaysEvents = getTodaysEvents(events, currentDate);
  const weeklyEvents = getWeeklyEvents(events, currentDate);

  return (
    <div className="text-center">
      {/* EVENTI DI OGGI */}
      <h2 className="mb-4">Eventi di Oggi</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header desktop per eventi di oggi */}
        <ListGroup.Item className="d-none d-md-block text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Luogo</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>
        
        {/* Header mobile per eventi di oggi */}
        <ListGroup.Item className="d-block d-md-none text-center bg-primary text-white">
          <Row>
            <Col xs={5}>Titolo</Col>
            <Col xs={5}>Durata</Col>
            <Col xs={2}>Azioni</Col>
          </Row>
        </ListGroup.Item>

        {todaysEvents.length > 0 ? (
          todaysEvents.map(event => (
            <ListGroup.Item key={event._id}>
              {/* Vista desktop */}
              <div className="d-none d-md-block">
                <Row>
                  <Col><strong>{event.title}</strong></Col>
                  <Col>{event.location || 'Nessuna posizione'}</Col>
                  <Col>
                    {event.startTime
                      ? `${event.startTime} - ${event.endTime || ''}`
                      : 'Tutto il giorno'}
                  </Col>
                </Row>
              </div>
              
              {/* Vista mobile */}
              <div className="d-block d-md-none">
                <Row className="align-items-center">
                  <Col xs={5}>
                    <strong>{abbreviateTitle(event.title)}</strong>
                  </Col>
                  <Col xs={5}>
                    <small>
                      {event.startTime
                        ? `${event.startTime} - ${event.endTime || ''}`
                        : 'Tutto il giorno'}
                    </small>
                  </Col>
                  <Col xs={2} className="text-center">
                    <span 
                      style={{ cursor: 'pointer', fontSize: '14px' }}
                      onClick={() => handleEditEvent(event)}
                    >
                      ✏️
                    </span>
                  </Col>
                </Row>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>Nessun evento per oggi</ListGroup.Item>
        )}
      </ListGroup>

      {/* EVENTI DELLA SETTIMANA */}
      <h2 className="mt-4 mb-4">Eventi della Settimana</h2>
      <ListGroup className="w-75 mx-auto">
        {/* Header desktop per eventi della settimana */}
        <ListGroup.Item className="d-none d-md-block text-center bg-primary text-white">
          <Row>
            <Col>Titolo</Col>
            <Col>Luogo</Col>
            <Col>Giorno</Col>
            <Col>Durata</Col>
          </Row>
        </ListGroup.Item>
        
        {/* Header mobile per eventi della settimana */}
        <ListGroup.Item className="d-block d-md-none text-center bg-primary text-white">
          <Row>
            <Col xs={4}>Titolo</Col>
            <Col xs={3}>Giorno</Col>
            <Col xs={3}>Durata</Col>
            <Col xs={2}>Azioni</Col>
          </Row>
        </ListGroup.Item>

        {weeklyEvents.length > 0 ? (
          weeklyEvents.map(event => {
            const eventDay = new Date(event.startDate).toLocaleDateString('it-IT', {
              weekday: 'short', // Versione abbreviata per mobile
            });
            return (
              <ListGroup.Item key={event._id}>
                {/* Vista desktop */}
                <div className="d-none d-md-block">
                  <Row>
                    <Col><strong>{event.title}</strong></Col>
                    <Col>{event.location || 'Nessuna posizione'}</Col>
                    <Col>{new Date(event.startDate).toLocaleDateString('it-IT', { weekday: 'long' })}</Col>
                    <Col>
                      {event.startTime
                        ? `${event.startTime} - ${event.endTime || ''}`
                        : 'Tutto il giorno'}
                    </Col>
                  </Row>
                </div>
                
                {/* Vista mobile */}
                <div className="d-block d-md-none">
                  <Row className="align-items-center">
                    <Col xs={4}>
                      <strong>{abbreviateTitle(event.title)}</strong>
                    </Col>
                    <Col xs={3}>
                      <small>{eventDay}</small>
                    </Col>
                    <Col xs={3}>
                      <small>
                        {event.startTime
                          ? `${event.startTime.substring(0, 5)}-${event.endTime?.substring(0, 5) || ''}`
                          : 'Tutto il giorno'}
                      </small>
                    </Col>
                    <Col xs={2} className="text-center">
                      <span 
                        style={{ cursor: 'pointer', fontSize: '14px' }}
                        onClick={() => handleEditEvent(event)}
                      >
                        ✏️
                      </span>
                    </Col>
                  </Row>
                </div>
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item>Nessun evento per questa settimana</ListGroup.Item>
        )}
      </ListGroup>

      {/* Modal di modifica per mobile */}
      <Modal show={showModal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ Modifica Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          
          <Form>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Titolo *</Form.Label>
              <Form.Control
                type="text"
                value={editedEvent.title || ''}
                onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                isInvalid={!!error && !editedEvent.title?.trim()}
                placeholder="Inserisci il titolo dell'evento"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formDate">
                  <Form.Label>Data di Inizio *</Form.Label>
                  <Form.Control
                    type="date"
                    value={editedEvent.startDate?.slice(0, 10) || ''}
                    onChange={(e) => setEditedEvent({ ...editedEvent, startDate: e.target.value })}
                    isInvalid={!!error && !editedEvent.startDate}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formEndDate">
                  <Form.Label>Data di Fine *</Form.Label>
                  <Form.Control
                    type="date"
                    value={editedEvent.endDate?.slice(0, 10) || ''}
                    onChange={(e) => setEditedEvent({ ...editedEvent, endDate: e.target.value })}
                    isInvalid={!!error && !editedEvent.endDate}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formIsAllDay">
              <Form.Switch
                label="🕐 Tutto il giorno"
                checked={editedEvent.isAllDay || false}
                onChange={(e) => setEditedEvent({ ...editedEvent, isAllDay: e.target.checked })}
              />
            </Form.Group>

            {!editedEvent.isAllDay && (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formTime">
                    <Form.Label>Ora Inizio *</Form.Label>
                    <Form.Control
                      type="time"
                      value={editedEvent.startTime || ''}
                      onChange={(e) => handleStartTimeChange(e.target.value)}
                      isInvalid={!!error && !editedEvent.startTime}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formEndTime">
                    <Form.Label>Ora Fine *</Form.Label>
                    <Form.Control
                      type="time"
                      value={editedEvent.endTime || ''}
                      onChange={(e) => setEditedEvent({ ...editedEvent, endTime: e.target.value })}
                      isInvalid={!!error && !editedEvent.endTime}
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
                value={editedEvent.location || ''}
                onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button 
                variant="primary" 
                onClick={handleSaveEvent}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" className="me-2" /> : '💾 '}
                Salva Modifiche
              </Button>
              
              <Button 
                variant="outline-secondary" 
                onClick={handleModalClose}
                disabled={loading}
              >
                ❌ Annulla
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EventListPreview;