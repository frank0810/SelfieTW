import React, { useState, useCallback } from 'react';
import { Modal, Form, Button, ListGroup, Row, Col, Alert, Spinner, Badge } from 'react-bootstrap';
import { useTimeMachine } from '../../TimeMachineContext';

const SingleTaskPreview = ({ task, onTaskUpdate, onTaskDelete }) => {
    const { virtualTime } = useTimeMachine();
    const [showModal, setShowModal] = useState(false);
    const [editedTask, setEditedTask] = useState({ ...task });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleApiError = (error, operation) => {
        console.error(`Errore nella ${operation} dell'attività:`, error);
        setError(`Errore nella ${operation} dell'attività. Riprova più tardi.`);
        setLoading(false);
    };

    // Validazione del form
    const validateTask = useCallback(() => {
        if (!editedTask.title?.trim()) {
            setError('Il titolo è obbligatorio');
            return false;
        }
        if (!editedTask.deadline) {
            setError('La scadenza è obbligatoria');
            return false;
        }
        return true;
    }, [editedTask]);

    const handleEditTask = async () => {
        if (!validateTask()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/tasks/update/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(editedTask),
            });

            if (response.ok) {
                const updatedTask = await response.json();
                setShowModal(false);
                setError('');
                
                if (onTaskUpdate) {
                    onTaskUpdate(updatedTask);
                } else {
                    window.location.reload();
                }

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

    const handleDeleteTask = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:3000/tasks/delete/${task._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                setShowModal(false);
                
                if (onTaskDelete) {
                    onTaskDelete(task._id);
                } else {
                    window.location.reload();
                }

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

    // Funzione per determinare lo stato e il colore del badge usando virtualTime
    const getTaskStatus = () => {
        const now = new Date(virtualTime);
        const deadline = new Date(task.deadline);
        
        if (task.isCompleted) {
            return { text: 'Completata', variant: 'success' };
        } else if (deadline < now) {
            return { text: 'In Ritardo', variant: 'danger' };
        } else if (deadline.toDateString() === now.toDateString()) {
            return { text: 'Scade Oggi', variant: 'warning' };
        } else if (deadline > now) {
            return { text: 'In Corso', variant: 'primary' };
        }
        return { text: 'Attività', variant: 'info' };
    };

    const status = getTaskStatus();

    const handleModalClose = () => {
        setShowModal(false);
        setEditedTask({ ...task });
        setError('');
    };

    return (
        <>
            <ListGroup.Item className="mb-2 border-0">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="mb-0">{task.title}</h6>
                    <Badge bg={status.variant} pill>{status.text}</Badge>
                </div>
                
                <div className="mb-1">
                    <small className="badge bg-info me-1">✅ Attività</small>
                </div>

                <Row className="mb-1">
                    <Col>
                        <div className="mb-1">
                            <small className="text-muted">📅 </small>
                            <small><strong>Scadenza:</strong> {new Date(task.deadline).toLocaleDateString('it-IT')}</small>
                        </div>
                        
                        {task.description && (
                            <div className="mb-1">
                                <small className="text-muted">📝 </small>
                                <small><strong>Descrizione:</strong> {task.description}</small>
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
                    
                    <Button 
                        variant="outline-danger" 
                        size="sm"
                        className="py-0"
                        onClick={handleDeleteTask}
                        disabled={loading}
                    >
                        🗑️
                    </Button>
                </div>
            </ListGroup.Item>

            {/* Modal di modifica */}
            <Modal show={showModal} onHide={handleModalClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>✏️ Modifica Attività</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                    
                    <Form>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Titolo *</Form.Label>
                            <Form.Control
                                type="text"
                                value={editedTask.title || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                                isInvalid={!!error && !editedTask.title?.trim()}
                                placeholder="Inserisci il titolo dell'attività"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>📝 Descrizione</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Inserisci una descrizione (opzionale)"
                                value={editedTask.description || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDeadline">
                            <Form.Label>Scadenza *</Form.Label>
                            <Form.Control
                                type="date"
                                value={editedTask.deadline?.slice(0, 10) || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, deadline: e.target.value })}
                                isInvalid={!!error && !editedTask.deadline}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="formIsCompleted">
                            <Form.Switch
                                label="✅ Attività completata"
                                checked={editedTask.isCompleted || false}
                                onChange={(e) => setEditedTask({ ...editedTask, isCompleted: e.target.checked })}
                            />
                        </Form.Group>
                        
                        <div className="d-flex justify-content-between">
                            <Button 
                                variant="primary" 
                                onClick={handleEditTask} 
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
        </>
    );
};

export default SingleTaskPreview;