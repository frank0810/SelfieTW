import React, { useState, useCallback } from 'react';
import { Modal, Form, Button, ListGroup, Row, Col, Dropdown, Alert, Spinner, Badge } from 'react-bootstrap';
import { useTimeMachine } from '../../TimeMachineContext';

const SingleEventPreview = ({ event, timeType, onEventUpdate, onEventDelete }) => {
    const { virtualTime } = useTimeMachine();
    const [showModal, setShowModal] = useState(false);
    const [editedEvent, setEditedEvent] = useState({ ...event });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteType, setDeleteType] = useState(''); // 'event' o 'occurrence'

    // Gestisce gli orari basati su timeType (giorno di inizio, fine o intermedio)
    const displayStartTime = timeType === 'start' ? event.startTime : '00:00';
    const displayEndTime = event.isAllDay ? '23:59' : event.endTime;

    // Gestione errori centralizzata
    const handleApiError = (error, operation) => {
        console.error(`Errore nella ${operation} dell'evento:`, error);
        setError(`Errore nella ${operation} dell'evento. Riprova più tardi.`);
        setLoading(false);
    };

    // Validazione del form
    const validateEvent = useCallback(() => {
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

        // Validazione orari se non è tutto il giorno
        if (!editedEvent.isAllDay) {
            if (!editedEvent.startTime || !editedEvent.endTime) {
                setError('Gli orari di inizio e fine sono obbligatori');
                return false;
            }
            
            // Se è lo stesso giorno, controlla che l'ora di fine sia dopo quella di inizio
            if (startDate.toDateString() === endDate.toDateString()) {
                const startDateTime = new Date(`${editedEvent.startDate}T${editedEvent.startTime}`);
                const endDateTime = new Date(`${editedEvent.endDate}T${editedEvent.endTime}`);
                
                if (endDateTime <= startDateTime) {
                    setError('L\'orario di fine deve essere successivo a quello di inizio');
                    return false;
                }
            }
        }
        
        return true;
    }, [editedEvent]);

    const handleEditEvent = async () => {
        if (!validateEvent()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/events/update/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(editedEvent),
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                setShowModal(false);
                setError('');
                onEventUpdate?.(updatedEvent);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore del server');
            }
        } catch (error) {
            handleApiError(error, 'modifica');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/events/delete/${event._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                setShowModal(false);
                setShowDeleteConfirm(false);
                onEventDelete?.(event._id);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore del server');
            }
        } catch (error) {
            handleApiError(error, 'eliminazione');
        } finally {
            setLoading(false);
        }
    };

    const handleExcludeOccurrence = async () => {
        setLoading(true);
        setError('');

        try {
            const updatedExcludedDates = Array.isArray(editedEvent.excludedDates) ? editedEvent.excludedDates : [];
            const newExcludedDate = editedEvent.startDate;
            if (!updatedExcludedDates.includes(newExcludedDate)) {
                updatedExcludedDates.push(newExcludedDate);
            }
            
            const updatedEvent = { 
                excludedDates: updatedExcludedDates
            };
    
            const response = await fetch(`http://localhost:3000/events/update/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedEvent),
            });
    
            if (response.ok) {
                setShowDeleteConfirm(false);
                onEventUpdate?.(updatedEvent);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore del server');
            }
        } catch (error) {
            handleApiError(error, 'eliminazione dell\'occorrenza');
        } finally {
            setLoading(false);
        }
    };

    // Funzione per determinare lo stato e il colore del badge usando virtualTime
    const getEventStatus = () => {
        const now = new Date(virtualTime);
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        
        if (endDate < now) {
            return { text: 'Concluso', variant: 'secondary' };
        } else if (startDate <= now && endDate >= now) {
            return { text: 'In Corso', variant: 'success' };
        } else if (startDate.toDateString() === now.toDateString()) {
            return { text: 'Oggi', variant: 'warning' };
        } else if (startDate > now) {
            return { text: 'Programmato', variant: 'primary' };
        }
        return { text: 'Evento', variant: 'info' };
    };

    const status = getEventStatus();

    const handleModalClose = () => {
        setShowModal(false);
        setEditedEvent({ ...event });
        setError('');
        setShowDeleteConfirm(false);
        setDeleteType('');
    };

    const handleDeleteClick = (type) => {
        setDeleteType(type);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (deleteType === 'event') {
            handleDeleteEvent();
        } else if (deleteType === 'occurrence') {
            handleExcludeOccurrence();
        }
    };

    return (
        <>
            <ListGroup.Item className="mb-2 border-0">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0">{event.title}</h6>
                    <Badge bg={status.variant} pill>{status.text}</Badge>
                </div>
                
                <div className="mb-1">
                    <small className="badge bg-info me-1">📅 Evento</small>
                    {event.frequency && event.frequency !== 'none' && (
                        <small className="badge bg-secondary me-1">🔄</small>
                    )}
                </div>

                <Row className="mb-1">
                    <Col>
                        {event.isAllDay ? (
                            <div className="mb-1">
                                <small className="text-muted">🕐 </small>
                                <small><strong>Tutto il giorno</strong></small>
                            </div>
                        ) : (
                            <div className="mb-1">
                                <small className="text-muted">🕐 </small>
                                <small><strong>Dalle {displayStartTime} alle {displayEndTime}</strong></small>
                            </div>
                        )}
                        
                        <div className="mb-1">
                            <small className="text-muted">📅 </small>
                            <small><strong>Fine:</strong> {new Date(event.endDate).toLocaleDateString('it-IT')}</small>
                        </div>
                        
                        {event.location && (
                            <div className="mb-1">
                                <small className="text-muted">📍 </small>
                                <small><strong>Luogo:</strong> {event.location}</small>
                            </div>
                        )}
                    </Col>
                </Row>

                <div className="d-flex justify-content-end gap-1">
                    <Button 
                        onClick={() => setShowModal(true)} 
                        variant="outline-primary"
                        size="sm"
                        className="py-0"
                    >
                        ✏️
                    </Button>

                    {event.frequency && event.frequency !== 'none' ? (
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-danger" size="sm" className="py-0">
                                🗑️
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleDeleteClick('event')}>
                                    🗑️ Elimina Evento
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDeleteClick('occurrence')}>
                                    ❌ Elimina Occorrenza
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button 
                            variant="outline-danger" 
                            size="sm"
                            className="py-0"
                            onClick={() => handleDeleteClick('event')}
                        >
                            🗑️
                        </Button>
                    )}
                </div>
            </ListGroup.Item>

            {/* Modal di modifica */}
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
                                            onChange={(e) => setEditedEvent({ ...editedEvent, startTime: e.target.value })}
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
                                onClick={handleEditEvent}
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

            {/* Modal di conferma eliminazione */}
            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {deleteType === 'occurrence' ? '❌ Elimina Occorrenza' : '🗑️ Elimina Evento'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <div className="mb-3">
                            <span className="fs-1">⚠️</span>
                        </div>
                        {deleteType === 'occurrence' ? (
                            <>
                                <p>Sei sicuro di voler eliminare solo questa occorrenza dell'evento <strong>"{event.title}"</strong>?</p>
                                <p className="text-muted">L'evento principale rimarrà attivo, ma questa singola occorrenza verrà nascosta.</p>
                            </>
                        ) : (
                            <>
                                <p>Sei sicuro di voler eliminare completamente l'evento <strong>"{event.title}"</strong>?</p>
                                <p className="text-muted">Questa azione eliminerà l'evento e tutte le sue occorrenze. Non può essere annullata.</p>
                            </>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Annulla
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={confirmDelete}
                        disabled={loading}
                    >
                        {loading ? <Spinner size="sm" className="me-2" /> : (deleteType === 'occurrence' ? '❌ ' : '🗑️ ')}
                        {deleteType === 'occurrence' ? 'Elimina Occorrenza' : 'Elimina Definitivamente'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SingleEventPreview;