import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateEventModal = ({ show, handleClose, handleCreate }) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  //const [frequency, setFrequency] = useState('');
  //const [repeatCount, setRepeatCount] = useState('');

  const onCreate = () => {
    handleCreate({
      title,
      startDate,
      endDate,
      startTime: isAllDay ? null : startTime,
      endTime: isAllDay ? null : endTime,
      location,
      isAllDay
      //frequency,
      //repeatCount
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crea Nuovo Evento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il titolo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Data Inizio</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formIsAllDay">
            <Form.Check
              type="checkbox"
              label="Tutto il giorno"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
          </Form.Group>

          {!isAllDay && (
            <>
              <Form.Group controlId="formTime">
                <Form.Label>Ora Inizio</Form.Label>
                <Form.Control
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formEndTime">
                <Form.Label>Ora Fine</Form.Label>
                <Form.Control
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Form.Group>
            </>
          )}

          <Form.Group controlId="formLocation">
            <Form.Label>Luogo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il luogo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          {/* <Form.Group controlId="formFrequency">
            <Form.Label>Frequenza</Form.Label>
            <Form.Control
              as="select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="">Nessuna</option>
              <option value="daily">Giornaliera</option>
              <option value="weekly">Settimanale</option>
              <option value="monthly">Mensile</option>
              <option value="custom">Personalizzata</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formRepeatCount">
            <Form.Label>Numero di Ripetizioni</Form.Label>
            <Form.Control
              type="number"
              placeholder="Numero di ripetizioni"
              value={repeatCount}
              onChange={(e) => setRepeatCount(e.target.value)}
            />
          </Form.Group> */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annulla</Button>
        <Button variant="primary" onClick={onCreate}>Crea Evento</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateEventModal;
