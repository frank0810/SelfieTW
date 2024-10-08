import { Modal, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
const SingleEventPreview = ({ event }) => {
    const [showModal, setShowModal] = useState(false);
    const [editedEvent, setEditedEvent] = useState({ ...event });

    const handleEditEvent = async () => {
        try {
            const response = await fetch(`http://localhost:3000/events/update/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(editedEvent),
            });
            window.location.reload()

            if (response.ok) {
                setShowModal(false);

            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Errore nella modifica dell\'evento:', error);
        }
    };

    const handleDeleteEvent = async () => {
        try {
            const response = await fetch(`http://localhost:3000/events/delete/${event._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                setShowModal(false)
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Errore nella cancellazione dell\'evento:', error);
        }
    };

    return (
        <ListGroup.Item key={event._id} className="mb-3">
            <h5>{event.title}</h5>
            <p><strong>Tipo:</strong> Evento</p>
            <Row>
                <Col>
                    {event.isAllDay ? (
                        <p><strong>Tutto il giorno</strong></p>
                    ) : (
                        <p>

                            <strong>Orario di Inizio:</strong> {event.startTime} <br />
                            <strong>Orario di Fine:</strong> {event.endTime}
                        </p>
                    )}
                    {<p><strong>Data di Fine:</strong> {event.endDate.slice(0, 10)}</p>}
                    {event.location && <p><strong>Luogo:</strong> {event.location}</p>}

                </Col>
                <Col className="text-end">
                    <Button onClick={() => setShowModal(true)} variant="warning" className="me-2">Modifica</Button>
                    <Button variant="danger" onClick={() => handleDeleteEvent(event._id)}>Elimina</Button>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedEvent.title}
                                onChange={(e) => setEditedEvent({ ...editedEvent, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDate">
                            <Form.Label>Data di Inizio</Form.Label>
                            <Form.Control
                                type="date"
                                value={editedEvent.startDate.slice(0, 10)}
                                onChange={(e) => setEditedEvent({ ...editedEvent, startDate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formEndDate">
                            <Form.Label>Data di Fine</Form.Label>
                            <Form.Control
                                type="date"
                                value={editedEvent.endDate.slice(0, 10)}
                                onChange={(e) => setEditedEvent({ ...editedEvent, endDate: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formIsAllDay">
                            <Form.Check
                                type="checkbox"
                                label="Tutto il giorno"
                                checked={editedEvent.isAllDay}
                                onChange={(e) => setEditedEvent({ ...editedEvent, isAllDay: e.target.value })}
                            />
                        </Form.Group>

                        {!editedEvent.isAllDay && (
                            <>
                                <Form.Group controlId="formTime">
                                    <Form.Label>Ora Inizio</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={editedEvent.startTime}
                                        onChange={(e) => setEditedEvent({ ...editedEvent, startTime: e.target.value })}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formEndTime">
                                    <Form.Label>Ora Fine</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={editedEvent.endTime}
                                        onChange={(e) => setEditedEvent({ ...editedEvent, endTime: e.target.value })}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group controlId="formLocation">
                            <Form.Label>Luogo</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Inserisci il luogo"
                                value={editedEvent.location}
                                onChange={(e) => setEditedEvent({ ...editedEvent, location: e.target.value })}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleEditEvent} className="me-3 mt-3">
                            Salva Modifiche
                        </Button>
                        <Button variant="danger" onClick={handleDeleteEvent} className="mt-3">
                            Elimina Attività
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </ListGroup.Item>

    )
}

export default SingleEventPreview;