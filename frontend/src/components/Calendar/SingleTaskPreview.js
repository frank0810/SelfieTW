import { Modal, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
const SingleTaskPreview = ({ task }) => {
    const [showModal, setShowModal] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });

    const handleEditTask = async () => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/update/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(editedTask),
            });
            window.location.reload()

            if (response.ok) {
                setShowModal(false);

            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Errore nella modifica dell\'attività:', error);
        }
    };

    const handleDeleteTask = async () => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/delete/${task._id}`, {
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
            console.error('Errore nella cancellazione dell\'attività:', error);
        }
    };

    return (
        <ListGroup.Item key={task._id} className="mb-3">
            <h5>{task.title}</h5>
            <p><strong>Tipo:</strong> Attività</p>
            <Row>
                <Col>
                    <p><strong>Scadenza:</strong> {task.deadline.slice(0, 10)}</p>
                    {task.description && <p><strong>Descrizione:</strong> {task.description}</p>}
                </Col>
                <Col className="text-end">
                    <Button onClick={() => setShowModal(true)} variant="warning" className="me-2">Modifica</Button>
                    <Button variant="danger" onClick={() => handleDeleteTask(task._id)}>Elimina</Button>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifica Attività</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Titolo</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTask.title}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Descrizione</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editedTask.description}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDeadline">
                            <Form.Label>Data di Scadenza</Form.Label>
                            <Form.Control
                                type="date"
                                value={editedTask.deadline.slice(0, 10)}
                                onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                            />
                        </Form.Group>
                        
                        <Form.Group controlId="formIsCompleted">
                            <Form.Switch
                                type="checkbox"
                                className="me-3 mt-3"
                                label="Attività completata"
                                checked={editedTask.isCompleted}
                                onChange={() => {
                                    setEditedTask(prev => ({
                                        ...prev,
                                        isCompleted: !prev.isCompleted,
                                    }));
                                }}
                            />
                        </Form.Group>

                        <Button variant="primary" onClick={handleEditTask} className="me-3 mt-3">
                            Salva Modifiche
                        </Button>
                        <Button variant="danger" onClick={handleDeleteTask} className="mt-3">
                            Elimina Attività
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </ListGroup.Item>

    )
}

export default SingleTaskPreview;