

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';

const CreateEventModal = ({ event, show, handleClose, handleCreate, defaultDate }) => {

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Funzione per ottenere l'ora attuale formattata
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Formato HH:MM
  };

  // Funzione per ottenere l'ora attuale + 1 ora formattata
  const getCurrentTimePlusOne = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toTimeString().slice(0, 5); // Formato HH:MM
  };

  // Inizializza i valori quando si apre il modal o cambia defaultDate
  useEffect(() => {
    if (show && defaultDate) {
      setStartDate(defaultDate);
      setEndDate(defaultDate);
      setStartTime(getCurrentTime());
      setEndTime(getCurrentTimePlusOne());
    }
  }, [show, defaultDate]);

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
    // Rimossa la validazione che impediva eventi nella stessa giornata con orario di fine precedente a quello di inizio
    // Ora controlliamo solo se la data di fine è precedente alla data di inizio, non gli orari nella stessa giornata
    if (!isAllDay && new Date(endDate) < new Date(startDate)) {
      setError('La data di fine deve essere successiva o uguale a quella di inizio');
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

          <div className="d-flex justify-content-end">
            <Button 
              variant="primary" 
              onClick={onCreate}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" className="me-2" /> : '💾 '}
              Crea Evento
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEventModal;