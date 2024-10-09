import React, { useState } from 'react';
import { ListGroup, Button, Row, Col, Modal, Form } from 'react-bootstrap';

const SingleTaskComponent = ({ task, fetchTasks, virtualTime }) => {
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleCompleteTask = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tasks/update/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isCompleted: true})  // Cambia lo stato a completata
      });
      window.location.reload()

      if (response.ok) {
        setIsCompleted(true);  // Aggiorna lo stato localmente
        fetchTasks();  // Ricarica le attività per riflettere il cambiamento
      } else {
        console.error('Errore nel completamento dell\'attività');
      }
    } catch (error) {
      console.error('Errore nella richiesta di completamento dell\'attività:', error);
    }
  };

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

      if (response.ok) {
        setShowEditModal(false);
        setIsCompleted(editedTask.isCompleted);  // Aggiorna lo stato nella TaskList
        fetchTasks(); // Ricarica le attività
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
        setShowEditModal(false);
        fetchTasks(); // Ricarica le attività
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Errore nella cancellazione dell\'attività:', error);
    }
  };

  // Logica per determinare lo stato dell'attività (Completata, Scaduta, In corso)

  const isTaskOverdue = new Date(task.deadline) < new Date(virtualTime) && !editedTask.isCompleted;
  const taskStatus = editedTask.isCompleted ? 'Completata' : isTaskOverdue ? 'In Ritardo' : 'In corso';

  return (
    <>
      <ListGroup.Item className="text-center">
        <Row className="align-items-center">
          <Col>{task.title}</Col>
          <Col>{task.deadline.slice(0, 10)}</Col>
          <Col>{taskStatus}</Col>
          <Col>
            <Button onClick={() => setShowEditModal(true)} variant="warning">
              Modifica
            </Button>
          </Col>
          <Col>
            <Button onClick={handleCompleteTask} variant="success" disabled={isCompleted}>
              {isCompleted ? 'Completata' : 'Completa'}
            </Button>
          </Col>
        </Row>
      </ListGroup.Item>

      {/* Modal di modifica */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
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
    </>
  );
};

export default SingleTaskComponent;
