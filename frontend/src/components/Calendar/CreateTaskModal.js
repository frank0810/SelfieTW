import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateTaskModal = ({ show, handleClose, handleCreate, defaultDeadline }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date(defaultDeadline).toLocaleDateString('en-CA'));
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setDeadline(new Date(defaultDeadline).toLocaleDateString('en-CA'));
  }, [defaultDeadline]);

  const onCreate = () => {
    handleCreate({
      title,
      description,
      deadline,
      isCompleted
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Crea Nuova Attività</Modal.Title>
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
          <Form.Group controlId="formDescription">
            <Form.Label>Descrizione</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci la descrizione"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDeadline">
            <Form.Label>Scadenza</Form.Label>
            <Form.Control
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formIsCompleted" className="me-3 mt-3">
            <Form.Switch
              type="checkbox"
              label="Attività completata"
              checked={isCompleted}
              onChange={(e) => setIsCompleted(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Annulla</Button>
        <Button variant="primary" onClick={onCreate}>Crea Attività</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTaskModal;
