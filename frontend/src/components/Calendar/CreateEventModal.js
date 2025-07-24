import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useTimeMachine } from '../../TimeMachineContext';

const CreateEventModal = ({ show, handleClose, handleCreate, defaultStartDate }) => {
  const { virtualTime } = useTimeMachine();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date(defaultStartDate).toLocaleDateString('en-CA'));
  const [endDate, setEndDate] = useState(new Date(defaultStartDate).toLocaleDateString('en-CA'));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [isAllDay, setIsAllDay] = useState(false);
  const [frequency, setFrequency] = useState('none');
  const [repeatUntil, setRepeatUntil] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartTimeChange = (newStartTime) => {
    setStartTime(newStartTime);
    
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
      setEndTime(newEndTime);
    }
  };

  useEffect(() => {
    if (show) {
      setStartDate(new Date(defaultStartDate).toLocaleDateString('en-CA'));
      setEndDate(new Date(defaultStartDate).toLocaleDateString('en-CA'));
      
      const startTimeValue = virtualTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setStartTime(startTimeValue);
      
      const endTimeDate = new Date(virtualTime);
      endTimeDate.setHours(endTimeDate.getHours() + 1);
      setEndTime(endTimeDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [show, defaultStartDate]);

  const validateForm = () => {
    if (!title.trim()) {
      setError('Il titolo è obbligatorio');
      return false;
    }
    if (!startDate) {
      setError('La data di inizio è obbligatoria');
      return false;
    }
    if (!endDate) {
      setError('La data di fine è obbligatoria');
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
      location,
      isAllDay,
      frequency,
      repeatUntil: frequency !== 'none' ? repeatUntil : null
    });
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>📅 Crea Nuovo Evento</Modal.Title>
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

          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Data di Inizio *</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              isInvalid={!!error && !startDate}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>Data di Fine *</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              isInvalid={!!error && !endDate}
            />
          </Form.Group>

          <Form.Group controlId="formIsAllDay" className="mb-3">
            <Form.Switch
              label="🌅 Tutto il giorno"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
            />
          </Form.Group>

          {!isAllDay && (
            <>
              <Form.Group className="mb-3" controlId="formTime">
                <Form.Label>Ora Inizio</Form.Label>
                <Form.Control
                  type="time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEndTime">
                <Form.Label>Ora Fine</Form.Label>
                <Form.Control
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </Form.Group>
            </>
          )}

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Luogo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci il luogo (opzionale)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFrequency">
            <Form.Label>Frequenza</Form.Label>
            <Form.Control
              as="select"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              <option value="none">Mai</option>
              <option value="daily">Giornaliera</option>
              <option value="weekly">Settimanale</option>
              <option value="monthly">Mensile</option>
              <option value="yearly">Annuale</option>
            </Form.Control>
          </Form.Group>

          {frequency !== 'none' && (
            <Form.Group className="mb-3" controlId="formRepeatCount">
              <Form.Label>Ripeti fino a:</Form.Label>
              <Form.Control
                type="date"
                value={repeatUntil}
                onChange={(e) => setRepeatUntil(e.target.value)}
              />
            </Form.Group>
          )}

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